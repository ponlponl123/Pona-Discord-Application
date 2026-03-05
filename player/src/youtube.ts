/**
 * pona-player – YouTube Innertube extractor
 *
 * Custom extraction using YouTube's internal API (Innertube).
 * No external npm audio packages needed — uses native fetch + FFmpeg.
 */

import type { Extractor, ExtractorInfo, TrackInfo } from './types';
import { extractVideoId, extractPlaylistId, parseDuration } from './utils';

// ─── Innertube Client Contexts ────────────────────────────────────────────────

const IOS_CLIENT = {
  clientName: 'IOS',
  clientVersion: '19.45.4',
  deviceMake: 'Apple',
  deviceModel: 'iPhone16,2',
  osName: 'iPhone',
  osVersion: '17.5.1.21F90',
  hl: 'en',
  gl: 'US',
};

const WEB_CLIENT = {
  clientName: 'WEB',
  clientVersion: '2.20250101.00.00',
  hl: 'en',
  gl: 'US',
};

const WEB_REMIX_CLIENT = {
  clientName: 'WEB_REMIX',
  clientVersion: '1.20250101.00.00',
  hl: 'en',
  gl: 'US',
};

const ANDROID_CLIENT = {
  clientName: 'ANDROID',
  clientVersion: '19.44.38',
  androidSdkVersion: 34,
  osName: 'Android',
  osVersion: '14',
  hl: 'en',
  gl: 'US',
};

// ─── API Keys (public, embedded in YouTube clients) ───────────────────────────

const API_KEY_IOS = 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc';
const API_KEY_WEB = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
const API_KEY_MUSIC = 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30';

// ─── Types for Innertube Responses ────────────────────────────────────────────

interface InnertubeFormat {
  itag: number;
  url?: string;
  signatureCipher?: string;
  mimeType: string;
  bitrate: number;
  contentLength?: string;
  audioQuality?: string;
  audioSampleRate?: string;
  audioChannels?: number;
  approxDurationMs?: string;
}

