import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PollAnswer,
    PollLayoutType,
    Events,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    StringSelectMenuInteraction,
    CacheType,
} from "discord.js";
import { discordClient as self } from "@/index";
import warningEmbedBuilder from "@utils/embeds/warning";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@utils/player/isVoiceActionRequirement";
import { Track } from "@interfaces/player";
import color from "@/config/embedColor";
import { getGuildLanguage } from "@/utils/i18n";

export const data = new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip to selected track')
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction) {
    try {
        const member = interaction.member as GuildMember;
        const lang = getGuildLanguage(member.guild.id);
        const voiceActionRequirement = await isVoiceActionRequirement(member);

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

        const playback = await isPonaInVoiceChannel( member.guild.id );

        if ( playback && playback.queue.current ) {
            if ( playback.queue.length <= 0 ) {
                return interaction.reply({
                    embeds: [warningEmbedBuilder(lang.data.music.queue.skip.requirement)],
                    ephemeral: true
                });
            }
            const currentTrack = playback.queue.current as Track;
            const actionRows: ActionRowBuilder<StringSelectMenuBuilder>[] = [];
            const total_pages = Math.ceil(playback.queue.length / 24);

            for (let i = 0; i < total_pages; i++) {
                const selector = new StringSelectMenuBuilder()
                    .setCustomId(`skipto_track_${i}`)
                    .setPlaceholder(`${lang.data.music.queue.skip.selector_placeholder}${total_pages > 1 && `(${lang.data.music.queue.skip.page_num} #${i+1})`}`)
                    .addOptions(
                        playback.queue.slice(i * 24, (i + 1) * 24).filter(track => track.uniqueId !== currentTrack.uniqueId).map((track, index) => {
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
                content: lang.data.music.queue.skip.selector,
                components: actionRows,
                ephemeral: true
            });
            const voiceChannelMembersSize_NotABot = member.voice.channel?.members.filter(member=>!member.user.bot);
            const collector = response.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 60_000 });

            const skipto = async (index: number, voted: boolean) => {
                playback.skipto(index);
                const skipEmbed = new EmbedBuilder()
                    .setTitle(`<:Rightarrow:1299943204287938600> · ${lang.data.music.play.skipped}!`)
                    .setColor(color('light'))
                    .setFooter({
                        text: `${currentTrack.title} ${lang.data.music.play.author} ${currentTrack.author}`,
                        iconURL: currentTrack.displayThumbnail()
                    });
                if ( !interaction.channel ) return;
                const fetchTextChannel = await interaction.channel.fetch();
                if ( fetchTextChannel.isSendable() ) {
                    if ( voted ) {
                        if ( !interaction.channel ) return;
                        const fetchTextChannel = await interaction.channel.fetch();
                        if ( fetchTextChannel.isSendable() )
                            return await fetchTextChannel.send({
                                embeds: [skipEmbed.setAuthor({
                                    name: `${lang.data.components.poll.called_by} ${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL()
                                })]
                            })
                        return;
                    }
                    return fetchTextChannel.send({
                        embeds: [skipEmbed]
                    })
                }
            }

            collector.on('collect', async (collected: StringSelectMenuInteraction<CacheType>) => {
                const selectedIndex = Number(collected.values[0]);
                const selected = playback.queue.at(selectedIndex);
                if ( collected.user.id !== member.id ) return;
                if ( selected ) {
                    interaction.deleteReply();
                    if ( voiceChannelMembersSize_NotABot && voiceChannelMembersSize_NotABot.size as number > 4 ) {
                        let minVotes = Math.floor(voiceChannelMembersSize_NotABot.size / 2) + 1;
                        const response = await interaction.reply({
                            poll: {
                                question: {
                                    text: lang.data.music.queue.skip.poll_bulk.replace('[index]', String(selectedIndex + 1)).replace('[min_votes]', String(minVotes))
                                },
                                answers: [
                                    {
                                        text: lang.data.music.queue.skip.approved
                                    },
                                    {
                                        text: lang.data.music.queue.skip.denied
                                    }
                                ],
                                duration: 60,
                                allowMultiselect: false,
                                layoutType: PollLayoutType.Default
                            }
                        });
                        const fetctResponse = await response.fetch();
                        const listeningAdd = async (answer: PollAnswer, userId: string) => {
                            if ( answer.poll.message.id !== fetctResponse.id ) return;
                            if (
                                !voiceChannelMembersSize_NotABot.filter(member => member.id === userId).size
                            ) {
                                minVotes++;
                                return;
                            };
                            const voters = await answer.fetchVoters();
            
                            if ( voters.size >= minVotes) {
                                await answer.poll.end();
                                answer.poll.answers.map(answer => {
                                    if ( answer.text === lang.data.music.queue.skip.approved && answer.voteCount >= minVotes ) skipto(selectedIndex, true);
                                })
                                answer.poll.message.deletable && await answer.poll.message.delete();
                            } else self.client.once(Events.MessagePollVoteAdd, listeningAdd);
                        }
                        const listeningRm = async (answer: PollAnswer, userId: string) => {
                            if ( answer.poll.message.id !== fetctResponse.id ) return;
                            if (
                                !voiceChannelMembersSize_NotABot.filter(member => member.id === userId).size
                            ) {
                                minVotes--;
                                self.client.once(Events.MessagePollVoteAdd, listeningRm);
                                return;
                            };
                        }
                        self.client.once(Events.MessagePollVoteAdd, listeningAdd);
                        self.client.once(Events.MessagePollVoteAdd, listeningRm);
                        return;
                    } else {
                        return skipto(selectedIndex, false);
                    }
                } else {
                    await interaction.editReply({ content: lang.data.components.string_selector.error.invalid });
                }
                collector.stop();
            })
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