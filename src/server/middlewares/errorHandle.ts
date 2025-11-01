import { Elysia } from 'elysia';

export const errorHandlerPlugin = new Elysia().onError(
  ({ code, error, set }) => {
    console.error('Error occurred:', error);

    switch (code) {
      case 'NOT_FOUND':
        set.status = 404;
        return { error: 'Not Found' };
      case 'VALIDATION':
        set.status = 400;
        return { error: 'Validation Error', details: String(error) };
      case 'INTERNAL_SERVER_ERROR':
      default:
        set.status = 500;
        return { error: 'Internal Server Error' };
    }
  },
);
