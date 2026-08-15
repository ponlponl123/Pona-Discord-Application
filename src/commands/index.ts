// Manual initialization
import * as ping from "@commands/ping";
import * as music from "@commands/music";
import * as setting from "@commands/setting";
import {
  userPlayPause,
  userPreviousTrack,
  userNextTrack,
} from "@commands/controls";

import ApplicationCommandStructure from "@/interfaces/command";

export const commands: ApplicationCommandStructure[] = [
  ping,
  music,
  setting,
  userPlayPause,
  userPreviousTrack,
  userNextTrack,
];

export default commands;