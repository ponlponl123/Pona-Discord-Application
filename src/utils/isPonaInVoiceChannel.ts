import { discordClient as self } from '@/index';
import { VoiceConnection } from '@discordjs/voice';
import { lavaPlayer } from '@/interfaces/player';

export interface IsPonaInVoiceChannel {
    0: VoiceConnection | lavaPlayer
    1: 'player' | 'voice'
}

export default function isPonaInVoiceChannel(guildId: string, type: boolean | 'player' | 'voice' = true): boolean | [] | VoiceConnection[] | lavaPlayer[] | IsPonaInVoiceChannel[] {
    const currentPlayerInGuild = self.playerConnections.filter((player: lavaPlayer) => player.guild.id === guildId);
    const currentVoiceConnectionInGuild = self.voiceConnections.filter((connection: VoiceConnection) => connection.joinConfig.guildId === guildId);
    if ( currentPlayerInGuild.length > 0 )
        return !type ? [[ currentPlayerInGuild[0], 'player' ]] : type === 'player' ? currentPlayerInGuild : true;
    if ( currentVoiceConnectionInGuild.length > 0 )
        return !type ? [[ currentVoiceConnectionInGuild[0], 'voice' ]] : type === 'voice' ? currentVoiceConnectionInGuild : true;
    return !type || type === 'player' || type === 'voice' ? [] : false;
}