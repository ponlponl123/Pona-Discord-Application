import { discordClient as self } from "@/index";
import { HTTP_PonaCommonStateWithTracks } from "@/interfaces/player";

export function getHTTP_PlayerState(guildId: string): HTTP_PonaCommonStateWithTracks | null {
  const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
  if ( player )
    return {
      pona: {
        voiceChannel: player.voiceChannel.id,
        volume: player.player.volume,
        equalizer: player.player.filters.equalizer,
        repeat: {
          track: player.player.trackRepeat,
          queue: player.player.queueRepeat,
          dynamic: player.player.dynamicRepeat
        },
        isAutoplay: player.player.isAutoplay,
        paused: player.player.paused,
        playing: player.player.playing,
      },
      current: player.player.queue.current,
      queue: player.player.queue,
    }
  return null;
}