interface InnertubePlayerResponse {
  videoDetails?: {
    videoId: string;
    title: string;
    lengthSeconds: string;
    channelId: string;
    author: string;
    shortDescription?: string;
    thumbnail?: {
      thumbnails: Array<{ url: string; width: number; height: number }>;
    };
    viewCount?: string;
    isLiveContent?: boolean;
    isLive?: boolean;
  };
  streamingData?: {
    expiresInSeconds: string;
    formats?: InnertubeFormat[];
    adaptiveFormats?: InnertubeFormat[];
  };
  playabilityStatus?: {
    status: string;
    reason?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// ─── YouTube Extractor ────────────────────────────────────────────────────────

export class YouTubeExtractor implements Extractor {
  public readonly name = 'youtube';

  /** Stream URL cache: videoId → { url, expiresAt } */
  private streamCache = new Map<string, { url: string; expiresAt: number }>();

  // ─── Validate ─────────────────────────────────────────────────────────────

  public validate(query: string): boolean {
    return /(?:youtube\.com|youtu\.be|music\.youtube\.com)/i.test(query);
  }

  // ─── Extract (URL → tracks) ───────────────────────────────────────────────

  public async extract(url: string): Promise<ExtractorInfo> {
    const playlistId = extractPlaylistId(url);
    const videoId = extractVideoId(url);

    // Playlist
    if (playlistId && !videoId) {
      const tracks = await this.getPlaylist(playlistId);
      return {
        tracks,
        playlist: { name: `YouTube Playlist ${playlistId}`, tracks },
      };
    }

    // Single video
    if (videoId) {
      const info = await this.getVideoInfo(videoId);
      return { tracks: info ? [info] : [] };
    }

    return { tracks: [] };
  }

  // ─── Search ───────────────────────────────────────────────────────────────

  public async search(query: string, limit = 10): Promise<TrackInfo[]> {
    return this.searchYouTube(query, limit);
  }

  /** YouTube Music search (song results) */
  public async searchMusic(query: string, limit = 10): Promise<TrackInfo[]> {
    return this.searchYouTubeMusic(query, limit);
  }

  // ─── Stream URL ───────────────────────────────────────────────────────────

  public async getStreamUrl(identifier: string): Promise<string> {
    // Check cache
    const cached = this.streamCache.get(identifier);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.url;
    }

    // Try iOS client first (direct URLs, no cipher)
    const url = await this.fetchStreamUrl(identifier, 'ios');
    if (url) return url;

    // Fallback to Android client
    const androidUrl = await this.fetchStreamUrl(identifier, 'android');
    if (androidUrl) return androidUrl;

    throw new Error(`[YouTube] Failed to get stream URL for ${identifier}`);
  }

  // ─── Internal: Innertube API Calls ────────────────────────────────────────

  private async innertube<T = AnyRecord>(
    endpoint: string,
    body: AnyRecord,
    client: 'web' | 'ios' | 'android' | 'music' = 'web',
  ): Promise<T> {
    const clientContexts = {
      web: { context: { client: WEB_CLIENT }, key: API_KEY_WEB },
      ios: { context: { client: IOS_CLIENT }, key: API_KEY_IOS },
      android: { context: { client: ANDROID_CLIENT }, key: API_KEY_IOS },
      music: { context: { client: WEB_REMIX_CLIENT }, key: API_KEY_MUSIC },
    };

    const cfg = clientContexts[client];
    const baseUrl =
      client === 'music'
        ? 'https://music.youtube.com/youtubei/v1'
        : 'https://www.youtube.com/youtubei/v1';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (client === 'ios') {
      headers['User-Agent'] =
        'com.google.ios.youtube/19.45.4 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)';
    } else if (client === 'android') {
      headers['User-Agent'] =
        'com.google.android.youtube/19.44.38 (Linux; U; Android 14) gzip';
    } else if (client === 'music') {
      headers['Origin'] = 'https://music.youtube.com';
      headers['Referer'] = 'https://music.youtube.com/';
    }

    const res = await fetch(`${baseUrl}/${endpoint}?key=${cfg.key}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...body,
        context: cfg.context,
      }),
    });

    if (!res.ok) {
      throw new Error(`[YouTube] Innertube ${endpoint} returned ${res.status}`);
    }

    return (await res.json()) as T;
  }

  // ─── Video Info ───────────────────────────────────────────────────────────

  private async getVideoInfo(videoId: string): Promise<TrackInfo | null> {
    const data = await this.innertube<InnertubePlayerResponse>(
      'player',
      { videoId },
      'ios',
    );

    if (data.playabilityStatus?.status !== 'OK' || !data.videoDetails) {
      return null;
    }

    const v = data.videoDetails;
    const duration = parseInt(v.lengthSeconds, 10) * 1000;
    const thumbnail = v.thumbnail?.thumbnails?.at(-1)?.url ?? '';

    return {
      title: v.title,
      author: v.author,
      identifier: v.videoId,
      uri: `https://www.youtube.com/watch?v=${v.videoId}`,
      duration,
      artworkUrl: thumbnail,
      isStream: v.isLiveContent ?? false,
      isSeekable: !(v.isLiveContent ?? false),
      sourceName: 'youtube',
    };
  }

  // ─── Stream URL Fetch ─────────────────────────────────────────────────────

  private async fetchStreamUrl(
    videoId: string,
    client: 'ios' | 'android',
  ): Promise<string | null> {
    try {
      const data = await this.innertube<InnertubePlayerResponse>(
        'player',
        {
          videoId,
          playbackContext: {
            contentPlaybackContext: { signatureTimestamp: 20050 },
          },
        },
        client,
      );

      if (!data.streamingData?.adaptiveFormats) return null;

      // Pick best audio-only format (prefer opus > aac)
      const audioFormats = data.streamingData.adaptiveFormats
        .filter((f) => f.mimeType.startsWith('audio/'))
        .sort((a, b) => {
          // Prefer opus
          const aOpus = a.mimeType.includes('opus') ? 1 : 0;
          const bOpus = b.mimeType.includes('opus') ? 1 : 0;
          if (aOpus !== bOpus) return bOpus - aOpus;
          // Then highest bitrate
          return b.bitrate - a.bitrate;
        });

      const best = audioFormats[0];
      if (!best?.url) return null;

      // Cache the URL
      const expiresIn = parseInt(
        data.streamingData.expiresInSeconds ?? '21540',
        10,
      );
      this.streamCache.set(videoId, {
        url: best.url,
        expiresAt: Date.now() + (expiresIn - 300) * 1000, // 5 min buffer
      });

      return best.url;
    } catch {
      return null;
    }
  }

  // ─── YouTube Search ───────────────────────────────────────────────────────

  private async searchYouTube(
    query: string,
    limit: number,
  ): Promise<TrackInfo[]> {
    const data = await this.innertube('search', { query }, 'web');

    const results: TrackInfo[] = [];

    try {
      const sections: AnyRecord[] =
        data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
          ?.sectionListRenderer?.contents ?? [];

      for (const section of sections) {
        const items: AnyRecord[] = section?.itemSectionRenderer?.contents ?? [];

        for (const item of items) {
          if (results.length >= limit) break;

          const vr = item?.videoRenderer;
          if (!vr?.videoId) continue;

          // Skip live streams in search
          const badges: AnyRecord[] = vr.badges ?? [];
          const isLive = badges.some(
            (b: AnyRecord) =>
              b?.metadataBadgeRenderer?.label === 'LIVE' ||
              b?.metadataBadgeRenderer?.style === 'BADGE_STYLE_TYPE_LIVE_NOW',
          );

          const title = vr.title?.runs?.[0]?.text ?? 'Unknown';
          const author = vr.ownerText?.runs?.[0]?.text ?? 'Unknown';
          const durationText: string = vr.lengthText?.simpleText ?? '0:00';
          const thumbnail = vr.thumbnail?.thumbnails?.at(-1)?.url ?? '';

          results.push({
            title,
            author,
            identifier: vr.videoId,
            uri: `https://www.youtube.com/watch?v=${vr.videoId}`,
            duration: isLive ? 0 : parseDuration(durationText),
            artworkUrl: thumbnail,
            isStream: isLive,
            isSeekable: !isLive,
            sourceName: 'youtube',
          });
        }
      }
    } catch {
      // Parsing failed — return whatever we got
    }

    return results;
  }

  // ─── YouTube Music Search ─────────────────────────────────────────────────

  private async searchYouTubeMusic(
    query: string,
    limit: number,
  ): Promise<TrackInfo[]> {
    const data = await this.innertube(
      'search',
      {
        query,
        // Filter for songs
        params: 'EgWKAQIIAWoKEAkQBRAKEAMQBA==',
      },
      'music',
    );

    const results: TrackInfo[] = [];

    try {
      const tabs: AnyRecord[] =
        data?.contents?.tabbedSearchResultsRenderer?.tabs ?? [];

      for (const tab of tabs) {
        const sections: AnyRecord[] =
          tab?.tabRenderer?.content?.sectionListRenderer?.contents ?? [];

        for (const section of sections) {
          const items: AnyRecord[] =
            section?.musicShelfRenderer?.contents ?? [];

          for (const item of items) {
            if (results.length >= limit) break;

            const renderer = item?.musicResponsiveListItemRenderer;
            if (!renderer) continue;

            const videoId =
              renderer?.playlistItemData?.videoId ??
              renderer?.overlay?.musicItemThumbnailOverlayRenderer?.content
                ?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint
                ?.videoId;

            if (!videoId) continue;

            // Extract title from first flex column
            const title =
              renderer?.flexColumns?.[0]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]
                ?.text ?? 'Unknown';

            // Extract artist from second flex column
            const authorRuns: AnyRecord[] =
              renderer?.flexColumns?.[1]
                ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ?? [];
            const author =
              authorRuns
                .filter(
                  (r: AnyRecord) =>
                    r.text !== ' • ' &&
                    r.text !== ' & ' &&
                    !/^\d+:\d+$/.test(r.text),
                )
                .map((r: AnyRecord) => r.text)
                .filter(Boolean)
                .slice(0, 2)
                .join(', ') || 'Unknown';

            // Duration from last run in second column
            const durationRun = authorRuns.find((r: AnyRecord) =>
              /^\d+:\d+$/.test(r.text),
            );
            const duration = durationRun ? parseDuration(durationRun.text) : 0;

            const thumbnail =
              renderer?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.at(
                -1,
              )?.url ?? '';

            results.push({
              title,
              author,
              identifier: videoId,
              uri: `https://music.youtube.com/watch?v=${videoId}`,
              duration,
              artworkUrl: thumbnail,
              isStream: false,
              isSeekable: true,
              sourceName: 'youtube_music',
            });
          }
        }
      }
    } catch {
      // Parsing failed
    }

    return results;
  }

