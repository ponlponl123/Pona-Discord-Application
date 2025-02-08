import { discordClient as self } from "@/index";
import { HTTP_PonaCommonStateWithTracks } from "@/interfaces/player";
import { Player } from "@/lavalink";

export function getHTTP_PlayerState(guildId: string): HTTP_PonaCommonStateWithTracks | null {
  const player = self.playerConnections.filter(connection => connection.guild.id === guildId)[0];
  if ( player )
    return {
      pona: {
        position: player.player.position,
        length: player.player.queue.current?.duration || 0,
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

export function convertTo_HTTPPlayerState(player: Player): HTTP_PonaCommonStateWithTracks | null {
  try {
    return {
      pona: {
        position: player.position,
        length: player.queue.current?.duration || 0,
        voiceChannel: player.voiceChannel as string,
        volume: player.volume,
        equalizer: player.filters?.equalizer || [],
        repeat: {
          track: player.trackRepeat,
          queue: player.queueRepeat,
          dynamic: player.dynamicRepeat
        },
        isAutoplay: player.isAutoplay,
        paused: player.paused,
        playing: player.playing,
      },
      current: player.queue.current,
      queue: player.queue,
    }
  } catch {
    return null;
  }
}