import { GuildMember } from "discord.js";
import isPonaInVoiceChannel from "../isPonaInVoiceChannel";
import voiceActionRequirement from "@interfaces/voiceActionRequirement";

export default async function isVoiceActionRequirement(member: GuildMember): Promise<voiceActionRequirement> {

    const isPonaIsInVoiceChannel = await isPonaInVoiceChannel(member.guild.id);

    if ( !isPonaIsInVoiceChannel )
        return {
            isPonaInVoiceChannel: false,
            isUserInSameVoiceChannel: false,
            isUserInVoiceChannel: false
        }

    const currentPonaVoiceChannelId = isPonaIsInVoiceChannel.voiceChannel;

    if ( !currentPonaVoiceChannelId )
        return {
            isPonaInVoiceChannel: false,
            isUserInSameVoiceChannel: false,
            isUserInVoiceChannel: false
        }

    if ( !member.voice.channel )
        return {
            isPonaInVoiceChannel: true,
            isUserInSameVoiceChannel: false,
            isUserInVoiceChannel: false
        }

    if ( member.voice.channel.id === currentPonaVoiceChannelId )
        return {
            isPonaInVoiceChannel: true,
            isUserInSameVoiceChannel: true,
            isUserInVoiceChannel: true
        }
    else
        return {
            isPonaInVoiceChannel: true,
            isUserInSameVoiceChannel: false,
            isUserInVoiceChannel: true
        }
}