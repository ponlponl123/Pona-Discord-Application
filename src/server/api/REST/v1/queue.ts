import express from 'express';
import { discordClient as discord, lavalink } from '@/index';

export const path = '/:guildId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    const guildId = request.params.guildId;
    if (!guildId)
    {
        return response.status(400).json({ error: 'Missing guildId' });
    }
    const guild = discord.client.guilds.cache.get(guildId);
    if ( !guild ) {
        return response.status(400).json({ error: 'Guild not found' });
    }
    const player = discord.playerConnections.filter(connection => connection.guild.id === guildId);
    if ( !player ) {
        return response.status(400).json({ error: 'No player active' });
    }
    response.status(200).json({
        message: 'OK',
        current: player[0].player.queue.current,
        queue: player[0].player.queue
    });
}