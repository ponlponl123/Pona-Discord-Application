import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { apiServer } from '@/index';

export default new Elysia().get('/', ({ set }) => {
  if (!('io' in apiServer)) {
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
