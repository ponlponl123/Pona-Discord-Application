import { SlashCommandBuilder, InteractionContextType } from 'discord.js';
import execute from './skipto';

export const data = new SlashCommandBuilder()
  .setName('jump')
  .setDescription('Skip to selected track')
  .setContexts([InteractionContextType.Guild]);

export default execute;
