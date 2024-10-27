import { EmbedBuilder } from "discord.js";
import { getGuildLanguage } from "../i18n";

export default function errorEmbedBuilder(guildId: string, reason: string = "", title?: string): EmbedBuilder {
    const language = getGuildLanguage(guildId);
    return new EmbedBuilder()
        .setDescription(`<:X_:1298270493639446548> · **${language.data.errors.error_occurred}**!`)
        .setFooter({
            text: reason
        })
        .setColor('DarkRed');
}