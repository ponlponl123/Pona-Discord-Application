import express from 'express';
import { HttpStatusCode } from 'axios';
import { redisClient } from '@/index';

export async function GET(_request: express.Request, response: express.Response) {
    if ( !redisClient?.redis || (await redisClient?.redis.ping() !== 'PONG') )
        return response.status(HttpStatusCode.ServiceUnavailable).json({
            message: 'Service Unavailable',
        });

    return response.status(HttpStatusCode.Ok).json({
        message: 'OK',
    });
}