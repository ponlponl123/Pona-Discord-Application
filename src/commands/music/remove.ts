import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PollAnswer,
    PollLayoutType,
    Events,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuInteraction,
    CacheType,
} from "discord.js";
import { discordClient as self } from "@/index";
import warningEmbedBuilder from "@utils/embeds/warning";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@utils/player/isVoiceActionRequirement";
import { lavaPlayer, Track } from "@interfaces/player";
import color from "@/config/embedColor";
import { getGuildLanguage } from "@/utils/i18n";

export const data = new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove selected track')
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction) {
    try {
        const member = interaction.member as GuildMember;
        const lang = getGuildLanguage(member.guild.id);
        const voiceActionRequirement = isVoiceActionRequirement(member);

        if ( !voiceActionRequirement.isPonaInVoiceChannel ) {
            return interaction.reply({
                embeds: [warningEmbedBuilder(lang.data.music.errors.pona_not_in_voice_channel)],
                ephemeral: true
            });
        }

        if ( !voiceActionRequirement.isUserInVoiceChannel || !voiceActionRequirement.isUserInSameVoiceChannel ) {
            return interaction.reply({
                embeds: [warningEmbedBuilder(lang.data.music.errors.not_same_voice_channel)],
                ephemeral: true
            });
        }

        const playback = isPonaInVoiceChannel( member.guild.id, 'player' ) as lavaPlayer[];

        if ( playback.length > 0 && playback[0].player.queue.current ) {
            if ( playback[0].player.queue.length <= 0 ) {
                return interaction.reply({
                    embeds: [warningEmbedBuilder(lang.data.music.queue.remove.requirement)],
                    ephemeral: true
                });
            }
            const currentTrack = playback[0].player.queue.current as Track;

            const actionRows: ActionRowBuilder<StringSelectMenuBuilder>[] = [];
            const total_pages = Math.ceil(playback[0].player.queue.length / 24);

            for (let i = 0; i < total_pages; i++) {
                const selector = new StringSelectMenuBuilder()
                    .setCustomId(`remove_track_${i}`)
                    .setPlaceholder(`${lang.data.music.queue.remove.selector_placeholder}${total_pages > 1 && `(${lang.data.music.queue.remove.page_num} #${i+1})`}`)
                    .addOptions(
                        playback[0].player.queue.slice(i * 24, (i + 1) * 24).filter(track => track.uniqueId !== currentTrack.uniqueId).map((track, index) => {
                            return new StringSelectMenuOptionBuilder()
                                .setValue(String(index + i * 24))
                                .setLabel(`${(index + i * 24) + 1}. ${track.title}`.slice(0, 100));
                        })
                    );

                const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selector);
                actionRows.push(actionRow);
            }

            if ( !interaction.isRepliable() ) return;
            const response = await interaction.reply({
                content: lang.data.music.queue.remove.selector,
                components: actionRows,
                ephemeral: true
            });
            const collector = response.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 60_000 });
            const voiceChannelMembersSize_NotABot = member.voice.channel?.members.filter(member=>!member.user.bot);

            collector.on('collect', async (collected: StringSelectMenuInteraction<CacheType>) => {
                const selectedId = collected.values[0];
                const selected = playback[0].player.queue.filter((track) => String(track.uniqueId) === selectedId);
                if ( collected.user.id !== member.id ) return;
                if ( selected.length > 0 ) {
                    interaction.deleteReply();
                    if ( voiceChannelMembersSize_NotABot && voiceChannelMembersSize_NotABot.size as number > 4 ) {
                        let minVotes = Math.floor(voiceChannelMembersSize_NotABot.size / 2) + 1;
                        const response = await interaction.followUp({
                            poll: {
                                question: {
                                    text: lang.data.music.queue.remove.poll.replace('[track_name]', selected[0].title).replace('[min_votes]', String(minVotes))
                                },
                                answers: [
                                    {
                                        text: lang.data.music.queue.remove.approved
                                    },
                                    {
                                        text: lang.data.music.queue.remove.denied
                                    }
                                ],
                                duration: 60,
                                allowMultiselect: false,
                                layoutType: PollLayoutType.Default
                            }
                        });
                        const listeningAdd = async (answer: PollAnswer, userId: string) => {
                            if ( answer.poll.message.id !== response.id ) return;
                            if (
                                !voiceChannelMembersSize_NotABot.filter(member => member.id === userId).size
                            ) {
                                minVotes++;
                                self.client.once(Events.MessagePollVoteAdd, listeningAdd);
                                return;
                            };
                            const voters = await answer.fetchVoters();
            
                            if ( voters.size >= minVotes) {
                                await answer.poll.end();
                                answer.poll.answers.map(async answer => {
                                    if ( answer.text === lang.data.music.queue.remove.approved && answer.voteCount >= minVotes )
                                        await remove((selected[0] as Track), true);
                                })
                                answer.poll.message.deletable && await answer.poll.message.delete();
                            } else self.client.once(Events.MessagePollVoteAdd, listeningAdd);
                        }
                        const listeningRm = async (answer: PollAnswer, userId: string) => {
                            if ( answer.poll.message.id !== response.id ) return;
                            if (
                                !voiceChannelMembersSize_NotABot.filter(member => member.id === userId).size
                            ) {
                                minVotes--;
                                self.client.once(Events.MessagePollVoteAdd, listeningRm);
                                return;
                            };
                        }
                        self.client.once(Events.MessagePollVoteAdd, listeningAdd);
                        self.client.once(Events.MessagePollVoteRemove, listeningRm);
                        return;
                    } else {
                        return await remove((selected[0] as Track), false)
                    }
                } else {
                    await interaction.editReply({ content: lang.data.components.string_selector.error.invalid });
                }
                collector.stop();
            });
            const remove = async (track: Track, voted: boolean) => {
                const index = playback[0].player.queue.findIndex(findtrack => findtrack.uniqueId === track.uniqueId);
                console.log('index', index);
                playback[0].player.queue.remove(index);
                const removedEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: lang.data.music.queue.removed_track,
                        iconURL: 'https://cdn.discordapp.com/emojis/1299947520952238130.webp?size=32&quality=lossless'
                    })
                    .setColor(color('focus'))
                    .setTitle(track.title)
                    .setURL(track.uri || null)
                    .setDescription(`${lang.data.music.play.author} ${track.author}`)
                    .setThumbnail(track.displayThumbnail());
                if ( !interaction.channel ) return;
                const fetchTextChannel = await interaction.channel.fetch();
                if ( fetchTextChannel.isSendable() ) {
                    if ( voted ) {
                        return await fetchTextChannel.send({
                            embeds: [removedEmbed.setFooter({
                                text: `${lang.data.components.poll.called_by} ${member.user.username}`,
                                iconURL: member.user.avatarURL() || undefined
                            })]
                        })
                    }
                    return fetchTextChannel.send({
                        embeds: [removedEmbed.setFooter({
                            text: `${lang.data.music.queue.remove_by} ${member.user.username}`,
                            iconURL: member.user.avatarURL() || undefined
                        })]
                    })
                }
            }
            return;
        }

        return interaction.reply({
            embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
            ephemeral: true
        });
    } catch {
        return;
    }
}