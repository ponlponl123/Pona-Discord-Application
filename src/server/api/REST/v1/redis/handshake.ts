import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { redisClient } from '@/index';

export default new Elysia().get('/', async ({ set }) => {
  if (!redisClient?.redis || (await redisClient?.redis.ping()) !== 'PONG') {
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
