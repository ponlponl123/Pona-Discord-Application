import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import leaveVoiceChannelAsPlayer from "@utils/player/leaveVoiceChannelAsPlayer";
import { getGuildLanguage } from "@/utils/i18n";

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave voice channel")
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction) {
    try {
        const member = interaction.member as GuildMember;
        const lang = await getGuildLanguage(member.guild.id);
        const userVoiceChannel = member.voice.channel;

        if( !userVoiceChannel ) {
            const embed = new EmbedBuilder()
                .setDescription(`<:X_:1298270493639446548> · **${lang.data.reasons.invalid_voice_channel}**!`)
                .setFooter({
                    text: lang.data.music.errors.not_in_voice_channel
                })
                .setColor('#F2789F');
            
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        const currentConnectionInGuild = await isPonaInVoiceChannel(userVoiceChannel.guildId);

        if ( currentConnectionInGuild ) {
            if ( currentConnectionInGuild.voiceChannel !== userVoiceChannel.id ) {
                const embed = new EmbedBuilder()
                    .setDescription(`<:X_:1298270493639446548> · **${lang.data.reasons.invalid_voice_channel}**!`)
                    .setFooter({
                        text: lang.data.music.errors.not_same_voice_channel
                    })
                    .setColor('#F2789F');
                
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }

            if ( await leaveVoiceChannelAsPlayer(currentConnectionInGuild.guild) )
            {
                const embed = new EmbedBuilder()
                    .setDescription(`<:Check:1298270444150980619> · **${lang.data.music.play.leaved}**!`)
                    .setColor('#F9C5D5');
                
                return interaction.reply({
                    embeds: [embed]
                });
            }
        }

        const embed = new EmbedBuilder()
            .setDescription(`<:X_:1298270493639446548> · **${lang.data.music.errors.pona_not_in_voice_channel}**!`)
            .setColor('#F2789F');
        
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch {
        return;
    }
}