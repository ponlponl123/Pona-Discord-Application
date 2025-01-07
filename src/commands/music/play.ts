import {
    GuildMember,
    EmbedBuilder,
    CommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Interaction
} from "discord.js";
import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from "@utils/isPonaInVoiceChannel";
import joinVoiceChannel from "@utils/player/joinVoiceChannelAsPlayer";
import { prefix as consolePrefix } from "@config/console";
import errorEmbedBuilder from "@utils/embeds/error";
import addToQueue from "@utils/player/addToQueue";
import { lavaPlayer, Track } from "@interfaces/player";
import getSongs from "@utils/player/getSongs";

import { getGuildLanguage } from "@utils/i18n";
import { SearchPlatform, SearchPlatforms } from "@/interfaces/manager";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Add music to queue")
    .addStringOption(option => option
        .setRequired(true)
        .setName('input')
        .setDescription('Search for video title')
    )
    .addStringOption(option => option
        .setName('search_engine')
        .setDescription('Search Engine')
        .setChoices(
            SearchPlatforms.map((platform) => ({
                name: platform.replace(
                    /\w\S*/g,
                    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
                ),
                value: platform
            }))
        )
        .setRequired(false)
    )
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const lang = getGuildLanguage(member.guild.id);
    const input = interaction.options.get("input")?.value as string;
    const searchEngine = (String(interaction.options.get("search_engine")?.value) || 'youtube') as SearchPlatform;

    if ( !member.voice.channel || !interaction.channel ) {
        return interaction.reply({
            embeds: [errorEmbedBuilder(member.guild.id, lang.data.music.errors.not_in_voice_channel)],
            ephemeral: true
        });
    }

    const isPonaInVoiceConnection = isPonaInVoiceChannel(member.voice.channel.guildId, false) as IsPonaInVoiceChannel[];

    if (
        isPonaInVoiceConnection.length === 0
    )
    {
        const player = await joinVoiceChannel(
            interaction.channel,
            member.voice.channel,
            member.voice.channel.guild
        )

        if ( !player ) {
            return interaction.reply({
              embeds: [errorEmbedBuilder(member.guild.id, lang.data.music.errors.cannot_join_voice_channel)],
              ephemeral: true
            });
        }
    }

    const currentVoiceConnectionInGuild = isPonaInVoiceChannel(member.voice.channel.guildId, 'player') as lavaPlayer[];

    if (
        currentVoiceConnectionInGuild[0].voiceChannel.id !== member.voice.channel.id
    )
    {
        return interaction.reply({
            embeds: [errorEmbedBuilder(member.guild.id, lang.data.music.errors.not_same_voice_channel)],
            ephemeral: true
        });
    }

    if ( !input ) {
        return interaction.reply({
          embeds: [errorEmbedBuilder(member.guild.id, lang.data.components.errors.not_valid)],
          ephemeral: true
        });
    }

    const result = await getSongs(input, searchEngine, member);

    if ( typeof result === 'string' && result.startsWith('Pona!Share') ) {
        const reason = result.replace('Pona!Share ','');
        if ( reason === 'not_found' )
            return interaction.reply({
                embeds: [errorEmbedBuilder(member.guild.id, lang.data.errors.pona_share_not_found)],
                ephemeral: true
            });
        else if ( reason === 'unauthorized' )
            return interaction.reply({
                embeds: [errorEmbedBuilder(member.guild.id, lang.data.errors.pona_share_unauthorized)],
                ephemeral: true
            });
        else if ( reason === 'no_tracks' )
            return interaction.reply({
                embeds: [errorEmbedBuilder(member.guild.id, lang.data.errors.pona_share_no_tracks)],
                ephemeral: true
            });
        else
            return interaction.reply({
                embeds: [errorEmbedBuilder(member.guild.id, lang.data.errors.pona_share_service_unavailable)],
                ephemeral: true
            });
    }
    
    if (
        typeof result !== 'string' &&
        result.tracks.length > 0
    ) {
        let embed: EmbedBuilder;
        if ( result.type === 'track' ) {
            embed = new EmbedBuilder()
                .setTitle(result.tracks[0].title)
                .setThumbnail(result.tracks[0].thumbnail)
                .setFooter({
                    iconURL: result.tracks[0].pluginInfo.artistArtworkUrl,
                    text: `${lang.data.music.play.requester} ${result.tracks[0].author}`
                })
                .setColor('#F9C5D5');
        } else if ( result.type === 'playlist' ) {
            const fields = result.tracks.slice(0, 24);
            embed = new EmbedBuilder()
                .setTitle(lang.data.music.queue.add_playlist)
                .setThumbnail(result.tracks[0].thumbnail)
                .setFields(
                    fields.map((track: Track, index: number) => (
                        (result.tracks.length > 24 && index === 23) ? {
                            name: `${lang.data.music.queue.too_long.title}`,
                            value: `${lang.data.music.queue.too_long.value}`
                        } : {
                            name: `${index + 1}. ${track.title}`,
                            value: `${lang.data.music.play.author} ${track.author}\n‎`
                        }
                    ))
                )
                .setColor('#F9C5D5');
        } else {
            return interaction.reply({
                embeds: [errorEmbedBuilder(member.guild.id, lang.data.music.errors.not_found)],
                ephemeral: true
            });
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(lang.data.music.play.confirmation.abort)
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('abort'),
                new ButtonBuilder()
                    .setLabel(lang.data.music.play.confirmation.confirm)
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('addtoqueue')
            );
        
        const response = await interaction.reply({
            content: `<:Question:1298270472428978217> · ${lang.data.music.play.confirmation.title}`,
            embeds: [embed],
            components: [row],
            ephemeral: true
        });

        const collectorFilter = (i: Interaction) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'addtoqueue') {
                await response.delete();
                let embed: EmbedBuilder;
                if ( result.type === 'track' ) {
                    embed = new EmbedBuilder()
                        .setTitle(result.tracks[0].title)
                        .setURL(result.tracks[0].identifier.startsWith('https://') ? result.tracks[0].identifier : `https://youtu.be/${result.tracks[0].identifier}`)
                        .setThumbnail(result.tracks[0].thumbnail)
                        .setAuthor({
                            iconURL: member.user.avatarURL() || undefined,
                            name: `${lang.data.music.queue.added_by} ${member.user.username}`
                        })
                        .setFooter({
                            iconURL: result.tracks[0].pluginInfo.artistArtworkUrl,
                            text: `${lang.data.music.play.author} ${result.tracks[0].author}`
                        })
                        .setColor('#F9C5D5');
                    await addToQueue(result.tracks[0], currentVoiceConnectionInGuild[0]);
                } else if ( result.type === 'playlist' ) {
                    const fields = result.tracks.slice(0, 24);
                    embed = new EmbedBuilder()
                        .setTitle(lang.data.music.queue.added_playlist)
                        .setThumbnail(result.tracks[0].thumbnail)
                        .setAuthor({
                            iconURL: member.user.avatarURL() || undefined,
                            name: `${lang.data.music.queue.added_by} ${member.user.username}`
                        })
                        .setFields(
                            result.tracks.map((track: Track, index: number) => {
                                return (result.tracks.length > 24 && index === 23) ? {
                                    name: `${lang.data.music.queue.too_long.title}`,
                                    value: `${lang.data.music.queue.too_long.value}`
                                } : {
                                    name: `${index + 1}. ${track.title}`,
                                    value: `${lang.data.music.play.author} ${track.author}\n‎`
                                }
                            })
                        )
                        .setColor('#F9C5D5');
                    await addToQueue(result.tracks, currentVoiceConnectionInGuild[0]);
                } else {
                    return confirmation.reply({
                        embeds: [errorEmbedBuilder(member.guild.id, lang.data.music.errors.not_found)],
                        ephemeral: true
                    });
                }
                await confirmation.reply({ content: `<:Check:1298270444150980619> · **${lang.data.music.queue.added}**`, embeds: [embed] });
            } else if (confirmation.customId === 'abort') {
                await response.delete();
            }
        } catch (e) {
            await response.edit({ content: lang.data.components.errors.timeout, embeds: [], components: [] });
            // console.log( consolePrefix.discord + 'Error when listening add queue confirmation:', e );
        }

        return response;
    }

    const embed = new EmbedBuilder()
      .setDescription(`<:Check:1298270444150980619> · **${lang.data.music.errors.not_found}** :(`)
      .setColor('#F9C5D5');
    
    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
}