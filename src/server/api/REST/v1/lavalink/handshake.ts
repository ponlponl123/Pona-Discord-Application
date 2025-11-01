import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { lavalink } from '@/index';

export default new Elysia().get('/', ({ set }) => {
  if (lavalink.lavanodes.length === 0) {
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
