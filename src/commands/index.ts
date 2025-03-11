// Manual initialization
import * as ping from "@commands/ping";
import * as music from "@commands/music";
import * as setting from "@commands/setting";

import SlashCommandStructure from "@/interfaces/command";

export const commands: SlashCommandStructure[] =[
  ping,
  music,
  setting
];

export default commands;