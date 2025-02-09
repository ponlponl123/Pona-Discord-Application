import { lavalink, discordClient as self } from "@/index";
import { lavaPlayer } from "@/interfaces/player";
import path from "path";
import fs from "fs";
import { Guild, TextBasedChannel, VoiceBasedChannel } from "discord.js";

export function getLocalPlayer(guildId: string): lavaPlayer | null {
  return self.playerConnections.filter(connection => connection.guild.id === guildId)[0];;
}

export async function getGlobalPlayer(guildId: string): Promise<lavaPlayer | null> {
  try {
    // find ponaState directory in root directory
    const ponaStateDir = path.join(__dirname, "..", "..", "ponaState");
    const ponaPlayerStateDir = path.join(ponaStateDir, "playerConnections");
    
    // check if directory exists
    if ( !fs.existsSync(ponaStateDir) ) return null;
    const guild = await self.client.guilds.fetch(guildId) as Guild;
    if (!guild ) return null;
    const target = path.join(ponaPlayerStateDir, `${guild.id}.json`);
    if ( !fs.existsSync(target) ) return null;
    const playerConnectionData = JSON.parse(fs.readFileSync(target, "utf8"));
    if ( !playerConnectionData.player ) return null;
    if ( !self.client.guilds.cache.get(playerConnectionData.player) ) return null;
    const fetchGuildData = await self.client.guilds.fetch(playerConnectionData.player) as Guild;
    const player = lavalink.manager.get(playerConnectionData.player);
    if ( !player ) return null;
    const getExistPlayer = self.playerConnections.filter( rootPlayer => rootPlayer.player.guild === player.guild );
    if ( getExistPlayer.length > 0 ) {
    } else {
      return {
        player: player,
        voiceChannel: fetchGuildData.channels.cache.get(playerConnectionData.voiceChannel.id) as VoiceBasedChannel,
        textChannel: fetchGuildData.channels.cache.get(playerConnectionData.textChannel.id) as TextBasedChannel,
        guild: fetchGuildData
      } as lavaPlayer;
    }
  } catch {return null}
  return null;
}