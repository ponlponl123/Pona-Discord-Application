import express from 'express';
import { HttpStatusCode } from 'axios';
import { apiServer } from '@/index';

export function GET(_request: express.Request, response: express.Response) {
    if ( !('io' in apiServer) )
        return response.status(HttpStatusCode.ServiceUnavailable).json({
            message: 'Service Unavailable',
        });

    return response.status(HttpStatusCode.Ok).json({
        message: 'OK',
    });
}