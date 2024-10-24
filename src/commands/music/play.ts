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
import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from "@/utils/isPonaInVoiceChannel";
import joinVoiceChannel from "@/utils/magma/joinVoiceChannelAsPlayer";
import { lavaPlayer } from "@/interfaces/lavaPlayer";
import addToQueue from "@/utils/magma/addToQueue";
import getSongs from "@/utils/magma/getSongs";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Command for debugging")
    .addStringOption(option => option
        .setRequired(true)
        .setName('input')
        .setDescription('Search for video title')
    )
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const input = interaction.options.get("input")?.value as string;

    if ( !member.voice.channel || !interaction.channel ) {
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
            const embed = new EmbedBuilder()
              .setDescription('<:X_:1298270493639446548> · **Error occurated, please try again later**!')
              .setColor('DarkRed');
            
            return interaction.reply({
              embeds: [embed],
              ephemeral: true
            });
        }
    }

    const currentVoiceConnectionInGuild = isPonaInVoiceChannel(member.voice.channel.guildId, 'player') as lavaPlayer[];

    if (
        currentVoiceConnectionInGuild[0].voiceChannel.id !== member.voice.channel.id
    )
    {
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

    if ( !input ) {
        const embed = new EmbedBuilder()
          .setDescription('<:X_:1298270493639446548> · **Input cannot be void**!')
          .setColor('DarkRed');
        
        return interaction.reply({
          embeds: [embed],
          ephemeral: true
        });
    }

    const result = await getSongs(input, member);
    
    if (
        typeof result === 'object' &&
        result.length > 0
    ) {
        const embed = new EmbedBuilder()
            .setTitle(result[0].title)
            .setThumbnail(result[0].thumbnail)
            .setFooter({
                iconURL: result[0].pluginInfo.artistArtworkUrl,
                text: `โดย ${result[0].author}`
            })
            .setColor('#F9C5D5');

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('ahh.. nah')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('abort'),
                new ButtonBuilder()
                    .setLabel('yes!, that one.')
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('addtoqueue')
            );
        
        const response = await interaction.reply({
            content: 'ใช่เพลงนี้หรือปล่าวคะ? ( ͡~ ͜ʖ ͡°)',
            embeds: [embed],
            components: [row],
            ephemeral: true
        });

        const collectorFilter = (i: Interaction) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'addtoqueue') {
                await addToQueue(result[0], currentVoiceConnectionInGuild[0]);
                const embed = new EmbedBuilder()
                    .setTitle(result[0].title)
                    .setURL(`https://youtube.com/watch?v=${result[0].identifier}`)
                    .setThumbnail(result[0].thumbnail)
                    .setAuthor({
                        iconURL: member.user.avatarURL() || undefined,
                        name: `เพิ่มโดย ${member.user.username}`
                    })
                    .setFooter({
                        iconURL: result[0].pluginInfo.artistArtworkUrl,
                        text: `โดย ${result[0].author}`
                    })
                    .setColor('#F9C5D5');
                await response.delete();
                await confirmation.reply({ content: `**Added to queue**`, embeds: [embed] });
            } else if (confirmation.customId === 'abort') {
                await response.delete();
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', embeds: [], components: [] });
        }

        return response;
    }

    const embed = new EmbedBuilder()
      .setDescription('<:Check:1298270444150980619> · **No searching result** :(')
      .setColor('#F9C5D5');
    
    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
}