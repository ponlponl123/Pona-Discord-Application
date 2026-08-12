import { container } from '@/core/container';
import { Player } from '@/lavalink/structures/player';
import { TrackUtils } from '@/lavalink/structures/utils';
import { Track } from '@/interfaces/player';
import YTMusicAPI from '@/utils/ytmusic-api/request';

const PNPT_CACHE_TTL = 3600; // 1 hour
const TRACK_CACHE_TTL = 1800; // 30 min for individual track cache
const MAX_CONCURRENT_SEARCHES = parseInt(process.env.PNPT_MAX_CONCURRENT || '15', 10); // Configurable concurrency
const SEARCH_TIMEOUT_MS = parseInt(process.env.PNPT_SEARCH_TIMEOUT || '5000', 10); // Configurable timeout

/**
 * Wrap a promise with a timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

/**
 * Execute async tasks with concurrency limit
 * Prevents overwhelming Lavalink with too many simultaneous requests
 */
async function executeWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrent: number,
): Promise<(T | null)[]> {
  const results: (T | null)[] = new Array(tasks.length);
  let activeCount = 0;
  let taskIndex = 0;

  return new Promise((resolve) => {
    const processNext = async () => {
      if (taskIndex >= tasks.length) {
        if (activeCount === 0) {
          resolve(results);
        }
        return;
      }

      if (activeCount >= maxConcurrent) return;

      const currentIndex = taskIndex++;
      activeCount++;

      try {
        const result = await tasks[currentIndex]();
        results[currentIndex] = result;
      } catch (error) {
        results[currentIndex] = null;
      }

      activeCount--;
      processNext();
      processNext();
    };

    for (let i = 0; i < maxConcurrent; i++) {
      processNext();
    }
  });
}

/**
 * Get individual track from cache by videoId
 */
async function getTracksFromCache(videoIds: string[]): Promise<Map<string, Track | null>> {
  const cacheMap = new Map<string, Track | null>();
  
  if (!container.redis?.redis || videoIds.length === 0) {
    videoIds.forEach(id => cacheMap.set(id, null));
    return cacheMap;
  }

  try {
    const cacheKeys = videoIds.map(id => `track:${id}`);
    const cached = await container.redis.redis.mget(...cacheKeys);
    
    videoIds.forEach((id, idx) => {
      try {
        const data = cached[idx];
        cacheMap.set(id, data ? JSON.parse(data as string) : null);
      } catch {
        cacheMap.set(id, null);
      }
    });
  } catch (error) {
    console.error('[PNPT Track Cache Retrieval Error]:', error);
    videoIds.forEach(id => cacheMap.set(id, null));
  }

  return cacheMap;
}

/**
 * Set individual track in cache
 */
async function setTrackCache(videoId: string, track: Track): Promise<void> {
  if (!container.redis?.redis) return;
  
  try {
    await container.redis.redis.setex(
      `track:${videoId}`,
      TRACK_CACHE_TTL,
      JSON.stringify(track),
    );
  } catch (error) {
    console.error(`[PNPT Track Cache Set Error] ${videoId}:`, error);
  }
}

