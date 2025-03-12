import { lavalink, discordClient as self } from "..";
import { config } from "@/config/discord";
import { prefix as consolePrefix } from "@/config/console";
import * as discord from "discord.js";
import { VoiceBasedChannel, Routes } from "discord.js";

export default async function setVoiceChannelStatus(voiceChannelRef: VoiceBasedChannel | string, text: string = ''): Promise<unknown> {
    let voiceChannel: VoiceBasedChannel;

    if ( typeof voiceChannelRef === 'string' )
        if ( voiceChannelRef.startsWith('guild-') )
        {
            const getExistPlayer = lavalink.manager.players.filter( rootPlayer => rootPlayer.guild === voiceChannelRef );
            if ( getExistPlayer.size > 0 )
            {
                voiceChannel = await self.client.channels.fetch(getExistPlayer.at(0)?.voiceChannel as string) as VoiceBasedChannel;
            }
            else
            {
                console.error( consolePrefix.discord + `\x1b[31mCannot find player for voice channel status. ${ voiceChannelRef }\x1b[0m`);
                return false;
            }
        }
        else voiceChannel = await self.client.channels.fetch(voiceChannelRef) as VoiceBasedChannel;
    else voiceChannel = voiceChannelRef as VoiceBasedChannel;

    if ( !voiceChannel.isVoiceBased() ) {
        console.error( consolePrefix.discord + `\x1b[31mCannot set voice channel status, voice channel is not voice-based or manageable. ${ voiceChannel })\x1b[0m`);
        return false
    }

    const rest = new discord.REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
    try {
        const req = await rest.put((Routes.channel(voiceChannel.id) + '/voice-status' as discord.RouteLike), {
            body: {"status": text}
        })
        if ( req )
            console.error( consolePrefix.discord + `\x1b[32mEdit voice status for ${ voiceChannel.id }(${ voiceChannel.guildId }) successfully!\x1b[0m` );
    
        return req;
    } catch (err) {
        console.error( consolePrefix.discord + `\x1b[31mError on setting voice status. ${ voiceChannel.id }(${ voiceChannel.guildId })\x1b[0m`);
        return false;
    }
}