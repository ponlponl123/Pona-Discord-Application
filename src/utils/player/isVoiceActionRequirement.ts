import { GuildMember } from "discord.js";
import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from "../isPonaInVoiceChannel";
import voiceActionRequirement from "@interfaces/voiceActionRequirement";
import { lavaPlayer } from "@interfaces/player";
import { VoiceConnection } from "@discordjs/voice";

export default function isVoiceActionRequirement(member: GuildMember): voiceActionRequirement {

    const isPonaIsInVoiceChannel = isPonaInVoiceChannel(
        member.guild.id,
        false
    ) as IsPonaInVoiceChannel[];

    if ( isPonaIsInVoiceChannel.length === 0 )
        return {
            isPonaInVoiceChannel: false,
            isUserInSameVoiceChannel: false,
            isUserInVoiceChannel: false
        }

    const currentPonaVoiceChannelId =
        isPonaIsInVoiceChannel[0][1] === 'player' ?
            (isPonaIsInVoiceChannel[0][0] as lavaPlayer).voiceChannel.id :
        isPonaIsInVoiceChannel[0][1] === 'voice' ?
            (isPonaIsInVoiceChannel[0][0] as VoiceConnection).joinConfig.channelId :
        undefined;

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