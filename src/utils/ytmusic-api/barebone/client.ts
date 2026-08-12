import type { TimedLyricsRes } from '@/interfaces/lyrics';
import { traverse, traverseList, traverseString } from '@/utils/ytmusic-api/barebone/traverse';

export const ANDROID_CLIENTNAME = 'ANDROID_MUSIC';
export const ANDROID_CLIENTVERSION = '8.05.50';

export class TSYTMusicClient {
  private config: Record<string, string> | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize ytcfg config by fetching https://music.youtube.com/
   */
  public async initialize(): Promise<this> {
    if (this.config) return this;
    if (this.initPromise) {
      await this.initPromise;
      return this;
    }

    this.initPromise = (async () => {
      try {
        const res = await fetch('https://music.youtube.com/', {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
        const html = await res.text();
        const matches = [...html.matchAll(/ytcfg\.set\((\{.*?\})\)\s*;/gs)];
        const setConfigs = matches.map((match) => match[1]);

        let mergedConfig: Record<string, string> = {};
        for (const s of setConfigs) {
          try {
            const parsed = JSON.parse(s);
            if (parsed && typeof parsed === 'object') {
              mergedConfig = { ...mergedConfig, ...parsed };
            }
          } catch {
            // Ignore parse errors
          }
        }

        this.config = mergedConfig;
      } catch {
        this.config = {};
      }
    })();

    await this.initPromise;
    return this;
  }

  /**
   * Direct InnerTube API constructRequest implementation from ts-npm-ytmusic-api
   */
  public async constructRequest(
    endpoint: string,
    body: Record<string, any> = {},
    query: Record<string, string> = {},
    options?: {
      clientName?: string;
      clientVersion?: string;
    },
  ): Promise<any> {
    await this.initialize();

    const apiKey = this.config?.INNERTUBE_API_KEY || '';
    const apiVersion = this.config?.INNERTUBE_API_VERSION || 'v1';

    const clientName = options?.clientName || this.config?.INNERTUBE_CLIENT_NAME || 'WEB_REMIX';
    const clientVersion = options?.clientVersion || this.config?.INNERTUBE_CLIENT_VERSION || '1.20240101.01.00';

    const searchParams = new URLSearchParams({
      ...query,
      alt: 'json',
      ...(apiKey ? { key: apiKey } : {}),
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'x-origin': 'https://music.youtube.com',
      'X-Goog-Visitor-Id': this.config?.VISITOR_DATA || '',
      'X-YouTube-Client-Name': clientName === 'ANDROID_MUSIC' ? '21' : '67',
      'X-YouTube-Client-Version': clientVersion,
      'X-YouTube-Utc-Offset': String(-new Date().getTimezoneOffset()),
      'X-YouTube-Time-Zone': new Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const payload = {
      context: {
        capabilities: {},
        client: {
          clientName,
          clientVersion,
          experimentIds: [],
          experimentsToken: '',
          gl: this.config?.GL || 'US',
          hl: this.config?.HL || 'en',
          utcOffsetMinutes: -new Date().getTimezoneOffset(),
        },
      },
      ...body,
    };

    const url = `https://music.youtube.com/youtubei/${apiVersion}/${endpoint}?${searchParams.toString()}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    return await res.json().catch(() => null);
  }

  /**
   * Exact getLyrics function copied from ts-npm-ytmusic-api/src/YTMusic.ts
   */
  public async getLyrics(videoId: string): Promise<string[] | null>;
  public async getLyrics(videoId: string, timestamp: true): Promise<TimedLyricsRes | null>;
  public async getLyrics(
    videoId: string,
    timestamp?: boolean,
  ): Promise<string[] | TimedLyricsRes | null> {
    if (!videoId || !videoId.match(/^[a-zA-Z0-9-_]{11}$/)) throw new Error('Invalid videoId');

    const data = await this.constructRequest('next', { videoId });
    if (!data) return null;

    const browseId = traverse(traverseList(data, 'tabs', 'tabRenderer')[1], 'browseId');
    if (!browseId) return null;

    if (timestamp) {
      const lyricsData = await this.constructRequest(
        'browse',
        { browseId },
        undefined,
        { clientName: ANDROID_CLIENTNAME, clientVersion: ANDROID_CLIENTVERSION },
      );
      if (!lyricsData) return null;

      const timedLyrics = traverse(lyricsData, 'contents', 'type', 'lyricsData');
      if (!timedLyrics || !timedLyrics.timedLyricsData || !timedLyrics.sourceMessage) return null;

      return {
        timedLyricsData: timedLyrics.timedLyricsData,
        sourceMessage: timedLyrics.sourceMessage,
      } as TimedLyricsRes;
    }

    const lyricsData = await this.constructRequest('browse', { browseId });
    if (!lyricsData) return null;

    const lyrics = traverseString(lyricsData, 'description', 'runs', 'text');

    return lyrics
      ? lyrics
        .replaceAll('\r', '')
        .split('\n')
        .filter((v) => !!v)
      : null;
  }
}

export const tsYtmusicClient = new TSYTMusicClient();
