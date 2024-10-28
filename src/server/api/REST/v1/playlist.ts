import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as discord, lavalink } from '@/index';

export const path = '/:playlistId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    const playlistId = request.params.playlistId;
    if (!playlistId)
    {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing playlistId' });
    }
    response.status(200).json({
        message: 'ServiceUnavailable',
    });
}