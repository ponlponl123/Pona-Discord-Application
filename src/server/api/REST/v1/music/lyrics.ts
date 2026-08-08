import { Elysia, t } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import https from 'https';
import { container } from '@/core/container';
import { type Lyric, type TimestampLyrics } from '@/interfaces/player';
import { parseLyrics } from '@/utils/parser';

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
  | 'boidu'
  | 'lrclib'
  | 'textyl';

export async function fetchLyrics(
  engine: 'ytmusic_web' | 'ytmusic_android',
  v: string,
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
): Promise<false | Lyric> {
  switch (engine) {
    case 'ytmusic_android': {
      if (!arg1) throw Error('Missing required arguments');

      try {
        const lyricsData = await container.ytmusic.client.music.getLyrics(arg1);
        if (lyricsData && lyricsData.description?.text) {
          const lines = lyricsData.description.text.split('\n').filter(Boolean);
          return {
            isTimestamp: false,
            lyrics: lines,
          };
        }
        return false;
      } catch (err) {
        console.error(err);
        throw Error('Error fetching lyrics: ' + err);
      }
    }
    case 'ytmusic_web': {
      if (!arg1) throw Error('Missing required arguments');
      try {
        const yt = container.ytmusic.client;
        const searcher = await yt.music.search(arg1);

        const song = searcher.songs?.contents[0];
        if (!song || !song.id) return false;

        const info = await yt.music.getInfo(song.id);
        const lyricsData = await info.getLyrics();

        if (lyricsData?.description?.text) {
          return {
            isTimestamp: false,
            lyrics: lyricsData.description.text.split('\n'),
          };
        }
        return false;
      } catch (err) {
        console.error(err);
        throw Error('Error fetching lyrics: ' + err);
      }
    }
    case 'boidu': {
      if (!arg1 || !arg2) throw Error('Missing required arguments');
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
      if (!arg1 || !arg2) throw Error('Missing required arguments');
      let searchUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(arg2)}&track_name=${encodeURIComponent(arg1)}`;
      if (arg3) searchUrl += `&duration=${Math.floor(arg3 / 1000)}`;

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
      if (!arg1 || !arg2) throw Error('Missing required arguments');
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
      const { title, author, duration, v, engine } = query;
      const searchEngine = (engine || 'dynamic') as
        | SearchLyricEngine
        | 'dynamic'
        | 'ytmusic';

      switch (searchEngine) {
        case 'dynamic': {
          if (!title || !author) {
            set.status = 400;
            return { error: 'Missing required parameters' };
          }

          let lyrics;

          // prioritize lrclib for timestamped lyrics
          lyrics = await fetchLyrics(
            'lrclib',
            String(title),
            String(author),
            duration,
          );
          if (lyrics) {
            set.status = 200;
            return lyrics;
          }

          // fetch all search engines when lyrics are still not found
          const engines: SearchLyricEngine[] = [
            'lrclib',
            'ytmusic_android',
            'ytmusic_web',
            'boidu',
            'textyl',
          ] as SearchLyricEngine[];

          for (const engine of engines) {
            try {
              if (engine === 'ytmusic_web') {
                lyrics = await fetchLyrics('ytmusic_web', String(v));
              } else if (engine === 'ytmusic_android') {
                lyrics = await fetchLyrics('ytmusic_android', String(v));
              } else if (engine === 'textyl') {
                lyrics = await fetchLyrics(
                  'textyl',
                  String(title),
                  String(author),
                );
              } else {
                lyrics = await fetchLyrics(
                  engine,
                  String(title),
                  String(author),
                  duration,
                );
              }

              if (lyrics) {
                set.status = 200;
                return lyrics;
              }
            } catch {
              continue;
            }
          }

          if (!lyrics) {
            set.status = 404;
            return { error: 'Lyrics not found' };
          }
          set.status = HttpStatusCode.Gone;
          return { message: 'Where i am now?' };
        }
        case 'ytmusic': {
          if (!v) {
            set.status = 400;
            return { error: 'Missing required parameters' };
          }

          try {
            const lyrics = await fetchLyrics('ytmusic_android', String(v));
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
        default: {
          try {
            const lyrics = await fetchLyrics(
              searchEngine as any,
              String(title),
              String(author),
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
      duration: t.Optional(t.Number()),
      v: t.Optional(t.String()),
      engine: t.Optional(
        t.Union([
          t.Literal('dynamic'),
          t.Literal('ytmusic'),
          t.Literal('boidu'),
          t.Literal('lrclib'),
          t.Literal('textyl'),
        ]),
      ),
    }),
  },
);
