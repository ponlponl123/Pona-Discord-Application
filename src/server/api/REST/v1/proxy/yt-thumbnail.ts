import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';

async function fetchYTthumbnailEndpoint(
  endpoint: string[],
): Promise<false | { buffer: ArrayBuffer; endpoint: string }> {
  let endpoint_ = endpoint[0];
  try {
    const response = await fetch(endpoint_);
    if (!response.ok) {
      if (endpoint.length > 0) {
        const fetchAnotherEndpoint = await fetchYTthumbnailEndpoint(
          endpoint.slice(1),
        );
        return fetchAnotherEndpoint;
      }
      return false;
    }

    return {
      buffer: await response.arrayBuffer(),
      endpoint: endpoint_,
    };
  } catch (err) {
    return false;
  }
}

export default new Elysia()
  .get('ytimg/:vid', async ({ params, query, set }) => {
    try {
      const { vid } = params;
      const { endpoint } = query;

      if (!vid) {
        set.status = 400;
        return { error: 'Missing videoId parameter' };
      }

      const LowRes_youtubeThumbnailUrl = [
        `https://img.youtube.com/vi/${vid}/default.jpg`,
        `https://img.youtube.com/vi/${vid}/sddefault.jpg`,
        `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
      ];

      const fetch: any = await fetchYTthumbnailEndpoint(
        LowRes_youtubeThumbnailUrl,
      );

      if (!fetch) {
        set.status = 404;
        return { error: 'Failed to fetch youtube thumbnail.' };
      }

      if (endpoint) {
        set.status = 200;
        return { endpoint: fetch.endpoint };
      }

      const imageBuffer = fetch.buffer;
      set.status = 200;
      set.headers = {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      };
      return Buffer.from(imageBuffer);
    } catch {
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  })
  .get('ytimg/:vid/:options', async ({ params, query, set }) => {
    try {
      const { vid, options } = params;
      const { endpoint } = query;

      if (!vid) {
        set.status = 400;
        return { error: 'Missing videoId parameter' };
      }

      const HighRes_youtubeThumbnailUrl = [
        `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
      ];

      const LowRes_youtubeThumbnailUrl = [
        `https://img.youtube.com/vi/${vid}/default.jpg`,
        `https://img.youtube.com/vi/${vid}/sddefault.jpg`,
        `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
      ];

      const fetch: any = await fetchYTthumbnailEndpoint(
        options === 'highres'
          ? HighRes_youtubeThumbnailUrl
          : LowRes_youtubeThumbnailUrl,
      );

      if (!fetch) {
        set.status = 404;
        return { error: 'Failed to fetch youtube thumbnail.' };
      }

      if (endpoint) {
        set.status = 200;
        return { endpoint: fetch.endpoint };
      }

      const imageBuffer = fetch.buffer;
      set.status = 200;
      set.headers = {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      };
      return Buffer.from(imageBuffer);
    } catch {
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  });
