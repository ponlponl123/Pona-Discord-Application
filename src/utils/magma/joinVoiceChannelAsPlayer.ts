import { discordClient as self, lavalink } from '@/index';
import { prefix as consolePrefix } from '@/config/console';
import { TextBasedChannel, Guild, VoiceBasedChannel } from 'discord.js';
import { Player } from 'magmastream';

export default async function joinChannel(channel: TextBasedChannel, voiceChannel: VoiceBasedChannel, guild: Guild): Promise<Player | undefined> {
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

        player.bands = [
            0.22, 0.32, 0.78, 0.66, 0.44, 0.22,
            0, -0.1, -0.18, -0.16, 0.22, 0.15,
            0.22, 0.56, 0.37
        ]

        return player;
    }
    
    return undefined;
}