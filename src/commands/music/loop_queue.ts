import {
  GuildMember,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import warningEmbedBuilder from '@utils/embeds/warning';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import isVoiceActionRequirement from '@utils/player/isVoiceActionRequirement';

export const data = new SlashCommandBuilder()
  .setName('loop_queue')
  .setDescription('Loop playback queue')
  .setContexts([InteractionContextType.Guild]);

export default async function execute(
  interaction: ChatInputCommandInteraction,
  value: boolean = true,
  reply: boolean = true,
) {
  try {
    const member = interaction.member as GuildMember;
    const voiceActionRequirement = await isVoiceActionRequirement(member);

    if (!voiceActionRequirement.isPonaInVoiceChannel) {
      return interaction.reply({
        embeds: [warningEmbedBuilder('Pona is not in voice channel.')],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !voiceActionRequirement.isUserInVoiceChannel ||
      !voiceActionRequirement.isUserInSameVoiceChannel
    ) {
      return interaction.reply({
        embeds: [warningEmbedBuilder('Please enter a same voice channel.')],
        flags: MessageFlags.Ephemeral,
      });
    }

    const playback = await isPonaInVoiceChannel(member.guild.id);

    if (playback) {
      playback.setQueueRepeat(value);
      return reply
        ? interaction.reply({
            content: value ? 'Queue repeated.' : 'Queue stop repeated.',
          })
        : true;
    }

    return interaction.reply({
      embeds: [warningEmbedBuilder('No playback is currently active.')],
      flags: MessageFlags.Ephemeral,
    });
  } catch {
    return;
  }
}
