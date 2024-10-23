import { Player } from "magmastream";
import { Guild, TextBasedChannel, VoiceBasedChannel } from "discord.js";

export interface lavaPlayer {
    player: Player;
    voiceChannel: VoiceBasedChannel;
    textChannel: TextBasedChannel;
    guild: Guild;
}