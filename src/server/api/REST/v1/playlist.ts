import express from 'express';
import { HttpStatusCode } from 'axios';

export const path = '/:playlistid?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    try {
        const { playlistid } = request.params;
        if (!playlistid)
        {
            return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing playlistid' });
        }
        response.status(HttpStatusCode.ServiceUnavailable).json({
            message: 'ServiceUnavailable',
        });
    } catch {
        return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
    }
}