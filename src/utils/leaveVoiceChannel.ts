import { VoiceConnection } from "@discordjs/voice";
import isPonaInVoiceChannel from "./isPonaInVoiceChannel";

export default async function leaveVoiceChannelAsPlayer(guildId: string): Promise<boolean> {
    const currentConnectionInGuild = isPonaInVoiceChannel(guildId, false) as VoiceConnection[];
    if ( currentConnectionInGuild.length > 0 ) {
        currentConnectionInGuild[0].destroy();
    }
    return true;
}