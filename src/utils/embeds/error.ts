import { EmbedBuilder } from "discord.js";

export default function errorEmbedBuilder(reason: string = ""): EmbedBuilder {
    return new EmbedBuilder()
        .setDescription('<:X_:1298270493639446548> · **Error occurated, please try again later**!')
        .setFooter({
            text: reason
        })
        .setColor('DarkRed');
}