  // ─── Playlist ─────────────────────────────────────────────────────────────

  private async getPlaylist(playlistId: string): Promise<TrackInfo[]> {
    const data = await this.innertube(
      'browse',
      { browseId: `VL${playlistId}` },
      'web',
    );

    const results: TrackInfo[] = [];

    try {
      const tabs: AnyRecord[] =
        data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];
      const tab = tabs[0];
      const sections: AnyRecord[] =
        tab?.tabRenderer?.content?.sectionListRenderer?.contents ?? [];

      for (const section of sections) {
        const items: AnyRecord[] =
          section?.playlistVideoListRenderer?.contents ??
          section?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer
            ?.contents ??
          [];

        for (const item of items) {
          const vr = item?.playlistVideoRenderer;
          if (!vr?.videoId) continue;

          const title = vr.title?.runs?.[0]?.text ?? 'Unknown';
          const author = vr.shortBylineText?.runs?.[0]?.text ?? 'Unknown';
          const durationText: string = vr.lengthText?.simpleText ?? '0:00';
          const thumbnail = vr.thumbnail?.thumbnails?.at(-1)?.url ?? '';

          results.push({
            title,
            author,
            identifier: vr.videoId,
            uri: `https://www.youtube.com/watch?v=${vr.videoId}`,
            duration: parseDuration(durationText),
            artworkUrl: thumbnail,
            isStream: false,
            isSeekable: true,
            sourceName: 'youtube',
          });
        }
      }
    } catch {
      // Parsing failed
    }

    return results;
  }

  /** Clear the stream URL cache */
  public clearCache(): void {
    this.streamCache.clear();
  }
}
