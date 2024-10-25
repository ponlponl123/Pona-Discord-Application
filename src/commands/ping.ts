import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .setNameLocalizations({
      th: 'ปิง',
  })
  .setDescriptionLocalizations({
      th: 'ตอบกลับด้วย ปอง! ( ͡° ͜ʖ ͡°)',
  });

export async function execute(interaction: CommandInteraction) {
  return interaction.reply(":ping_pong: Pong!");
}