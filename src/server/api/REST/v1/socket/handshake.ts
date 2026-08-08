import { Elysia } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { container } from '@/core/container';

export default new Elysia().get('/', ({ set }) => {
  if (!('io' in container.apiServer)) {
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
