import { Elysia, t } from 'elysia';
import { container } from '@/core/container';
import { type Lyric, type TimestampLyrics } from '@/interfaces/player';
import { parseLyrics } from '@/utils/parser';
import YTMusicAPI from '@/utils/ytmusic-api/request';

async function fetchJson(url: string): Promise<{ status: number; data: any } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: any = await res.json().catch(() => null);
    return { status: res.status, data };
  } catch {
    return null;
  }
}

export type SearchLyricEngine =
  | 'ytmusic_android'
  | 'ytmusic_web'
  | 'pyytmusic'
  | 'boidu'
  | 'lrclib'
  | 'textyl';

export async function fetchLyrics(
  engine: 'ytmusic_web' | 'ytmusic_android',
  v: string,
  author?: string,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: 'pyytmusic',
  v: string,
  userId?: string,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: 'boidu' | 'lrclib',
  title: string,
  author: string,
  duration?: number,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: 'textyl',
  title: string,
  author: string,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: SearchLyricEngine,
  arg1: string,
  arg2?: string,
  arg3?: number,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: SearchLyricEngine,
  arg1: string,
  arg2?: string,
  arg3?: number,
): Promise<false | Lyric> {
  switch (engine) {
    case 'pyytmusic': {
      if (!arg1 || arg1 === 'undefined' || arg1 === 'null') return false;

      const uid = arg2 || 'pona_system';
      try {
        const watchRes = await YTMusicAPI(
          'GET',
          `watch/playlist/${encodeURIComponent(arg1)}?limit=1`,
          undefined,
          undefined,
          uid,
        );
        const lyricsBrowseId: string | undefined = watchRes?.data?.result?.lyrics;
        if (!lyricsBrowseId) return false;

        const lyricsRes = await YTMusicAPI(
          'GET',
          `browsing/lyrics/${encodeURIComponent(lyricsBrowseId)}?timestamps=true`,
          undefined,
          undefined,
          uid,
        );
        const lyricsResult = lyricsRes?.data?.result;
        if (!lyricsResult) return false;

        if (lyricsResult.hasTimestamps && Array.isArray(lyricsResult.lyrics)) {
          const timestampLyrics: TimestampLyrics[] = lyricsResult.lyrics.map((line: any) => ({
            seconds: (line.start_time_ms ?? line.startTimeMs ?? 0) / 1000,
            lyrics: line.text ?? line.line ?? '',
          }));
          if (timestampLyrics.length > 0) {
            return { isTimestamp: true, lyrics: timestampLyrics };
          }
        }

        if (lyricsResult.lyrics && typeof lyricsResult.lyrics === 'string') {
          const lines = lyricsResult.lyrics.split('\n').filter(Boolean);
          return { isTimestamp: false, lyrics: lines };
        }

        return false;
      } catch {
        return false;
      }
    }
    case 'ytmusic_android': {
      if (!arg1 || arg1 === 'undefined' || arg1 === 'null') return false;

      try {
        const lyricsData: any = await container.ytmusic.client.music.getLyrics(arg1).catch(() => null);
        if (lyricsData) {
          if (lyricsData.description?.text) {
            const lines = String(lyricsData.description.text).split('\n').filter(Boolean);
            return {
              isTimestamp: false,
              lyrics: lines,
            };
          }
        }
        return false;
      } catch {
        return false;
      }
    }
    case 'ytmusic_web': {
      const searchTerm = arg1 && arg2 ? `${arg1} ${arg2}` : arg1;
      if (!searchTerm || searchTerm === 'undefined' || searchTerm === 'null') return false;
      try {
        const yt = container.ytmusic.client;
        const searcher = await yt.music.search(searchTerm).catch(() => null);

        const song = searcher?.songs?.contents?.[0];
        if (!song || !song.id) return false;

        const info = await yt.music.getInfo(song.id).catch(() => null);
        const lyricsData: any = info ? await info.getLyrics().catch(() => null) : null;
        if (!lyricsData) return false;

        if (lyricsData.description?.text) {
          return {
            isTimestamp: false,
            lyrics: String(lyricsData.description.text).split('\n').filter(Boolean),
          };
        }
        return false;
      } catch {
        return false;
      }
    }
    case 'boidu': {
      if (!arg1 || !arg2) return false;
      const searchUrl = `https://boidu.ponlponl123.com/api/lyrics?title=${encodeURIComponent(arg1)}&artist=${encodeURIComponent(arg2)}`;
      const res = await fetchJson(searchUrl);
      if (res && res.status === 200 && res.data?.lyrics) {
        return {
          isTimestamp: false,
          lyrics: res.data.lyrics,
        };
      }
      return false;
    }
    case 'lrclib': {
      if (!arg1 || !arg2) return false;
      let searchUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(arg2)}&track_name=${encodeURIComponent(arg1)}`;
      if (arg3 && arg3 > 0) {
        const durSeconds = arg3 > 10000 ? Math.floor(arg3 / 1000) : Math.floor(arg3);
        searchUrl += `&duration=${durSeconds}`;
      }

      const res = await fetchJson(searchUrl);
      if (res && res.status === 200 && res.data) {
        const data = res.data;
        if (data.syncedLyrics) {
          return parseLyrics(data.syncedLyrics);
        } else if (data.plainLyrics) {
          return {
            isTimestamp: false,
            lyrics: data.plainLyrics.split('\n'),
          };
        }
      }
      return false;
    }
    case 'textyl': {
      if (!arg1 || !arg2) return false;
      const searchUrl = `https://textyl.ponlponl123.com/api/lyrics?q=${encodeURIComponent(`${arg1} ${arg2}`)}`;
      const res = await fetchJson(searchUrl);
      if (res && res.status === 200 && res.data?.lyrics) {
        return {
          isTimestamp: false,
          lyrics: res.data.lyrics,
        };
      }
      return false;
    }
    default:
      return false;
  }
}

