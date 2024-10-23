import { discordClient as self, lavalink } from '@/index';
import { prefix as consolePrefix } from '@/config/console';
import { TextBasedChannel, Guild, VoiceBasedChannel } from 'discord.js';
import { Player } from 'magmastream';

export default async function joinChannel(channel: TextBasedChannel, voiceChannel: VoiceBasedChannel, guild: Guild): Promise<Player | undefined> {
    const player = lavalink.manager.create({
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
    
        return player;
    }
    
    return undefined;
}