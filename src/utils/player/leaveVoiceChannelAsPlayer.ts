import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from "../isPonaInVoiceChannel";
import { lavaPlayer } from "@interfaces/player";
import { VoiceConnection } from "@discordjs/voice";
import { discordClient as self } from "@/index";
import setVoiceChannelStatus from "../setVoiceChannelStatus";

export default async function leaveVoiceChannelAsPlayer(guildId: string): Promise<boolean> {
    const currentPlayerInGuild = isPonaInVoiceChannel(guildId, false) as IsPonaInVoiceChannel[];
    if ( currentPlayerInGuild.length > 0 ) {
        if ( currentPlayerInGuild[0][1] === 'player' )
        {
            const voiceChannel = (currentPlayerInGuild[0][0] as lavaPlayer).player.voiceChannel;
            self.playerConnections = self.playerConnections.filter((player) => player.player.guild !== guildId);
            (currentPlayerInGuild[0][0] as lavaPlayer).player.destroy();
            await setVoiceChannelStatus((currentPlayerInGuild[0][0] as lavaPlayer).voiceChannel);
            self.saveSessionOnFile();
        }
        else if ( currentPlayerInGuild[0][1] === 'voice' )
        {
            self.voiceConnections = self.voiceConnections.filter((player) => player.joinConfig.guildId !== guildId);
            (currentPlayerInGuild[0][0] as VoiceConnection).destroy();
            self.saveSessionOnFile();
        }
    }
    return true;
}