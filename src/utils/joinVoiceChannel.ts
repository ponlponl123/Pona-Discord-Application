import { discordClient as self } from '@/index';
import { joinVoiceChannel, DiscordGatewayAdapterCreator, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';

export default function joinChannel(channelId: string, guildId: string, voiceAdapterCreator: DiscordGatewayAdapterCreator): undefined | VoiceConnection {
    const connection: VoiceConnection = joinVoiceChannel({
        channelId: guildId,
        guildId: channelId,
        adapterCreator: voiceAdapterCreator
    });

    if (
        connection.state.status === VoiceConnectionStatus.Destroyed ||
        connection.state.status === VoiceConnectionStatus.Disconnected
    )
        return undefined;
      
    self.voiceConnections.push(connection);

    return connection;
}