import express from "express";

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
export type PRIVATE_HTTPMethod = 'GET_PRIVATE' | 'POST_PRIVATE' | 'PUT_PRIVATE' | 'PATCH_PRIVATE' | 'DELETE_PRIVATE' | 'HEAD_PRIVATE' | 'OPTIONS_PRIVATE'

export type httpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options'

export const HTTPMethods: HTTPMethod[] = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
]

export type RequestParameters =
    ((request: express.Request | express.Request | any) => void | Promise<void> | any) |
    ((response: express.Response | express.Response | any) => void | Promise<void> | any) |
    ((request: express.Request | express.Request | any, response: express.Response | express.Response | any) => void | Promise<void> | any);

export default interface PublicRouter {
    GET?: RequestParameters;
    POST?: RequestParameters;
    PUT?: RequestParameters;
    PATCH?: RequestParameters;
    DELETE?: RequestParameters;
    HEAD?: RequestParameters;
    OPTIONS?: RequestParameters;
}

export interface PrivateRouter {
    GET_PRIVATE?: RequestParameters;
    POST_PRIVATE?: RequestParameters;
    PUT_PRIVATE?: RequestParameters;
    PATCH_PRIVATE?: RequestParameters;
    DELETE_PRIVATE?: RequestParameters;
    HEAD_PRIVATE?: RequestParameters;
    OPTIONS_PRIVATE?: RequestParameters;
}

export interface Router extends PublicRouter, PrivateRouter {
    path?: string;
}