import { EmbedBuilder } from "discord.js";

export default function informationEmbedBuilder(title: string = "Information", description: string = ""): EmbedBuilder {
    return new EmbedBuilder()
        .setDescription(`<:Question:1298270472428978217> · **${title}**`)
        .setFooter({
            text: description
        })
        .setColor('#F9C5D5');
}