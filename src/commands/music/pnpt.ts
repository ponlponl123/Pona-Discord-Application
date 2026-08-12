import {
  GuildMember,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import warningEmbedBuilder from '@utils/embeds/warning';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import isVoiceActionRequirement from '@utils/player/isVoiceActionRequirement';
import { getGuildLanguage } from '@/utils/i18n';
import color from '@/config/embedColor';
import { setGuildPNPTEnabled } from '@/utils/guildSettingsCache';

export const data = new SlashCommandBuilder()
  .setName('pnpt')
  .setDescription('Toggle Auto-continue (PNPT) mode')
  .setNameLocalizations({
    th: 'ต่อเพลงอัตโนมัติ',
  })
  .setDescriptionLocalizations({
    th: 'เปิด/ปิด โหมดต่อเพลงอัตโนมัติ',
  })
  .addBooleanOption((option) =>
    option
      .setName('enabled')
      .setDescription('Enable or disable Auto-continue')
      .setNameLocalizations({
        th: 'เปิดใช้งาน',
      })
      .setDescriptionLocalizations({
        th: 'เปิดหรือปิดการต่อเพลงอัตโนมัติ',
      })
      .setRequired(false),
  )
  .setContexts([InteractionContextType.Guild]);

export default async function execute(
  interaction: ChatInputCommandInteraction,
  overrideEnabled?: boolean,
) {
  try {
    const member = interaction.member as GuildMember;
    const lang = await getGuildLanguage(member.guild.id);
    const voiceActionRequirement = await isVoiceActionRequirement(member);

    if (!voiceActionRequirement.isPonaInVoiceChannel) {
      return interaction.reply({
        embeds: [warningEmbedBuilder(lang.data.music.errors.pona_not_in_voice_channel)],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !voiceActionRequirement.isUserInVoiceChannel ||
      !voiceActionRequirement.isUserInSameVoiceChannel
    ) {
      return interaction.reply({
        embeds: [warningEmbedBuilder(lang.data.music.errors.not_same_voice_channel)],
        flags: MessageFlags.Ephemeral,
      });
    }

    const player = await isPonaInVoiceChannel(member.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
        flags: MessageFlags.Ephemeral,
      });
    }

    const currentOption = interaction.options.getBoolean('enabled');
    const newEnabled = overrideEnabled !== undefined ? overrideEnabled : (currentOption !== null ? currentOption : !player.isPNPTEnabled);

    const pnptLang = (lang.data.music.state as any)?.pnpt || {};

    if (player.queueRepeat && newEnabled) {
      return interaction.reply({
        embeds: [warningEmbedBuilder(pnptLang.repeat_incompatible || 'Auto-continue is incompatible with Queue Repeat mode.')],
        flags: MessageFlags.Ephemeral,
      });
    }

    player.setPNPT(newEnabled);
    await setGuildPNPTEnabled(member.guild.id, newEnabled);

    if (newEnabled && player.queuePNPT.length < 6 && player.queue.current) {
      player.ensurePNPTQueue().catch(() => {});
    }

    const titleText = newEnabled
      ? (pnptLang.enabled || 'Auto-continue enabled')
      : (pnptLang.disabled || 'Auto-continue disabled');

    const embed = new EmbedBuilder()
      .setTitle(`✨ ${pnptLang.title || 'Auto-continue'}: ${titleText}`)
      .setColor(newEnabled ? color('focus') : color('light'));

    return interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error('[PNPTCommand] Error executing command:', err);
    return;
  }
}
