import isPonaInVoiceChannel from "../isPonaInVoiceChannel";
import setVoiceChannelStatus from "../setVoiceChannelStatus";

export default async function leaveVoiceChannelAsPlayer(guildId: string): Promise<boolean> {
    const currentPlayerInGuild = await isPonaInVoiceChannel(guildId);
    if ( currentPlayerInGuild ) {
        currentPlayerInGuild.destroy();
        await setVoiceChannelStatus('guild-'+guildId);
    }
    return true;
}