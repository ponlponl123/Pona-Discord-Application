import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  InteractionContextType,
  ContextMenuCommandInteraction,
  GuildMember,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import isVoiceActionRequirement from '@utils/player/isVoiceActionRequirement';
import warningEmbedBuilder from '@utils/embeds/warning';
import { getGuildLanguage } from '@/utils/i18n';
import color from '@/config/embedColor';
import { Track } from '@interfaces/player';

async function validateVoiceAction(interaction: ContextMenuCommandInteraction) {
  const member = interaction.member as GuildMember;
  if (!member || !member.guild) return null;

  const lang = await getGuildLanguage(member.guild.id);

  if (interaction.targetId !== interaction.client.user?.id) {
    await interaction.reply({
      embeds: [
        warningEmbedBuilder(
          lang.code === 'th-TH'
            ? 'คำสั่งนี้ใช้ได้เมื่อคลิกขวาที่ตัวบอท Pona เท่านั้น'
            : 'This command can only be used by right-clicking Pona!',
        ),
      ],
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }

  const voiceReq = await isVoiceActionRequirement(member);

  if (!voiceReq.isPonaInVoiceChannel) {
    await interaction.reply({
      embeds: [warningEmbedBuilder(lang.data.music.errors.pona_not_in_voice_channel)],
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }

  if (!voiceReq.isUserInVoiceChannel || !voiceReq.isUserInSameVoiceChannel) {
    await interaction.reply({
      embeds: [warningEmbedBuilder(lang.data.music.errors.not_same_voice_channel)],
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }

  const player = await isPonaInVoiceChannel(member.guild.id);
  if (!player) {
    await interaction.reply({
      embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }

  return { member, lang, player };
}

export async function handlePlayPause(interaction: ContextMenuCommandInteraction) {
  try {
    const ctx = await validateVoiceAction(interaction);
    if (!ctx) return;
    const { lang, player } = ctx;

    const newPausedState = !player.paused;
    player.pause(newPausedState);

    const embed = new EmbedBuilder()
      .setTitle(
        `<:Revertarrow:1299947479571107942> · ${
          newPausedState
            ? lang.data.music.state.paused.true
            : lang.data.music.state.paused.false
        }`,
      )
      .setColor(color('focus'));

    return await interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error('Error in Play / Pause context menu command:', err);
  }
}

export async function handlePreviousTrack(interaction: ContextMenuCommandInteraction) {
  try {
    const ctx = await validateVoiceAction(interaction);
    if (!ctx) return;
    const { lang, player } = ctx;

    if (player.position > 5000) {
      await player.seek(0);
    } else if (player.queue.previous) {
      player.queue.unshift(player.queue.previous);
      await player.stop();
    } else {
      await player.seek(0);
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `<:Revertarrow:1299947479571107942> · ${
          lang.code === 'th-TH' ? 'เล่นเพลงก่อนหน้า' : 'Playing previous track!'
        }`,
      )
      .setColor(color('light'));

    return await interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error('Error in Previous Track context menu command:', err);
  }
}

export async function handleNextTrack(interaction: ContextMenuCommandInteraction) {
  try {
    const ctx = await validateVoiceAction(interaction);
    if (!ctx) return;
    const { lang, player } = ctx;

    if (player.queue.current) {
      const currentTrack = player.queue.current as Track;
      await player.stop();

      const embed = new EmbedBuilder()
        .setTitle(
          `<:Rightarrow:1299943204287938600> · ${lang.data.music.play.skipped}!`,
        )
        .setColor(color('light'))
        .setFooter({
          text: `${currentTrack.title} ${lang.data.music.play.author} ${currentTrack.author}`,
          iconURL:
            typeof currentTrack.displayThumbnail === 'function'
              ? currentTrack.displayThumbnail()
              : currentTrack.thumbnail || undefined,
        });

      return await interaction.reply({ embeds: [embed] });
    }

    return await interaction.reply({
      embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
      flags: MessageFlags.Ephemeral,
    });
  } catch (err) {
    console.error('Error in Next Track context menu command:', err);
  }
}

// User Context Menu Commands
export const userPlayPause = {
  data: new ContextMenuCommandBuilder()
    .setName('Play / Pause')
    .setNameLocalizations({ th: 'เล่น / หยุดชั่วคราว' })
    .setType(ApplicationCommandType.User)
    .setContexts([InteractionContextType.Guild]),
  execute: handlePlayPause,
};

export const userPreviousTrack = {
  data: new ContextMenuCommandBuilder()
    .setName('Previous Track')
    .setNameLocalizations({ th: 'เพลงก่อนหน้า' })
    .setType(ApplicationCommandType.User)
    .setContexts([InteractionContextType.Guild]),
  execute: handlePreviousTrack,
};

export const userNextTrack = {
  data: new ContextMenuCommandBuilder()
    .setName('Next Track')
    .setNameLocalizations({ th: 'เพลงถัดไป' })
    .setType(ApplicationCommandType.User)
    .setContexts([InteractionContextType.Guild]),
  execute: handleNextTrack,
};
