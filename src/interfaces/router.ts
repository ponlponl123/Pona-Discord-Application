import { Context } from 'elysia';

export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';
export type PRIVATE_HTTPMethod =
  | 'GET_PRIVATE'
  | 'POST_PRIVATE'
  | 'PUT_PRIVATE'
  | 'PATCH_PRIVATE'
  | 'DELETE_PRIVATE'
  | 'HEAD_PRIVATE'
  | 'OPTIONS_PRIVATE';

export type httpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options';

export const HTTPMethods: HTTPMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
];

export type ElysiaHandler = (context: Context) => Promise<any> | any;

// Type for common Elysia context properties
export interface ElysiaContext {
  body?: any;
  query: Record<string, any>;
  params: Record<string, any>;
  headers: Record<string, any>;
  set: {
    status?: number | string;
    headers?: Record<string, string | number>;
    redirect?: string;
  };
  cookie: Record<string, { value: unknown }>;
  request: Request;
  path: string;
  store: Record<string, any>;
}

export default interface PublicRouter {
  GET?: ElysiaHandler;
  POST?: ElysiaHandler;
  PUT?: ElysiaHandler;
  PATCH?: ElysiaHandler;
  DELETE?: ElysiaHandler;
  HEAD?: ElysiaHandler;
  OPTIONS?: ElysiaHandler;
}

export interface PrivateRouter {
  GET_PRIVATE?: ElysiaHandler;
  POST_PRIVATE?: ElysiaHandler;
  PUT_PRIVATE?: ElysiaHandler;
  PATCH_PRIVATE?: ElysiaHandler;
  DELETE_PRIVATE?: ElysiaHandler;
  HEAD_PRIVATE?: ElysiaHandler;
  OPTIONS_PRIVATE?: ElysiaHandler;
}

export interface Router extends PublicRouter, PrivateRouter {
  path?: string;
}
