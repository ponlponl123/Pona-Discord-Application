import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import warningEmbedBuilder from "@utils/embeds/warning";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@utils/player/isVoiceActionRequirement";
import { lavaPlayer, Track } from "@interfaces/player";

export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track')
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

    if ( playback.length > 0 && playback[0].player.queue.current ) {
        const currentTrack = playback[0].player.queue.current as Track;
        playback[0].player.stop();
        return interaction.reply({
            content: `${currentTrack.title} was Skipped!`
        })
    }

    return interaction.reply({
        embeds: [warningEmbedBuilder('No playback is currently active.')],
        ephemeral: true
    });
}