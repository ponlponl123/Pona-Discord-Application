import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface slashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => void;
}