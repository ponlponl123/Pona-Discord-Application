import express from 'express';
import { HttpStatusCode } from 'axios';

export const path = '/:playlistId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    try {
        const { playlistId } = request.params;
        if (!playlistId)
        {
            return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing playlistId' });
        }
        response.status(HttpStatusCode.ServiceUnavailable).json({
            message: 'ServiceUnavailable',
        });
    } catch {
        return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
    }
}