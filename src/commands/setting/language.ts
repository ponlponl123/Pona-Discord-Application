import { discordClient as self } from "@/index";
import successEmbedBuilder from "@utils/embeds/success";
import informationEmbedBuilder from "@utils/embeds/infomation";
import { getGuildLanguage, languageCode, langs } from "@utils/i18n";

import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change default language for this guild')
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction, value: languageCode = "en-US") {
    try {
        const member = interaction.member as GuildMember;
        const lang = await getGuildLanguage(member.guild.id);
        const defer = await interaction.deferReply({
            ephemeral: true
        })
        
        if ( member.permissions.has("ManageGuild") && interaction.guild ) {
            await self.saveGuildSettings(interaction.guild.id, {
                language: value
            })
            const newlang = langs.filter(language=>language.code===value);
            return await defer.edit({
                embeds: [successEmbedBuilder(newlang[0].data.settings.language.complete.replace("[value]", newlang[0].label))]
            })
        }

        return await defer.edit({
            embeds: [informationEmbedBuilder(lang.data.reasons.permission_denied, lang.data.settings.language.access_denied)]
        })
    } catch {
        return;
    }
}