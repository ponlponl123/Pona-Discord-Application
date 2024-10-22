import { REST, Routes } from "discord.js";
import { config } from "config/discord";
import { commands } from "commands/index";

import { prefix as consolePrefix } from 'config/console'

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log(consolePrefix.discord + `Started refreshing application (/) commands for guild ${guildId}`);

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log(consolePrefix.discord + "Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}