import {
  GuildMember,
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import joinVoiceChannel from '@utils/player/joinVoiceChannelAsPlayer';
import { prefix as consolePrefix } from '@config/console';
import errorEmbedBuilder from '@utils/embeds/error';
import addToQueue from '@utils/player/addToQueue';
import { Track } from '@interfaces/player';
import getSongs from '@utils/player/getSongs';

import { getGuildLanguage } from '@utils/i18n';
import { SearchPlatform, SearchPlatforms } from '@/interfaces/manager';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Add music to queue')
  .addStringOption((option) =>
    option
      .setRequired(true)
      .setName('input')
      .setDescription('Search for video title'),
  )
  .addStringOption((option) =>
    option
      .setName('search_engine')
      .setDescription('Search Engine')
      .setChoices(
        SearchPlatforms.map((platform) => ({
          name: platform.replace(
            /\w\S*/g,
            (text) =>
              text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
          ),
          value: platform,
        })),
      )
      .setRequired(false),
  )
  .setContexts([InteractionContextType.Guild]);

export default async function execute(
  interaction: ChatInputCommandInteraction,
) {
  try {
    const member = interaction.member as GuildMember;
    const lang = await getGuildLanguage(member.guild.id);
    const input = interaction.options.get('input')?.value as string;
    const searchEngine = (String(
      interaction.options.get('search_engine')?.value,
    ) || 'pona! search') as SearchPlatform;

    if (!member.voice.channel || !interaction.channel) {
      return interaction.reply({
        embeds: [
          await errorEmbedBuilder(
            member.guild.id,
            lang.data.music.errors.not_in_voice_channel,
          ),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    let isPonaInVoiceConnection = await isPonaInVoiceChannel(
      member.voice.channel.guildId,
    );

    if (!isPonaInVoiceConnection) {
      const player = await joinVoiceChannel(
        interaction.channel,
        member.voice.channel,
        member.voice.channel.guild,
      );

      if (!player) {
        return interaction.reply({
          embeds: [
            await errorEmbedBuilder(
              member.guild.id,
              lang.data.music.errors.cannot_join_voice_channel,
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      isPonaInVoiceConnection = player;
    }

    if (
      isPonaInVoiceConnection &&
      isPonaInVoiceConnection.voiceChannel !== member.voice.channel.id
    ) {
      return interaction.reply({
        embeds: [
          await errorEmbedBuilder(
            member.guild.id,
            lang.data.music.errors.not_same_voice_channel,
          ),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!input) {
      return interaction.reply({
        embeds: [
          await errorEmbedBuilder(
            member.guild.id,
            lang.data.components.errors.not_valid,
          ),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    const letsthink = await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
    const result = await getSongs(input, searchEngine, member);

    if (typeof result === 'string' && result.startsWith('Pona!Share')) {
      const reason = result.replace('Pona!Share ', '');
      if (reason === 'not_found')
        return interaction.reply({
          embeds: [
            await errorEmbedBuilder(
              member.guild.id,
              lang.data.errors.pona_share_not_found,
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      else if (reason === 'unauthorized')
        return interaction.reply({
          embeds: [
            await errorEmbedBuilder(
              member.guild.id,
              lang.data.errors.pona_share_unauthorized,
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      else if (reason === 'no_tracks')
        return interaction.reply({
          embeds: [
            await errorEmbedBuilder(
              member.guild.id,
              lang.data.errors.pona_share_no_tracks,
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      else
        return interaction.reply({
          embeds: [
            await errorEmbedBuilder(
              member.guild.id,
              lang.data.errors.pona_share_service_unavailable,
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
    }

    if (typeof result !== 'string' && result.tracks.length > 0) {
      let embed: EmbedBuilder;
      if (result.type === 'track') {
        embed = new EmbedBuilder()
          .setTitle(result.tracks[0].title)
          .setThumbnail(result.tracks[0].thumbnail)
          .setFooter({
            iconURL: result.tracks[0].pluginInfo.artistArtworkUrl,
            text: `${lang.data.music.play.requester} ${result.tracks[0].author}`,
          })
          .setColor('#F9C5D5');
      } else if (result.type === 'playlist') {
        const fields = result.tracks.slice(0, 24);
        embed = new EmbedBuilder()
          .setTitle(lang.data.music.queue.add_playlist)
          .setThumbnail(result.tracks[0].thumbnail)
          .setFields(
            fields.map((track: Track, index: number) =>
              result.tracks.length > 24 && index === 23
                ? {
                    name: `${lang.data.music.queue.too_long.title}`,
                    value: `${lang.data.music.queue.too_long.value}`,
                  }
                : {
                    name: `${index + 1}. ${track.title}`,
                    value: `${lang.data.music.play.author} ${track.author}\n‎`,
                  },
            ),
          )
          .setColor('#F9C5D5');
      } else {
        return interaction.editReply({
          embeds: [
            await errorEmbedBuilder(
              member.guild.id,
              lang.data.music.errors.not_found,
            ),
          ],
        });
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(lang.data.music.play.confirmation.abort)
          .setStyle(ButtonStyle.Danger)
          .setCustomId('abort'),
        new ButtonBuilder()
          .setLabel(lang.data.music.play.confirmation.confirm)
          .setStyle(ButtonStyle.Success)
          .setCustomId('addtoqueue'),
      );

      const response =
        interaction && interaction.isRepliable()
          ? await interaction.editReply({
              content: `<:Question:1298270472428978217> · ${lang.data.music.play.confirmation.title}`,
              embeds: [embed],
              components: [row],
            })
          : false;

      if (!response)
        return interaction.followUp({
          content: `${lang.data.components.errors.timeout}`,
          flags: MessageFlags.Ephemeral,
        });

      const collectorFilter = (i: Interaction) =>
        i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({
          filter: collectorFilter,
          time: 60_000,
        });

        if (confirmation.customId === 'addtoqueue') {
          await letsthink.delete();
          let embed: EmbedBuilder;
          if (result.type === 'track') {
            embed = new EmbedBuilder()
              .setTitle(result.tracks[0].title)
              .setURL(
                result.tracks[0].identifier.startsWith('https://')
                  ? result.tracks[0].identifier
                  : `https://youtu.be/${result.tracks[0].identifier}`,
              )
              .setThumbnail(result.tracks[0].thumbnail)
              .setAuthor({
                iconURL: member.user.avatarURL() || undefined,
                name: `${lang.data.music.queue.added_by} ${member.user.username}`,
              })
              .setFooter({
                iconURL: result.tracks[0].pluginInfo.artistArtworkUrl,
                text: `${lang.data.music.play.author} ${result.tracks[0].author}`,
              })
              .setColor('#F9C5D5');
            await addToQueue(result.tracks[0], isPonaInVoiceConnection);
          } else if (result.type === 'playlist') {
            const fields = result.tracks.slice(0, 24);
            embed = new EmbedBuilder()
              .setTitle(lang.data.music.queue.added_playlist)
              .setThumbnail(result.tracks[0].thumbnail)
              .setAuthor({
                iconURL: member.user.avatarURL() || undefined,
                name: `${lang.data.music.queue.added_by} ${member.user.username}`,
              })
              .setFields(
                fields.map((track: Track, index: number) => {
                  if (index === fields.length - 1) {
                    return {
                      name: `${lang.data.music.queue.too_long.title}`,
                      value: `[${lang.data.music.queue.too_long.value}](https://pona.ponlponl123.com/app/g/${member.guild.id}/queue)\n‎ `,
                      inline: false,
                    };
                  }
                  return {
                    name: `${index + 1}. ${track.title}`,
                    value: `${lang.data.music.play.author} ${track.author}\n‎`,
                  };
                }),
              )
              .setColor('#F9C5D5');
            await addToQueue(result.tracks, isPonaInVoiceConnection);
          } else {
            return confirmation.reply({
              embeds: [
                await errorEmbedBuilder(
                  member.guild.id,
                  lang.data.music.errors.not_found,
                ),
              ],
              flags: MessageFlags.Ephemeral,
            });
          }
          await confirmation.reply({
            content: `<:Check:1298270444150980619> · **${lang.data.music.queue.added}**`,
            embeds: [embed],
          });
        } else if (confirmation.customId === 'abort') {
          await letsthink.delete();
        }
      } catch (e) {
        await letsthink
          .edit({
            content: lang.data.components.errors.timeout,
            embeds: [],
            components: [],
          })
          .catch(() => {
            interaction.followUp({
              content: lang.data.components.errors.timeout,
              flags: MessageFlags.Ephemeral,
            });
          });
        console.log(
          consolePrefix.discord +
            'Error when listening add queue confirmation:',
          e,
        );
      }

      return letsthink;
    }

    const embed = new EmbedBuilder()
      .setDescription(
        `<:Check:1298270444150980619> · **${lang.data.music.errors.not_found}** :(`,
      )
      .setColor('#F9C5D5');

    return interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    console.error('play discord command error', err);
    return;
  }
}
