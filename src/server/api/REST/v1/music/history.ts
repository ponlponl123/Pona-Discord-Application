import { Elysia, t } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { container } from '@/core/container';
import { prisma } from '@/prisma';
import JSONBig from 'json-bigint';

interface TrackHistoryResult {
  id: bigint;
  track: string;
}

export default new Elysia()
  .get(
    '/history',
    async ({ headers, query, set }) => {
      try {
        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const page = Math.max(1, Number(query['p']) || 1);
        const limit = Math.min(50, Math.max(1, Number(query['l']) || 15));
        const searchQuery = (query['q'] || '').trim();
        const offset = (page - 1) * limit;

        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(
          tokenType,
          tokenKey,
        );
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const cacheKey = `user:${user.id}:history:p${page}:l${limit}:q:${encodeURIComponent(searchQuery)}`;
        if (container.redis?.redis) {
          const cached = await container.redis.redis.get(cacheKey);
          if (cached) {
            set.status = HttpStatusCode.Ok;
            return JSONBig.parse(cached);
          }
        }

        let sqlQuery = `
          SELECT id, track
          FROM (
            SELECT id, track,
              JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri')) AS uri,
              ROW_NUMBER() OVER (PARTITION BY JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri')) ORDER BY id DESC) AS row_num
            FROM player_track_history
            WHERE requestby = ?
        `;
        const queryArgs: any[] = [user.id];

        if (searchQuery) {
          sqlQuery += ` AND (
            LOWER(JSON_UNQUOTE(JSON_EXTRACT(track, '$.title'))) LIKE ? OR
            LOWER(JSON_UNQUOTE(JSON_EXTRACT(track, '$.author'))) LIKE ?
          )`;
          const likePattern = `%${searchQuery.toLowerCase()}%`;
          queryArgs.push(likePattern, likePattern);
        }

        sqlQuery += `
          ) AS subquery
          WHERE row_num = 1
          ORDER BY id DESC
          LIMIT ? OFFSET ?
        `;
        queryArgs.push(limit, offset);

        const res = await prisma.$queryRawUnsafe<TrackHistoryResult[]>(sqlQuery, ...queryArgs);

        let countSql = `
          SELECT COUNT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(track, '$.uri'))) AS totalCount
          FROM player_track_history
          WHERE requestby = ?
        `;
        const countArgs: any[] = [user.id];
        if (searchQuery) {
          countSql += ` AND (
            LOWER(JSON_UNQUOTE(JSON_EXTRACT(track, '$.title'))) LIKE ? OR
            LOWER(JSON_UNQUOTE(JSON_EXTRACT(track, '$.author'))) LIKE ?
          )`;
          const likePattern = `%${searchQuery.toLowerCase()}%`;
          countArgs.push(likePattern, likePattern);
        }

        const countRes = await prisma.$queryRawUnsafe<{ totalCount: bigint }[]>(countSql, ...countArgs);
        const total = Number(countRes?.[0]?.totalCount || 0);

        const tracks = JSONBig.parse(JSONBig.stringify(res || []));
        const totalPages = Math.ceil(total / limit) || 1;

        const responsePayload = {
          message: 'OK',
          tracks,
          pagination: {
            total,
            page,
            limit,
            totalPages,
          },
        };

        if (container.redis?.redis) {
          container.redis.redis.setex(cacheKey, 10, JSONBig.stringify(responsePayload));
        }

        set.status = HttpStatusCode.Ok;
        return responsePayload;
      } catch (e) {
        console.error(e);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        p: t.Optional(t.Number()),
        l: t.Optional(t.Number()),
        q: t.Optional(t.String()),
      }),
    },
  )
  .get(
    '/history/stats',
    async ({ headers, set }) => {
      try {
        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        const cacheKey = `user:${user.id}:history:stats`;
        if (container.redis?.redis) {
          const cached = await container.redis.redis.get(cacheKey);
          if (cached) {
            set.status = HttpStatusCode.Ok;
            return JSONBig.parse(cached);
          }
        }

        const statsSql = `
          SELECT 
            COUNT(DISTINCT JSON_EXTRACT(track, '$.uri')) AS totalTracks,
            COALESCE(SUM(JSON_EXTRACT(track, '$.duration')), 0) AS totalDurationMs
          FROM player_track_history
          WHERE requestby = ?
        `;
        const statsRes = await prisma.$queryRawUnsafe<{ totalTracks: bigint; totalDurationMs: bigint }[]>(statsSql, user.id);

        const topArtistSql = `
          SELECT 
            TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(track, '$.author')), ' - Topic', '')) AS artistName,
            COUNT(*) AS count,
            MAX(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(track, '$.artist[0].id')), 'null')) AS artistId,
            MAX(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(track, '$.thumbnail')), 'null')) AS thumbnail
          FROM player_track_history
          WHERE requestby = ? 
            AND time >= NOW() - INTERVAL 30 DAY
            AND JSON_EXTRACT(track, '$.author') IS NOT NULL
          GROUP BY artistName
          ORDER BY count DESC
          LIMIT 10
        `;
        const topArtistRes = await prisma.$queryRawUnsafe<
          { artistName: string; count: bigint; artistId?: string; thumbnail?: string }[]
        >(topArtistSql, user.id);

        // Fetch user subscriptions to match and enrich artist details
        const subRecords = await prisma.subscribe_artist.findMany({
          where: { uid: user.id },
          select: { target: true, cache: true },
        });

        const subMap = new Map<string, { artistId: string; thumbnail?: string }>();
        for (const sub of subRecords) {
          if (!sub.cache) continue;
          try {
            const parsed = JSON.parse(sub.cache);
            const name = (parsed?.name || parsed?.info?.name || parsed?.header?.title || '').toLowerCase().trim();
            const thumbs = parsed?.thumbnails || parsed?.avatar || parsed?.info?.thumbnails || parsed?.v2?.thumbnails;
            const thumbUrl = Array.isArray(thumbs) && thumbs.length > 0 ? thumbs[thumbs.length - 1]?.url : undefined;
            if (name) {
              subMap.set(name, { artistId: sub.target, thumbnail: thumbUrl });
            }
          } catch {
            // ignore JSON parse error
          }
        }

        const totalTracks = Number(statsRes?.[0]?.totalTracks || 0);
        const totalDurationMs = Number(statsRes?.[0]?.totalDurationMs || 0);
        const topArtistsList = (topArtistRes || []).map((row) => {
          const cleanName = row.artistName ? row.artistName.replace(/\s*-\s*Topic$/i, '').trim() : '-';
          const matchedSub = subMap.get(cleanName.toLowerCase());
          return {
            name: cleanName,
            count: Number(row.count),
            artistId: matchedSub?.artistId || row.artistId || undefined,
            thumbnail: matchedSub?.thumbnail || row.thumbnail || undefined,
          };
        });
        const topArtist = topArtistsList[0]?.name || '-';

        const responsePayload = {
          message: 'OK',
          stats: {
            totalTracks,
            totalDurationMs,
            topArtist,
            topArtists: topArtistsList,
          },
        };

        if (container.redis?.redis) {
          container.redis.redis.setex(cacheKey, 600, JSONBig.stringify(responsePayload));
        }

        set.status = HttpStatusCode.Ok;
        return responsePayload;
      } catch (e) {
        console.error(e);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  )
  .get(
    '/history/:query',
    async ({ headers, params, set }) => {
      try {
        const { query: queryParam } = params;
        if (queryParam !== 'search') {
          set.status = HttpStatusCode.MethodNotAllowed;
          return { error: 'Method Not Allowed' };
        }

        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        
        const [tokenType, tokenKey] = authorization.split(' ');
        const user: any = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }

        if (container.redis?.redis) {
          const rawKeyType = await container.redis.redis.type(`user:${user.id}:history:search`);
          const keyType = rawKeyType.toLowerCase();

          if (keyType === 'set') {
            await container.redis.redis.del(`user:${user.id}:history:search`);
          } else if (keyType === 'list') {
            const value = await container.redis.redis.lrange(`user:${user.id}:history:search`, 0, 7);
            if (value && value.length > 0) {
              set.status = HttpStatusCode.Ok;
              return { message: 'Ok', results: value };
            }
          }
        }
        
        const search_history = await prisma.$queryRawUnsafe<{text: string}[]>(
          `SELECT text FROM (
            SELECT text, MAX(id) as max_id
            FROM search_history
            WHERE uid = ?
            GROUP BY text
          ) AS subquery
          ORDER BY max_id DESC
          LIMIT 8;`,
          user.id,
        );

        if (!search_history || search_history.length === 0) {
          set.status = HttpStatusCode.NotFound;
          return { error: 'Not Found' };
        }

        const parsed_to_array = search_history.map(item => item.text);
        
        if (container.redis?.redis) {
          await container.redis.redis
            .multi()
            .del(`user:${user.id}:history:search`)
            .rpush(`user:${user.id}:history:search`, ...parsed_to_array)
            .expire(`user:${user.id}:history:search`, 600)
            .exec();
        }

        set.status = HttpStatusCode.Ok;
        return { message: 'OK', results: parsed_to_array };
      } catch (e) {
        console.error(e);
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  );


