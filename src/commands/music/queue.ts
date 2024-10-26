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
  
export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display queue information')
    .setDMPermission(false);
  
export default async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const voiceActionRequirement = isVoiceActionRequirement(member);
  
    if ( !voiceActionRequirement.isPonaInVoiceChannel ) {
        return interaction.reply({
            embeds: [warningEmbedBuilder('Pona is not in voice channel.')],
            ephemeral: true
        });
    }
  
    if ( !voiceActionRequirement.isUserInVoiceChannel || !voiceActionRequirement.isUserInSameVoiceChannel ) {
        return interaction.reply({
            embeds: [warningEmbedBuilder('Please enter a same voice channel.')],
            ephemeral: true
        });
    }
  
    const playback = isPonaInVoiceChannel( member.guild.id, 'player' ) as lavaPlayer[];

    if ( playback.length > 0 ) {
        const queueEmbed = new EmbedBuilder()
            .setAuthor({
                name: '🎼 Pona! Music Queue',
                url: `https://pona.ponlponl123.com/g/${member.guild.id}/queue`
            })
            .setColor('#F9C5D5')
            .setTitle(playback[0].player.queue.current && playback[0].player.queue.current.title)
            .setURL(playback[0].player.queue.current?.uri || '')
            .setThumbnail(playback[0].player.queue.current && playback[0].player.queue.current.thumbnail || null)
            .setDescription(`โดย ${playback[0].player.queue.current?.author}\n‎ `)
            .setFooter({
                text: `เพิ่มโดย ${playback[0].player.queue.current?.requester?.username}` || '',
                iconURL: playback[0].player.queue.current?.requester && (await self.client.users.fetch(playback[0].player.queue.current.requester.id)).avatarURL() || ''
            })
            .setFields(
                playback[0].player.queue.map((track, index) => ({
                    name: `${index+1}. ${track.title}`,
                    value: `เพิ่มโดย <@${track.requester?.id}>\n‎ `,
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
        embeds: [warningEmbedBuilder('No playback is currently active.')],
        ephemeral: true
    });
}