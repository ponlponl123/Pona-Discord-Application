import { Player } from "lavacord";
import { Guild, VoiceBasedChannel } from "discord.js";

export interface lavaPlayer {
    player: Player;
    channel: VoiceBasedChannel;
    guild: Guild;
}