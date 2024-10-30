import { config } from "@/config/discord";
import { prefix as consolePrefix } from "@/config/console";
import discord, { VoiceBasedChannel, Routes } from "discord.js";

export default async function setVoiceChannelStatus(voiceChannel: VoiceBasedChannel, text: string = ''): Promise<unknown> {
    if ( !voiceChannel.isVoiceBased() || !voiceChannel.manageable ) {
        console.error( consolePrefix.discord + `\x1b[31mCannot set voice channel status, voice channel is not voice-based or manageable. ${ voiceChannel.id }(${ voiceChannel.guildId })\x1b[0m`);
        return false
    }
    const rest = new discord.REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
    try {
        const req = await rest.put((Routes.channel(voiceChannel.id) + '/voice-status' as discord.RouteLike), {
            body: {"status": text}
        })
        if ( req )
            console.error( consolePrefix.discord + `\x1b[32mEdit voice status for ${ voiceChannel.id }(${ voiceChannel.guildId }) seccessfully!\x1b[0m` );
    
        return req;
    } catch (err) {
        console.error( consolePrefix.discord + `\x1b[31mError on setting voice status. ${ voiceChannel.id }(${ voiceChannel.guildId })\x1b[0m`);
        return false;
    }
}