export default new Elysia().get(
  '/lyrics',
  async ({ query, set }) => {
    try {
      const { title, author, duration, v, id, engine, uid, userId } = query;
      const videoId = v || id;
      const requesterUserId = (uid || userId || 'pona_system') as string;
      const searchEngine = (engine || 'dynamic') as
        | SearchLyricEngine
        | 'dynamic'
        | 'ytmusic';

      switch (searchEngine) {
        case 'dynamic': {
          if ((!title || !author) && !videoId) {
            set.status = 400;
            return { error: 'Missing required parameters' };
          }

          let fallbackPlainLyrics: Lyric | false = false;

          if (videoId) {
            try {
              const res = await fetchLyrics('pyytmusic', String(videoId), requesterUserId);
              if (res) {
                if (res.isTimestamp) { set.status = 200; return res; }
                if (!fallbackPlainLyrics) fallbackPlainLyrics = res;
              }
            } catch {}
          }

          if (title && author) {
            try {
              const res = await fetchLyrics('lrclib', String(title), String(author), duration);
              if (res) {
                if (res.isTimestamp) { set.status = 200; return res; }
                if (!fallbackPlainLyrics) fallbackPlainLyrics = res;
              }
            } catch {}
          }

          if (videoId) {
            try {
              const res = await fetchLyrics('ytmusic_android', String(videoId));
              if (res && !fallbackPlainLyrics) fallbackPlainLyrics = res;
            } catch {}
          }

          if (title && author && !fallbackPlainLyrics) {
            try {
              const res = await fetchLyrics('boidu', String(title), String(author));
              if (res) fallbackPlainLyrics = res;
            } catch {}
          }

          if (title && author && !fallbackPlainLyrics) {
            try {
              const res = await fetchLyrics('textyl', String(title), String(author));
              if (res) fallbackPlainLyrics = res;
            } catch {}
          }

          if (!videoId && title && author && !fallbackPlainLyrics) {
            try {
              const res = await fetchLyrics('ytmusic_web', String(title), String(author));
              if (res) fallbackPlainLyrics = res;
            } catch {}
          }

          if (fallbackPlainLyrics) {
            set.status = 200;
            return fallbackPlainLyrics;
          }

          set.status = 404;
          return { error: 'Lyrics not found' };
        }
        case 'ytmusic': {
          if (!videoId) {
            set.status = 400;
            return { error: 'Missing required parameters' };
          }

          try {
            const lyrics = await fetchLyrics('pyytmusic', String(videoId), requesterUserId);
            if (lyrics) {
              set.status = 200;
              return lyrics;
            }

            const fallback = await fetchLyrics('ytmusic_android', String(videoId));
            if (fallback) {
              set.status = 200;
              return fallback;
            }

            set.status = 404;
            return { error: 'Lyrics not found' };
          } catch (err) {
            set.status = 500;
            return { error: String(err) };
          }
        }
        default: {
          try {
            const lyrics = await fetchLyrics(
              searchEngine,
              String(title || videoId || ''),
              String(author || ''),
              duration,
            );
            if (lyrics) {
              set.status = 200;
              return lyrics;
            }
            set.status = 404;
            return { error: 'Lyrics not found' };
          } catch (err) {
            set.status = 500;
            return { error: String(err) };
          }
        }
      }
    } catch (err) {
      console.error(err);
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  },
  {
    query: t.Object({
      title: t.Optional(t.String()),
      author: t.Optional(t.String()),
      duration: t.Optional(t.Numeric()),
      v: t.Optional(t.String()),
      id: t.Optional(t.String()),
      uid: t.Optional(t.String()),
      userId: t.Optional(t.String()),
      engine: t.Optional(
        t.Union([
          t.Literal('dynamic'),
          t.Literal('ytmusic'),
          t.Literal('pyytmusic'),
          t.Literal('boidu'),
          t.Literal('lrclib'),
          t.Literal('textyl'),
        ]),
      ),
    }),
  },
);
