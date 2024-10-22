import { discordClient as self } from '@/index';
import { VoiceConnection } from '@discordjs/voice';
import { lavaPlayer } from '@/interfaces/lavaPlayer';

export default function isPonaInVoiceChannel(guildId: string, bool: boolean = true): boolean | [] | VoiceConnection[] | lavaPlayer[] {
    const currentPlayerInGuild = self.playerConnections.filter((player: lavaPlayer) => player.guild.id === guildId);
    const currentVoiceConnectionInGuild = self.voiceConnections.filter((connection: VoiceConnection) => connection.joinConfig.guildId === guildId);
    if ( currentPlayerInGuild.length > 0 ) return bool ? true : currentPlayerInGuild;
    if ( currentVoiceConnectionInGuild.length > 0 ) return bool ? true : currentVoiceConnectionInGuild;
    return bool ? false : [];
}