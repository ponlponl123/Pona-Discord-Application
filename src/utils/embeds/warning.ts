import { EmbedBuilder } from "discord.js";

export default function warningEmbedBuilder(reason: string = ""): EmbedBuilder {
    return new EmbedBuilder()
        .setDescription(`<:X_:1298270493639446548> · **${reason}**!`)
        .setColor('#F9C5D5');
}