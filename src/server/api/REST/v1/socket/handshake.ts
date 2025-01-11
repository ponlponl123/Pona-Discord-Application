import express from 'express';
import { HttpStatusCode } from 'axios';
import { apiServer } from '@/index';

export function GET(request: express.Request, response: express.Response) {
    if ( apiServer.io === undefined )
        return response.status(HttpStatusCode.ServiceUnavailable).json({
            message: 'Service Unavailable',
        });

    return response.status(HttpStatusCode.Ok).json({
        message: 'OK',
    });
}