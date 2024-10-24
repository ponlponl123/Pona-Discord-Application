import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";
import leaveVoiceChannelAsPlayer from "@/utils/magma/leaveVoiceChannelAsPlayer";
import { lavaPlayer } from "@/interfaces/lavaPlayer";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leave voice channel")
  .setDMPermission(false);

export default async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const userVoiceChannel = member.voice.channel;

    if( !userVoiceChannel ) {
        const embed = new EmbedBuilder()
            .setDescription('<:X_:1298270493639446548> · **Invalid voice channel**!')
            .setFooter({
                text: 'Please enter a voice channel.'
            })
            .setColor('#F2789F');
        
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }

    const currentConnectionInGuild = isPonaInVoiceChannel(userVoiceChannel.guildId, 'player') as lavaPlayer[];

    if ( currentConnectionInGuild.length > 0 ) {
        if ( currentConnectionInGuild[0].voiceChannel.id !== userVoiceChannel.id ) {
            const embed = new EmbedBuilder()
                .setDescription('<:X_:1298270493639446548> · **Invalid voice channel**!')
                .setFooter({
                    text: 'Not a same voice channel'
                })
                .setColor('#F2789F');
            
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if ( await leaveVoiceChannelAsPlayer(currentConnectionInGuild[0].guild.id) )
        {
            const embed = new EmbedBuilder()
              .setDescription('<:Check:1298270444150980619> · **Leaved**!')
              .setColor('#F9C5D5');
            
            return interaction.reply({
              embeds: [embed]
            });
        }
    }

    const embed = new EmbedBuilder()
      .setDescription('<:X_:1298270493639446548> · **Pona is not already in voice channel**!')
      .setColor('#F2789F');
    
    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
}