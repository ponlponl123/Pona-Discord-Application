import { Elysia, t } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { container } from '@/core/container';
import { extractAndSaveIncomingUserMetadata } from '@/utils/userSession';

const TTL_HOME_FEED = 3000;
const TTL_EXPLORE = 18000;
const TTL_CHARTS = 9000;

export default new Elysia({ prefix: '/browse' })
  .get(
    '/home',
    async ({ headers, set }) => {
      try {
        if (!container.database?.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        await extractAndSaveIncomingUserMetadata(headers as Record<string, string>, user.id);

        const cacheKey = `yt:browse:home:${user.id}`;
        if (container.redis?.redis) {
          const cached = await container.redis.redis.get(cacheKey);
          if (cached) {
            set.status = HttpStatusCode.Ok;
            return JSON.parse(cached);
          }
        }

        const res = await YTMusicAPI(
          'GET',
          'browse/home?limit=20',
          { headers: headers as Record<string, string>, userId: user.id },
          undefined,
          user.id,
        );

        if (!res || !res.data?.result) {
          set.status = HttpStatusCode.NotFound;
          return { error: 'No home feed content found' };
        }

        const payload = { message: 'Ok', result: res.data.result };
        container.redis?.redis.setex(cacheKey, TTL_HOME_FEED, JSON.stringify(payload)).catch(() => { });

        set.status = HttpStatusCode.Ok;
        return payload;
      } catch {
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({ authorization: t.Optional(t.String()) }, { additionalProperties: true }),
    },
  )
  .get(
    '/explore',
    async ({ headers, set }) => {
      try {
        if (!container.database?.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        await extractAndSaveIncomingUserMetadata(headers as Record<string, string>, user.id);

        const cacheKey = `yt:browse:explore:${user.id}`;
        if (container.redis?.redis) {
          const cached = await container.redis.redis.get(cacheKey);
          if (cached) {
            set.status = HttpStatusCode.Ok;
            return JSON.parse(cached);
          }
        }

        const res = await YTMusicAPI(
          'GET',
          'explore/explore',
          { headers: headers as Record<string, string>, userId: user.id },
          undefined,
          user.id,
        );

        if (!res || !res.data?.result) {
          set.status = HttpStatusCode.NotFound;
          return { error: 'No explore content found' };
        }

        const payload = { message: 'Ok', result: res.data.result };
        container.redis?.redis.setex(cacheKey, TTL_EXPLORE, JSON.stringify(payload)).catch(() => { });

        set.status = HttpStatusCode.Ok;
        return payload;
      } catch {
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      headers: t.Object({ authorization: t.Optional(t.String()) }, { additionalProperties: true }),
    },
  )
  .get(
    '/charts/:country',
    async ({ headers, params, set }) => {
      try {
        if (!container.database?.pool) {
          set.status = HttpStatusCode.ServiceUnavailable;
          return { error: 'Service Unavailable' };
        }
        const { authorization } = headers;
        if (!authorization) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        const tokenType = authorization.split(' ')[0];
        const tokenKey = authorization.split(' ')[1];
        const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
        if (!user) {
          set.status = HttpStatusCode.Unauthorized;
          return { error: 'Unauthorized' };
        }
        await extractAndSaveIncomingUserMetadata(headers as Record<string, string>, user.id);

        const requestedCountry = (params.country || 'US').toUpperCase();
        const country = requestedCountry === 'ZZ' ? 'US' : requestedCountry;
        const cacheKey = `yt:browse:charts:${country}`;
        if (container.redis?.redis) {
          const cached = await container.redis.redis.get(cacheKey);
          if (cached) {
            set.status = HttpStatusCode.Ok;
            return JSON.parse(cached);
          }
        }

        let res = await YTMusicAPI(
          'GET',
          `explore/charts/${country}`,
          { headers: headers as Record<string, string>, userId: user.id },
          undefined,
          user.id,
        );

        if (!res || !res.data?.result) {
          res = await YTMusicAPI(
            'GET',
            'explore/charts/US',
            { headers: headers as Record<string, string>, userId: user.id },
            undefined,
            user.id,
          );
        }

        if (!res || !res.data?.result) {
          set.status = HttpStatusCode.NotFound;
          return { error: `No charts found for country: ${country}` };
        }

        const payload = { message: 'Ok', country, result: res.data.result };
        container.redis?.redis.setex(cacheKey, TTL_CHARTS, JSON.stringify(payload)).catch(() => { });

        set.status = HttpStatusCode.Ok;
        return payload;
      } catch {
        set.status = HttpStatusCode.InternalServerError;
        return { error: 'Internal Server Error' };
      }
    },
    {
      params: t.Object({ country: t.String() }),
      headers: t.Object({ authorization: t.Optional(t.String()) }, { additionalProperties: true }),
    },
  );
