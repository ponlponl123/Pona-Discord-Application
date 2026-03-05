import {
  GuildMember,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PollAnswer,
  PartialPollAnswer,
  PollLayoutType,
  Events,
  InteractionContextType,
  Collection,
  User,
  MessageFlags,
} from 'discord.js';
import { discordClient as self } from '@/index';
import warningEmbedBuilder from '@utils/embeds/warning';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import isVoiceActionRequirement from '@utils/player/isVoiceActionRequirement';
import { Track } from '@interfaces/player';
import color from '@/config/embedColor';
import { getGuildLanguage } from '@/utils/i18n';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip current track')
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

    if (playback && playback.queue.current) {
      const currentTrack = playback.queue.current as Track;
      const skip = async (voted: boolean) => {
        playback.seek(currentTrack.duration as number);
        const skipEmbed = new EmbedBuilder()
          .setTitle(
            `<:Rightarrow:1299943204287938600> · ${lang.data.music.play.skipped}!`,
          )
          .setColor(color('light'))
          .setFooter({
            text: `${currentTrack.title} ${lang.data.music.play.author} ${currentTrack.author}`,
            iconURL: currentTrack.displayThumbnail(),
          });
        if (voted) {
          if (!interaction.channel) return;
          const fetchTextChannel = await interaction.channel.fetch();
          if (fetchTextChannel.isSendable())
            return await fetchTextChannel.send({
              embeds: [
                skipEmbed.setAuthor({
                  name: `${lang.data.components.poll.called_by} ${interaction.user.username}`,
                  iconURL: interaction.user.displayAvatarURL(),
                }),
              ],
            });
          return;
        }
        return interaction.reply({
          embeds: [skipEmbed],
        });
      };
      const voiceChannelMembersSize_NotABot =
        member.voice.channel?.members.filter((member) => !member.user.bot);
      if (
        voiceChannelMembersSize_NotABot &&
        (voiceChannelMembersSize_NotABot.size as number) > 4
      ) {
        let minVotes = Math.floor(voiceChannelMembersSize_NotABot.size / 2) + 1;
        const response = await interaction.reply({
          poll: {
            question: {
              text: lang.data.music.queue.skip.poll.replace(
                '[min_votes]',
                String(minVotes),
              ),
            },
            answers: [
              {
                text: lang.data.music.queue.skip.approved,
              },
              {
                text: lang.data.music.queue.skip.denied,
              },
            ],
            duration: 60,
            allowMultiselect: false,
            layoutType: PollLayoutType.Default,
          },
        });
        const fetctResponse = await response.fetch();
        const listeningAdd = (
          answer: PollAnswer | PartialPollAnswer,
          userId: string,
        ) => {
          if (
            !('poll' in answer) ||
            answer.poll.message.id !== fetctResponse.id
          )
            return;
          if (
            !voiceChannelMembersSize_NotABot.filter(
              (member) => member.id === userId,
            ).size
          ) {
            minVotes++;
            return;
          }
          answer.voters.fetch().then((voters: Collection<string, User>) => {
            if (voters.size >= minVotes) {
              answer.poll.end().then(() => {
                answer.poll.answers.forEach(
                  (ans: PollAnswer | PartialPollAnswer) => {
                    if (
                      'text' in ans &&
                      'voteCount' in ans &&
                      ans.text === lang.data.music.queue.skip.approved &&
                      ans.voteCount >= minVotes
                    )
                      skip(true);
                  },
                );
                if (answer.poll.message.deletable) answer.poll.message.delete();
              });
            } else {
              self.client.once(Events.MessagePollVoteAdd, listeningAdd);
            }
          });
        };
        const listeningRm = (
          answer: PollAnswer | PartialPollAnswer,
          userId: string,
        ) => {
          if (
            !('poll' in answer) ||
            answer.poll.message.id !== fetctResponse.id
          )
            return;
          if (
            !voiceChannelMembersSize_NotABot.filter(
              (member) => member.id === userId,
            ).size
          ) {
            minVotes--;
            self.client.once(Events.MessagePollVoteAdd, listeningRm);
            return;
          }
        };
        self.client.once(Events.MessagePollVoteAdd, listeningAdd);
        self.client.once(Events.MessagePollVoteAdd, listeningRm);
        return;
      } else return skip(false);
    }

    return interaction.reply({
      embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
      flags: MessageFlags.Ephemeral,
    });
  } catch {
    return;
  }
}
