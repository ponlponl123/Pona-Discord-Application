import { Elysia, t } from 'elysia';
import {
  fetchLyrics,
  getDynamicLyrics,
  type SearchLyricEngine,
  type Lyric,
  type TimestampLyrics,
} from '@/utils/lyrics';

export { fetchLyrics, getDynamicLyrics, type SearchLyricEngine, type Lyric, type TimestampLyrics };

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

          const result = await getDynamicLyrics(
            videoId ? String(videoId) : undefined,
            title ? String(title) : undefined,
            author ? String(author) : undefined,
            duration,
            requesterUserId,
          );

          if (result.error || (result.lyrics && result.lyrics.length === 0)) {
            set.status = 404;
            return { error: 'Lyrics not found' };
          }

          set.status = 200;
          return result;
        }
        case 'ytmusic': {
          if (!videoId) {
            set.status = 400;
            return { error: 'Missing required parameters' };
          }

          try {
            const lyricsTs = await fetchLyrics('ytmusic_ts', String(videoId));
            if (lyricsTs) {
              set.status = 200;
              return lyricsTs;
            }

            const lyrics = await fetchLyrics('pyytmusic', String(videoId), requesterUserId);
            if (lyrics) {
              set.status = 200;
              return lyrics;
            }

            const fallbackAndroid = await fetchLyrics('ytmusic_android', String(videoId));
            if (fallbackAndroid) {
              set.status = 200;
              return fallbackAndroid;
            }

            const fallbackInnertube = await fetchLyrics('ytmusic_innertube', String(videoId));
            if (fallbackInnertube) {
              set.status = 200;
              return fallbackInnertube;
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
          t.Literal('ytmusic_ts'),
          t.Literal('ytmusic_android'),
          t.Literal('ytmusic_innertube'),
          t.Literal('ytmusic_web'),
          t.Literal('pyytmusic'),
          t.Literal('boidu'),
          t.Literal('lrclib'),
          t.Literal('textyl'),
        ]),
      ),
    }),
  },
);
