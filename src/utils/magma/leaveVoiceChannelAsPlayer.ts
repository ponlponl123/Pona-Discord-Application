import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from "../isPonaInVoiceChannel";
import { lavaPlayer } from "@/interfaces/lavaPlayer";
import { VoiceConnection } from "@discordjs/voice";
import { discordClient as self } from "@/index";

export default function leaveVoiceChannelAsPlayer(guildId: string): boolean {
    const currentPlayerInGuild = isPonaInVoiceChannel(guildId, false) as IsPonaInVoiceChannel[];
    if ( currentPlayerInGuild.length > 0 ) {
        if ( currentPlayerInGuild[0][1] === 'player' )
        {
            self.playerConnections = self.playerConnections.filter((player) => player.player.guild !== guildId);
            (currentPlayerInGuild[0][0] as lavaPlayer).player.destroy();
        }
        else if ( currentPlayerInGuild[0][1] === 'voice' )
        {
            self.voiceConnections = self.voiceConnections.filter((player) => player.joinConfig.guildId !== guildId);
            (currentPlayerInGuild[0][0] as VoiceConnection).destroy();
        }
    }
    return true;
}