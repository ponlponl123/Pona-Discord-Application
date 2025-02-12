import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as discord } from '@/index';

export const path = '/:guildId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    try {
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
            const duration: number = player[0].player.queue.current?.duration || 0;
            const textChannel = guild.channels.cache.get(player[0].player.textChannel as string);
            const voiceChannel = guild.channels.cache.get(player[0].player.voiceChannel as string);
            return response.status(HttpStatusCode.Ok).json({
                message: 'OK',
                state: player[0].player.state,
                volume: player[0].player.volume,
                paused: player[0].player.paused,
                playing: player[0].player.playing,
                isAutoplay: player[0].player.isAutoplay,
                equalizer: player[0].player.filters.equalizer,
                track: {
                    position: player[0].player.position,
                    length: duration,
                    percentage: duration && ((player[0].player.position * 100) / duration),
                },
                repeat: {
                    track: player[0].player.trackRepeat,
                    queue: player[0].player.queueRepeat,
                },
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                current: player[0].player.queue.current,
            });
        }
        return response.status(HttpStatusCode.NoContent).json({ error: 'No player active' });
    } catch {
        return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
    }
}