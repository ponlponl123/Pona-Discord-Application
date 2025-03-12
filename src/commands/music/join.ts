import {
  GuildMember,
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import isUserInVoiceChannel from "@utils/isUserIsInVoiceChannel";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import joinVoiceChannel from "@utils/player/joinVoiceChannelAsPlayer";

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Join the channel you are in')
  .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
  try {
    const member = interaction.member as GuildMember;

    if ( !isUserInVoiceChannel(member) ) {
      const embed = new EmbedBuilder()
        .setDescription('<:X_:1298270493639446548> · **Please connect to voice channel first.**')
        .setColor('#F9C5D5');
      
      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    if ( member.voice.channel && await isPonaInVoiceChannel(member.voice.channel?.guildId) )
    {
      const embed = new EmbedBuilder()
        .setDescription('<:X_:1298270493639446548> · **Pona is already in voice channel**!')
        .setColor('#F2789F');
      
      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    if ( interaction.channel && interaction.guild?.id && member.voice.channel ) {
      const player = await joinVoiceChannel(
        interaction.channel,
        member.voice.channel,
        member.voice.channel.guild
      )

      if ( player ) {
        const embed = new EmbedBuilder()
          .setDescription('<:Check:1298270444150980619> · **Joined**!')
          .setColor('#F9C5D5');
        
        return interaction.reply({
          embeds: [embed]
        });
      }
    }

    const embed = new EmbedBuilder()
      .setDescription('<:X_:1298270493639446548> · **Error occurated, please try again later**!')
      .setColor('DarkRed');
    
    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  } catch {
    return;
  }
}