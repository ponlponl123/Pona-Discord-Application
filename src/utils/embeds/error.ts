import { EmbedBuilder } from "discord.js";
import { getGuildLanguage } from "../i18n";

export default async function errorEmbedBuilder(guildId: string, reason: string = ""): Promise<EmbedBuilder> {
    const language = await getGuildLanguage(guildId);
    return new EmbedBuilder()
        .setDescription(`<:X_:1298270493639446548> · **${language.data.errors.error_occurred}**!`)
        .setFooter({
            text: reason || "No additional information provided"
        })
        .setColor('DarkRed');
}