function extractVideoId(track: Track): string | null {
  if (track.identifier && track.identifier.length === 11) {
    return track.identifier;
  }
  if (track.uri) {
    const match = track.uri.match(/(?:v=|\/embed\/|\/1.1\/|youtu\.be\/|\/v\/)([^#&?]*)/);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }
  return null;
}

/**
 * Check if a track is a song (not a music video)
 * Returns true if the track is NOT a music video
 */
function isSongOnly(track: Track): boolean {
  if (!track.videoInfo) return true;
  const videoType = (track.videoInfo as any)?.musicVideoType;
  if (videoType && (videoType === 'MUSIC_VIDEO_TYPE_OMV' || videoType === 'MUSIC_VIDEO_TYPE_UGC')) {
    return false;
  }
  return true;
}

export async function fetchAndCachePNPT(
  player: Player,
  refTrack: Track,
): Promise<Track[]> {
  if (!refTrack) return [];

  const videoId = extractVideoId(refTrack);
  if (!videoId) return [];

  const redisKey = `guild:pnpt:${videoId}`;
  const existingIds = new Set<string>();

  if (player.queue.current?.identifier) {
    existingIds.add(player.queue.current.identifier);
  }
  for (const t of player.queue) {
    if (t.identifier) existingIds.add(t.identifier);
  }
  for (const t of player.queuePNPT) {
    if (t.identifier) existingIds.add(t.identifier);
  }

  // 1. Try Redis cache hit
  try {
    if (container.redis?.redis) {
      const cached = await container.redis.redis.get(redisKey);
      if (cached) {
        const cachedTracks = JSON.parse(cached) as Track[];
        const filtered = cachedTracks
          .filter((t) => isSongOnly(t)) // Filter out music videos
          .map((t) => TrackUtils.markAsTrack(Object.assign(t, { requester: refTrack.requester, _isPNPT: true })))
          .filter((t) => t.identifier && !existingIds.has(t.identifier));
        if (filtered.length > 0) {
          return filtered;
        }
      }
    }
  } catch (error) {
    console.error(`[PNPT Cache Error] ${videoId}:`, error);
  }

  let fetchedTracks: Track[] = [];

  // 2. Primary: py-ytmusic-api watch/playlist endpoint via YTMusicAPI request helper
  try {
    const requesterId = (refTrack.requester as any)?.id;
    const watchPlaylistRes = await YTMusicAPI('GET', `watch/playlist/${videoId}?radio=true`, undefined, undefined, requesterId);
    if (watchPlaylistRes?.data) {
      const watchPlaylistData = watchPlaylistRes.data;
      const rawTracks = watchPlaylistData?.result?.tracks || watchPlaylistData?.tracks || watchPlaylistData?.contents || [];
      if (Array.isArray(rawTracks) && rawTracks.length > 0) {
        // Extract and deduplicate video IDs
        const videoIds = Array.from(new Set(
          rawTracks
            .map((t: any) => t.videoId || t.id)
            .filter((id: any): id is string => !!id && id !== videoId)
        )) as string[];

        // Batch fetch from cache first
        const cachedTracks = await getTracksFromCache(videoIds);
        const cachedFiltered = Array.from(cachedTracks.values())
          .filter((t): t is Track => t !== null)
          .filter(t => !existingIds.has(t.identifier));

        // Identify which tracks need searching
        const toSearch = videoIds.filter((id: string) => !cachedTracks.has(id) || cachedTracks.get(id) === null);

        // Create search tasks for uncached tracks
        const searchTasks = toSearch.map((itemVideoId: string) => async () => {
          try {
            const searchRes = await withTimeout(
              player.search(
                `https://www.youtube.com/watch?v=${itemVideoId}`,
                refTrack.requester,
              ),
              SEARCH_TIMEOUT_MS,
            );
            const track = searchRes?.tracks?.[0] || null;
            
            // Cache successful results
            if (track && isSongOnly(track)) {
              await setTrackCache(itemVideoId, track);
              return track;
            }
            return null;
          } catch {
            return null;
          }
        });

        // Execute searches with concurrency limit
        const searchResults = await executeWithConcurrency(searchTasks, MAX_CONCURRENT_SEARCHES);
        const searchedTracks = searchResults
          .filter((t): t is Track => t !== null)
          .filter(t => !existingIds.has(t.identifier));

        // Combine cached and newly searched tracks
        fetchedTracks = [...cachedFiltered, ...searchedTracks]
          .filter((t) => isSongOnly(t));
      }
    }
  } catch (err) {
    console.warn(`[PNPT py-ytmusic-api Fetch Warning] get_watch_playlist failed for ${videoId}:`, err);
  }

  // 3. Secondary: YTMusic getInfo / getRelated via youtubei.js
  if (fetchedTracks.length === 0) {
    try {
      if (container.ytmusic?.client?.music) {
        const info = await (container.ytmusic.client.music as any).getInfo(videoId).catch(() => null);
        if (info && (info.watch_next_feed || info.related)) {
          const items = info.watch_next_feed || info.related || [];
          
          // Extract and deduplicate video IDs
          const videoIds = Array.from(new Set(
            items
              .map((i: any) => i.id || i.video_id || i.videoId)
              .filter((id: any): id is string => !!id && id !== videoId)
          )) as string[];

          // Batch fetch from cache first
          const cachedTracks = await getTracksFromCache(videoIds);
          const cachedFiltered = Array.from(cachedTracks.values())
            .filter((t): t is Track => t !== null)
            .filter(t => !existingIds.has(t.identifier));

          // Identify which tracks need searching
          const toSearch = videoIds.filter((id: string) => !cachedTracks.has(id) || cachedTracks.get(id) === null);

          // Create search tasks
          const searchTasks = toSearch.map((itemVideoId: string) => async () => {
            try {
              const searchRes = await withTimeout(
                player.search(
                  `https://www.youtube.com/watch?v=${itemVideoId}`,
                  refTrack.requester,
                ),
                SEARCH_TIMEOUT_MS,
              );
              const track = searchRes?.tracks?.[0] || null;
              
              if (track && isSongOnly(track)) {
                await setTrackCache(itemVideoId, track);
                return track;
              }
              return null;
            } catch {
              return null;
            }
          });

          // Execute searches with concurrency limit
          const searchResults = await executeWithConcurrency(searchTasks, MAX_CONCURRENT_SEARCHES);
          const searchedTracks = searchResults
            .filter((t): t is Track => t !== null)
            .filter(t => !existingIds.has(t.identifier));

          // Combine cached and newly searched tracks
          fetchedTracks = [...cachedFiltered, ...searchedTracks]
            .filter(t => isSongOnly(t));
        }
      }
    } catch (err) {
      console.warn(`[PNPT Secondary Fetch Warning] YTMusic info failed for ${videoId}:`, err);
    }
  }

  // 4. Fallback: YouTube RD playlist search
  if (fetchedTracks.length === 0) {
    try {
      const searchURI = `https://www.youtube.com/watch?v=${videoId}&list=RD${videoId}`;
      const searchRes = await player.search(searchURI, refTrack.requester);
      if (searchRes) {
        let rawList: Track[] = [];
        if (searchRes.loadType === 'playlist' && searchRes.playlist?.tracks) {
          rawList = searchRes.playlist.tracks;
        } else if (searchRes.tracks && searchRes.tracks.length > 0) {
          rawList = searchRes.tracks;
        }
        fetchedTracks = rawList
          .filter((t) => t.identifier !== videoId && isSongOnly(t) && !existingIds.has(t.identifier));
        
        // Cache the fallback tracks
        for (const track of fetchedTracks.slice(0, 10)) {
          const trackVideoId = extractVideoId(track);
          if (trackVideoId) {
            await setTrackCache(trackVideoId, track);
          }
        }
      }
    } catch (err) {
      console.error(`[PNPT Fallback Fetch Error] for ${videoId}:`, err);
    }
  }

  if (fetchedTracks.length === 0) return [];

  // Prepare and tag tracks
  const processedTracks = fetchedTracks.map((t) =>
    TrackUtils.markAsTrack(Object.assign(t, { requester: refTrack.requester, _isPNPT: true })),
  );

  // Cache in Redis for 1 hour
  try {
    if (container.redis?.redis) {
      await container.redis.redis.setex(
        redisKey,
        PNPT_CACHE_TTL,
        JSON.stringify(processedTracks),
      );
    }
  } catch (error) {
    console.error(`[PNPT Cache Set Error] ${videoId}:`, error);
  }

  return processedTracks
    .filter((t) => t.identifier && !existingIds.has(t.identifier));
}
