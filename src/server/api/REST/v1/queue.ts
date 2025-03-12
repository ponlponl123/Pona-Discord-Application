import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as discord } from '@/index';
import isPonaInVoiceChannel from '@/utils/isPonaInVoiceChannel';

export const path = '/:guildId?';

export async function GET_PRIVATE(request: express.Request, response: express.Response) {
    try {
        const {guildId} = request.params;
        if (!guildId)
        {
            return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing guildId' });
        }
        const guild = discord.client.guilds.cache.get(guildId);
        if ( !guild ) {
            return response.status(HttpStatusCode.NotFound).json({ error: 'Guild not found' });
        }
        const player = await isPonaInVoiceChannel(guildId);
        if ( player ) {
            return response.status(HttpStatusCode.Ok).json({
                message: 'OK',
                current: player.queue.current,
                queue: player.queue
            });
        }
        return response.status(HttpStatusCode.NoContent).json({ error: 'No player active' });
    } catch {
        return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
    }
}