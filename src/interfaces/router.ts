export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
export type PRIVATE_HTTPMethod = 'GET_PRIVATE' | 'POST_PRIVATE' | 'PUT_PRIVATE' | 'PATCH_PRIVATE' | 'DELETE_PRIVATE' | 'HEAD_PRIVATE' | 'OPTIONS_PRIVATE'

export type httpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options'

export const HTTPMethods = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
]

export default interface PublicRouter {
    GET?: (request: Express.Request, response: Express.Response) => void,
    POST?: (request: Express.Request, response: Express.Response) => void,
    PUT?: (request: Express.Request, response: Express.Response) => void,
    PATCH?: (request: Express.Request, response: Express.Response) => void,
    DELETE?: (request: Express.Request, response: Express.Response) => void,
    HEAD?: (request: Express.Request, response: Express.Response) => void,
    OPTIONS?: (request: Express.Request, response: Express.Response) => void,
}

export interface PrivateRouter {
    GET_PRIVATE?: (request: Express.Request, response: Express.Response) => void,
    POST_PRIVATE?: (request: Express.Request, response: Express.Response) => void,
    PUT_PRIVATE?: (request: Express.Request, response: Express.Response) => void,
    PATCH_PRIVATE?: (request: Express.Request, response: Express.Response) => void,
    DELETE_PRIVATE?: (request: Express.Request, response: Express.Response) => void,
    HEAD_PRIVATE?: (request: Express.Request, response: Express.Response) => void,
    OPTIONS_PRIVATE?: (request: Express.Request, response: Express.Response) => void
}

export interface Router extends PublicRouter, PrivateRouter {
    path: string
}