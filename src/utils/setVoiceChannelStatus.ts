import { config } from "@/config/discord";
import discord, { VoiceBasedChannel, Routes } from "discord.js";

export default async function setVoiceChannelStatus(voiceChannel: VoiceBasedChannel, text: string = ''): Promise<unknown> {
    const rest = new discord.REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
    const req = await rest.put((Routes.channel(voiceChannel.id) + '/voice-status' as discord.RouteLike), {
        body: {"status": text}
    })

    return req;
}