import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, GuildMember, CommandInteractionOption } from "discord.js";
import errorEmbedBuilder from "@utils/embeds/error";
import { langs } from '@utils/i18n';

export const data = new SlashCommandBuilder()
    .setName("setting")
    .setDescription("Category about setting pona application")
    .setNameLocalizations({
        th: 'ตั้งค่า',
    })
    .setDescriptionLocalizations({
        th: 'การตั้งค่า Pona!',
    })
    .addSubcommand(subcommand => subcommand
        .setName('language')
        .setDescription('Change default language for this guild')
        .setNameLocalizations({
            th: 'ภาษา',
        })
        .setDescriptionLocalizations({
            th: 'กำหนดภาษาหลักในกิวด์นี้',
        })
        .addStringOption(option => option
            .setName('lang')
            .setDescription('Target language')
            .setChoices(
                langs.map(lang => ({
                    name: lang.label,
                    value: lang.code
                }))
            )
            .setRequired(true)
        )
    )

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const subCommand = (interaction.options as CommandInteractionOptionResolver<CacheType>).getSubcommand();

    switch ( subCommand ) {
        case 'language':
        default:
            return interaction.reply({
                embeds: [errorEmbedBuilder('Invalid subcommand.')]
            });
    }
}