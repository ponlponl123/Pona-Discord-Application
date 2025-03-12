import isPonaInVoiceChannel from "./isPonaInVoiceChannel";

export default async function leaveVoiceChannelAsPlayer(guildId: string): Promise<boolean> {
    const currentConnectionInGuild = await isPonaInVoiceChannel(guildId);
    if ( currentConnectionInGuild ) {
        currentConnectionInGuild.destroy();
    }
    return true;
}