import isPonaInVoiceChannel from "../isPonaInVoiceChannel";
import { lavaPlayer } from "@/interfaces/lavaPlayer";

export default async function leaveVoiceChannelAsPlayer(guildId: string): Promise<boolean> {
    const currentPlayerInGuild = isPonaInVoiceChannel(guildId, false) as lavaPlayer[];
    if ( currentPlayerInGuild.length > 0 ) {
        await currentPlayerInGuild[0].player.manager.leave(guildId);
    }
    return true;
}