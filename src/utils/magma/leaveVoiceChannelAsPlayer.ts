import isPonaInVoiceChannel from "../isPonaInVoiceChannel";
import { lavaPlayer } from "@/interfaces/lavaPlayer";

export default function leaveVoiceChannelAsPlayer(guildId: string): boolean {
    // const currentPlayerInGuild = isPonaInVoiceChannel(guildId, false) as lavaPlayer[];
    // if ( currentPlayerInGuild.length > 0 ) {
    //     currentPlayerInGuild[0].player.manager.destroy(guildId);
    // }
    return true;
}