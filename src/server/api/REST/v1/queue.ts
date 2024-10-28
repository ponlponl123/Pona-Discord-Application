import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as discord, lavalink } from '@/index';

export const path = '/:guildId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    const guildId = request.params.guildId;
    if (!guildId)
    {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing guildId' });
    }
    const guild = discord.client.guilds.cache.get(guildId);
    if ( !guild ) {
        return response.status(HttpStatusCode.NotFound).json({ error: 'Guild not found' });
    }
    const player = discord.playerConnections.filter(connection => connection.guild.id === guildId);
    if ( player.length > 0 ) {
        return response.status(HttpStatusCode.Ok).json({
            message: 'OK',
            current: player[0].player.queue.current,
            queue: player[0].player.queue
        });
    }
    return response.status(HttpStatusCode.NoContent).json({ error: 'No player active' });
}