import { discordClient as self } from "@/index";
import successEmbedBuilder from "@utils/embeds/success";
import informationEmbedBuilder from "@utils/embeds/infomation";
import { getGuildLanguage, languageCode } from "@utils/i18n";

import {
    Guild,
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
  
export const data = new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change default language for this guild')
    .setDMPermission(false);
  
export default async function execute(interaction: CommandInteraction, value: languageCode = "en-US") {
    const member = interaction.member as GuildMember;
    const lang = getGuildLanguage(member.guild.id);
    
    if ( member.permissions.has("ManageGuild") ) {
        self.saveGuildSettings(interaction.guild as Guild, {
            language: value
        })
        return await interaction.reply({
            embeds: [successEmbedBuilder(lang.data.settings.language.complete.replace("[value]", value))],
            ephemeral: true
        })
    }

    return await interaction.reply({
        embeds: [informationEmbedBuilder(lang.data.reasons.permission_denied, lang.data.settings.language.access_denied)],
        ephemeral: true
    })
}