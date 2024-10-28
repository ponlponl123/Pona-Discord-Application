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
    });
    
    player.connect();

    if (
        player.state === "CONNECTED"
    )
    {
        self.playerConnections.push({
            player: player,
            voiceChannel: voiceChannel,
            textChannel: channel,
            guild: guild
        });

        const defaultBand: Band[] = [
            { band: 0, gain: 0.038 },
            { band: 1, gain: 0.042 },
            { band: 2, gain: 0.049 },
            { band: 3, gain: 0.017 },
            { band: 4, gain: 0.012 },
            { band: 5, gain: 0.007 },
            { band: 6, gain: -0.031 },
            { band: 7, gain: -0.061 },
            { band: 8, gain: -0.037 },
            { band: 9, gain: -0.008 },
            { band: 10, gain: 0.006 },
            { band: 11, gain: 0.01 },
            { band: 12, gain: 0.03 },
            { band: 13, gain: 0.019 },
        ]
        player.filters.setEqualizer(defaultBand)
        player.setVolume(96);

        return player;
    }
    
    return undefined;
}