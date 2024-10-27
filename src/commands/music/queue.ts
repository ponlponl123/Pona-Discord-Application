import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { discordClient as self } from "@/index";
import warningEmbedBuilder from "@utils/embeds/warning";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@utils/player/isVoiceActionRequirement";
import { lavaPlayer } from "@interfaces/player";
import { getGuildLanguage } from "@/utils/i18n";
  
export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display queue information')
    .setDMPermission(false);
  
export default async function execute(interaction: CommandInteraction) {
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

    if ( playback.length > 0 ) {
        const queueEmbed = new EmbedBuilder()
            .setAuthor({
                name: lang.data.music.queue.title,
                url: `https://pona.ponlponl123.com/g/${member.guild.id}/queue`,
                iconURL: 'https://cdn.discordapp.com/emojis/1299943220301529118.webp?size=32&quality=lossless'
            })
            .setColor('#F9C5D5')
            .setTitle(playback[0].player.queue.current && playback[0].player.queue.current.title)
            .setURL(playback[0].player.queue.current?.uri || null)
            .setThumbnail(playback[0].player.queue.current && playback[0].player.queue.current.thumbnail || null)
            .setDescription(`${lang.data.music.play.author} ${playback[0].player.queue.current?.author}\n‎ `)
            .setFooter({
                text: `${lang.data.music.queue.added_by} ${playback[0].player.queue.current?.requester?.username}` || '',
                iconURL: playback[0].player.queue.current?.requester && (await self.client.users.fetch(playback[0].player.queue.current.requester.id)).avatarURL() || undefined
            })
            .setFields(
                playback[0].player.queue.map((track, index) => ({
                    name: `${index+1}. ${track.title}`,
                    value: `${lang.data.music.queue.added_by} <@${track.requester?.id}>\n‎ `,
                    inline: false
                }))
            )
        return await interaction.reply({
            content: '',
            embeds: [queueEmbed],
            ephemeral: true
        })
    }

    return interaction.reply({
        embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
        ephemeral: true
    });
}