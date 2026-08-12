import {
  GuildMember,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import { container } from '@/core/container';
import warningEmbedBuilder from '@utils/embeds/warning';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import isVoiceActionRequirement from '@utils/player/isVoiceActionRequirement';
import { getGuildLanguage } from '@/utils/i18n';

export const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Display queue information')
  .setContexts([InteractionContextType.Guild]);

export default async function execute(
  interaction: ChatInputCommandInteraction,
) {
  try {
    const member = interaction.member as GuildMember;
    const lang = await getGuildLanguage(member.guild.id);
    const voiceActionRequirement = await isVoiceActionRequirement(member);

    if (!voiceActionRequirement.isPonaInVoiceChannel) {
      return interaction.reply({
        embeds: [
          warningEmbedBuilder(lang.data.music.errors.pona_not_in_voice_channel),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !voiceActionRequirement.isUserInVoiceChannel ||
      !voiceActionRequirement.isUserInSameVoiceChannel
    ) {
      return interaction.reply({
        embeds: [
          warningEmbedBuilder(lang.data.music.errors.not_same_voice_channel),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    const playback = await isPonaInVoiceChannel(member.guild.id);

    if (playback && (playback.queue.current || playback.queue.length > 0 || (playback.isPNPTEnabled && playback.queuePNPT.length > 0))) {
      const current = playback.queue.current;
      const tracksToShow = playback.queue.slice(0, 7);
      const autoBadge = (lang.data.music.queue as any)?.pnpt_auto_badge || 'อัตโนมัติ';

      const fields = tracksToShow.map((track, index) => {
        const isPnpt = Boolean((track as any)._isPNPT);
        const reqId = track.requester?.id || (track as any).user_id || '';
        const displayRequester = isPnpt
          ? autoBadge
          : (reqId ? `<@${reqId}>` : (track.author || autoBadge));
        return {
          name: `${index + 1}. ${track.title}`,
          value: `${lang.data.music.queue.added_by} ${displayRequester}\n‎ `,
          inline: false,
        };
      });

      if (playback.queue.length > 7) {
        fields.push({
          name: `${lang.data.music.queue.too_long.title}`,
          value: `[${lang.data.music.queue.too_long.value}](https://pona.ponlponl123.com/app/g/${member.guild.id}/queue)\n‎ `,
          inline: false,
        });
      }

      if (playback.isPNPTEnabled && playback.queuePNPT && playback.queuePNPT.length > 0) {
        const autoNext = (lang.data.music.queue as any)?.pnpt_auto_next || 'ถัดไป (อัตโนมัติ)';
        const pnptTracksToShow = playback.queuePNPT.slice(0, 3);
        pnptTracksToShow.forEach((track, index) => {
          fields.push({
            name: `✨ ${autoNext} ${index + 1}. ${track.title}`,
            value: `${lang.data.music.queue.added_by} ${autoBadge}\n‎ `,
            inline: false,
          });
        });
      }

      const requesterUser = current?.requester;
      const requesterId = requesterUser?.id || (current as any)?.user_id || '';
      const cachedUser = requesterId
        ? container.pona.client.users.cache.get(requesterId)
        : null;
      const isCurrentPNPT = Boolean((current as any)?._isPNPT);
      const requesterName = isCurrentPNPT
        ? autoBadge
        : (requesterUser?.username ||
          cachedUser?.username ||
          (current as any)?.user_tag ||
          (requesterId ? `<@${requesterId}>` : autoBadge));
      const getAvatarUrl = (userObj: any): string | undefined => {
        if (!userObj) return undefined;
        if (typeof userObj.avatarURL === 'function') return userObj.avatarURL();
        if (typeof userObj.avatarURL === 'string') return userObj.avatarURL;
        if (typeof userObj.displayAvatarURL === 'function') return userObj.displayAvatarURL();
        if (typeof userObj.avatar === 'string' && userObj.id) {
          return `https://cdn.discordapp.com/avatars/${userObj.id}/${userObj.avatar}.png`;
        }
        return undefined;
      };

      const requesterAvatar = isCurrentPNPT
        ? undefined
        : (getAvatarUrl(requesterUser) ||
          getAvatarUrl(cachedUser) ||
          (current as any)?.user_avatar ||
          undefined);

      const queueEmbed = new EmbedBuilder()
        .setAuthor({
          name: lang.data.music.queue.title,
          url: `https://pona.ponlponl123.com/app/g/${member.guild.id}/queue`,
          iconURL:
            'https://cdn.discordapp.com/emojis/1299943220301529118.webp?size=32&quality=lossless',
        })
        .setColor('#F9C5D5')
        .setTitle(current?.title || 'No track playing')
        .setURL(current?.uri || null)
        .setThumbnail(current?.artworkUrl || null)
        .setDescription(
          `${lang.data.music.play.author} ${current?.author || 'Unknown'}\n‎ `,
        )
        .setFooter({
          text: `${lang.data.music.queue.added_by} ${requesterName}`,
          iconURL: requesterAvatar,
        })
        .setFields(fields);

      return await interaction.reply({
        content: '',
        embeds: [queueEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction.reply({
      embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
      flags: MessageFlags.Ephemeral,
    });
  } catch (err) {
    console.error('[QueueCommand] Error executing queue command:', err);
    return;
  }
}
