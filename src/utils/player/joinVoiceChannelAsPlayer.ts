import { discordClient as self, lavalink } from '@/index';
import { TextBasedChannel, Guild, VoiceBasedChannel } from 'discord.js';
import { Band } from '../lavalink/equalizers';
import { Player } from '@/lavalink';

export default async function joinChannel(channel: TextBasedChannel, voiceChannel: VoiceBasedChannel, guild: Guild): Promise<Player | undefined> {
    if ( !voiceChannel.isVoiceBased() || !voiceChannel.joinable ) return undefined;
    
    const player: Player = lavalink.manager.create({
        guild: guild.id,
        voiceChannel: voiceChannel.id,
        textChannel: channel.id,
        volume: 100,
        lastActive: new Date().getTime()
    });
    
    player.connect();

    if (
        player.state === "CONNECTED"
    )
    {
        const defaultBand: Band[] = [
            { band: 0, gain: 0.034 },
            { band: 1, gain: 0.038 },
            { band: 2, gain: 0.045 },
            { band: 3, gain: 0.013 },
            { band: 4, gain: 0.008 },
            { band: 5, gain: 0.003 },
            { band: 6, gain: -0.027 },
            { band: 7, gain: -0.057 },
            { band: 8, gain: -0.033 },
            { band: 9, gain: -0.004 },
            { band: 10, gain: 0.002 },
            { band: 11, gain: 0.006 },
            { band: 12, gain: 0.026 },
            { band: 13, gain: 0.015 },
        ]
        player.filters.setEqualizer(defaultBand)
        player.setVolume(96);

        return player;
    }
    
    return undefined;
}