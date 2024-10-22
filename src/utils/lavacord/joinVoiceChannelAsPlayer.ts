import { discordClient as self, lavalink } from '@/index';
import { Guild, VoiceBasedChannel } from 'discord.js';
import { Player } from 'lavacord';

export default async function joinChannel(channel: VoiceBasedChannel, guild: Guild): Promise<undefined | Player> {
    const player = await lavalink.manager.join({
        guild: guild.id, // Guild id
        channel: channel.id, // Channel id
        node: "1" // lavalink node id, based on array of nodes
    }, {selfdeaf: true});

    player.once("warn", warn => console.warn(warn));
    player.once("error", error => console.error(error));
    player.once("end", data => {
        if (data.type === "TrackEndEvent" && data.reason === "replaced") return; // Ignore replaced reason to prevent skip loops
        // Play next song
    });

    if (
        !player.state.connected
    )
        return undefined;
      
    self.playerConnections.push({
        player: player,
        channel: channel,
        guild: guild
    });

    return player;
}