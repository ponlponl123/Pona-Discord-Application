import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ContextMenuCommandBuilder,
} from 'discord.js';

export interface ChatInputCommandStructure {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void | Promise<any>;
}

export interface ContextMenuCommandStructure {
  data: ContextMenuCommandBuilder;
  execute: (interaction: ContextMenuCommandInteraction) => void | Promise<any>;
}

export type ApplicationCommandStructure =
  | ChatInputCommandStructure
  | ContextMenuCommandStructure;

export default ApplicationCommandStructure;
