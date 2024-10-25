import { EmbedBuilder } from "discord.js";

export default function successEmbedBuilder(reason: string = ""): EmbedBuilder {
    return new EmbedBuilder()
        .setDescription(`<:Check:1298270444150980619> · **${reason}**!`)
        .setColor('#F9C5D5');
}