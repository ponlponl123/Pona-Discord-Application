import { Elysia } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { container } from '@/core/container';

export default new Elysia().get('/', async ({ set }) => {
  if (!container.redis?.redis || (await container.redis?.redis.ping()) !== 'PONG') {
    set.status = HttpStatusCode.ServiceUnavailable;
    return {
      message: 'Service Unavailable',
    };
  }

  set.status = HttpStatusCode.Ok;
  return {
    message: 'OK',
  };
});
