import {
    GuildMember,
    EmbedBuilder,
    CommandInteraction,
    SlashCommandBuilder,
    ContextMenuCommandInteraction,
    UserContextMenuCommandInteraction
} from "discord.js";
import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";
import joinVoiceChannel from "@/utils/magma/joinVoiceChannelAsPlayer";
import getSongs from "@/utils/magma/getSongs";
import { DiscordGatewayAdapterCreator, VoiceConnection } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
    .setName("find")
    .setDescription("Command for debugging")
    .addStringOption(option => option
        .setRequired(true)
        .setName('input')
        .setDescription('Search for video title')
    )
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    // const input = interaction.options.get("input")?.value as string;

    // if ( !member.voice.channel ) {
    //     const embed = new EmbedBuilder()
    //         .setDescription('<:X_:1298270493639446548> · **Invalid voice channel**!')
    //         .setFooter({
    //             text: 'Please enter a voice channel.'
    //         })
    //         .setColor('#F2789F');
        
    //     return interaction.reply({
    //         embeds: [embed]
    //     });
    // }

    // const currentVoiceConnectionInGuild = isPonaInVoiceChannel(member.voice.channel.guildId, false) as VoiceConnection[];

    // if (
    //     currentVoiceConnectionInGuild.length === 0
    // )
    // {
    //     const player = await joinVoiceChannel(
    //         member.voice.channel,
    //         member.voice.channel.guild
    //     )

    //     if ( !player ) {
    //         const embed = new EmbedBuilder()
    //           .setDescription('<:X_:1298270493639446548> · **Error occurated, please try again later**!')
    //           .setColor('DarkRed');
            
    //         return interaction.reply({
    //           embeds: [embed]
    //         });
    //     }
    // }

    // if (
    //     currentVoiceConnectionInGuild[0].joinConfig.channelId !== member.voice.channel.id
    // )
    // {
    //     const embed = new EmbedBuilder()
    //         .setDescription('<:X_:1298270493639446548> · **Invalid voice channel**!')
    //         .setFooter({
    //             text: 'Not a same voice channel'
    //         })
    //         .setColor('#F2789F');
        
    //     return interaction.reply({
    //         embeds: [embed]
    //     });
    // }

    // if ( !input ) {
    //     const embed = new EmbedBuilder()
    //       .setDescription('<:X_:1298270493639446548> · **Input cannot be void**!')
    //       .setColor('DarkRed');
        
    //     return interaction.reply({
    //       embeds: [embed]
    //     });
    // }

    // const result = await getSongs("ytsearch:" + input);
    
    // if ( result ) {
    //     console.log("Searching result", result);

    //     const embed = new EmbedBuilder()
    //       .setDescription('<:Check:1298270444150980619> · **Searching result is in terminal**!')
    //       .setColor('#F9C5D5');
        
    //     return interaction.reply({
    //       embeds: [embed]
    //     });
    // }

    // const embed = new EmbedBuilder()
    //   .setDescription('<:Check:1298270444150980619> · **No searching result** :(')
    //   .setColor('#F9C5D5');
    
    // return interaction.reply({
    //   embeds: [embed]
    // });
}