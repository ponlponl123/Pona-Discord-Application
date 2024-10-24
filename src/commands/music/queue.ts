import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import warningEmbedBuilder from "@/utils/embeds/warning";
import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@/utils/magma/isVoiceActionRequirement";
import { lavaPlayer } from "@/interfaces/lavaPlayer";
  
export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display queue information')
    .setDMPermission(false);
  
export default async function execute(interaction: CommandInteraction) {
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
        const queueEmbed = new EmbedBuilder()
            .setTitle('🎼 Pona! Music Queue')
            .setColor('#F9C5D5')
            .setFields(
                playback[0].player.queue.map((track, index) => ({
                    name: `${index+1}. ${track.title}`,
                    value: `เพิ่มโดย <@${track.requester?.id}>`,
                    inline: false
                }))
            )
            .setFooter(
                playback[0].player.queue.current && {
                    text: `กำลังเล่น: ${playback[0].player.queue.current.title}`,
                    iconURL: playback[0].player.queue.current.thumbnail || ''
                }
            )
        return await interaction.reply({
            content: '',
            embeds: [queueEmbed],
            ephemeral: true
        })
    }

    return interaction.reply({
        embeds: [warningEmbedBuilder('No playback is currently active.')],
        ephemeral: true
    });
}