import { container } from '@/core/container';
import { Player } from '@/lavalink/structures/player';
import { TrackUtils } from '@/lavalink/structures/utils';
import { Track } from '@/interfaces/player';
import YTMusicAPI from '@/utils/ytmusic-api/request';

const PNPT_CACHE_TTL = 3600; // 1 hour

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
          return filtered.slice(0, 10);
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
        const trackPromises = rawTracks
          .slice(0, 15)
          .map(async (trackData: any) => {
            try {
              const itemVideoId = trackData.videoId || trackData.id;
              if (!itemVideoId || itemVideoId === videoId) return null;

              const searchRes = await player.search(
                `https://www.youtube.com/watch?v=${itemVideoId}`,
                refTrack.requester,
              ).catch(() => null);
              return searchRes?.tracks?.[0] || null;
            } catch {
              return null;
            }
          });

        const resolved = (await Promise.all(trackPromises)).filter(Boolean) as Track[];
        if (resolved.length > 0) {
          fetchedTracks = resolved.filter((t) => isSongOnly(t));
        }
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
          const trackPromises = items.slice(0, 10).map(async (item: any) => {
            const itemVideoId = item.id || item.video_id || item.videoId;
            if (!itemVideoId || itemVideoId === videoId) return null;
            const searchRes = await player.search(
              `https://www.youtube.com/watch?v=${itemVideoId}`,
              refTrack.requester,
            ).catch(() => null);
            return searchRes?.tracks?.[0] || null;
          });
          const resolved = (await Promise.all(trackPromises)).filter(Boolean) as Track[];
          if (resolved.length > 0) {
            fetchedTracks = resolved.filter((t) => isSongOnly(t));
          }
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
          .filter((t) => t.identifier !== videoId && isSongOnly(t));
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
    .filter((t) => t.identifier && !existingIds.has(t.identifier))
    .slice(0, 10);
}
