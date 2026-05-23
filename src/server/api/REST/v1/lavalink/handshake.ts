import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { container } from '@/core/container';

export default new Elysia().get('/', ({ set }) => {
  if (container.lavalink.lavanodes.length === 0) {
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
