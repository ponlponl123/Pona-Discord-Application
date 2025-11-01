import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';

export default new Elysia().get('/playlist/:playlistid', ({ params, set }) => {
  try {
    const { playlistid } = params;
    if (!playlistid) {
      set.status = HttpStatusCode.BadRequest;
      return { error: 'Missing playlistid' };
    }
    set.status = HttpStatusCode.ServiceUnavailable;
    return {
      message: 'ServiceUnavailable',
    };
  } catch {
    set.status = HttpStatusCode.InternalServerError;
    return { error: 'Internal Server Error' };
  }
});
