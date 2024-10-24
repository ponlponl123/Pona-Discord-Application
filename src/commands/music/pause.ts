import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import warningEmbedBuilder from "@/utils/embeds/warning";
import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@/utils/magma/isVoiceActionRequirement";
import { lavaPlayer } from "@/interfaces/lavaPlayer";
  
export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause playback')
    .setDMPermission(false);
  
export default async function execute(interaction: CommandInteraction, value: boolean = true) {
    const member = interaction.member as GuildMember;
    const voiceActionRequirement = isVoiceActionRequirement(member);
  
    if ( !voiceActionRequirement.isPonaInVoiceChannel ) {
        return interaction.reply({
            embeds: [warningEmbedBuilder('Pona is not in voice channel.')],
            ephemeral: true
        });
    }
  
    if ( !voiceActionRequirement.isUserInVoiceChannel || !voiceActionRequirement.isUserInSameVoiceChannel ) {
        return interaction.reply({
            embeds: [warningEmbedBuilder('Please enter a same voice channel.')],
            ephemeral: true
        });
    }
  
    const playback = isPonaInVoiceChannel( member.guild.id, 'player' ) as lavaPlayer[];

    if ( playback.length > 0 ) {
        playback[0].player.pause(value);
        return interaction.reply({
            content: value ? 'Playback paused.' : 'Playback resume.'
        });
    }

    return interaction.reply({
        embeds: [warningEmbedBuilder('No playback is currently active.')],
        ephemeral: true
    });
}