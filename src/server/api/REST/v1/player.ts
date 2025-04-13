import express from 'express';
import { HttpStatusCode } from 'axios';
import { discordClient as discord } from '@/index';
import isPonaInVoiceChannel from '@/utils/isPonaInVoiceChannel';

export const path = '/:guildid?';

export async function GET_PRIVATE(request: express.Request, response: express.Response) {
    try {
        const { guildid } = request.params;
        if (!guildid)
        {
            return response.status(HttpStatusCode.BadRequest).json({ error: 'Missing guildId' });
        }
        const guild = discord.client.guilds.cache.get(guildid);
        if ( !guild ) {
            return response.status(HttpStatusCode.NotFound).json({ error: 'Guild not found' });
        }
        const player = await isPonaInVoiceChannel(guildid);
        if ( player ) {
            const duration: number = player.queue.current?.duration || 0;
            const textChannel = guild.channels.cache.get(player.textChannel as string);
            const voiceChannel = guild.channels.cache.get(player.voiceChannel as string);
            return response.status(HttpStatusCode.Ok).json({
                message: 'OK',
                state: player.state,
                volume: player.volume,
                paused: player.paused,
                playing: player.playing,
                isAutoplay: player.isAutoplay,
                equalizer: player.filters.equalizer,
                track: {
                    position: player.position,
                    length: duration,
                    percentage: duration && ((player.position * 100) / duration),
                },
                repeat: {
                    track: player.trackRepeat,
                    queue: player.queueRepeat,
                },
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                current: player.queue.current,
            });
        }
        return response.status(HttpStatusCode.NoContent).json({ error: 'No player active' });
    } catch {
        return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
    }
}