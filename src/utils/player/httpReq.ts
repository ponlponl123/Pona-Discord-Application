import { HTTP_PonaCommonStateWithTracks } from "@/interfaces/player";
import { Player } from "@/lavalink";
import isPonaInVoiceChannel from "../isPonaInVoiceChannel";

export async function getHTTP_PlayerState(guildId: string): Promise<HTTP_PonaCommonStateWithTracks | null> {
  const player = await isPonaInVoiceChannel(guildId);
  if ( player )
    return {
      pona: {
        position: player.position,
        length: player.queue.current?.duration || 0,
        voiceChannel: player.voiceChannel as string,
        volume: player.volume,
        equalizer: player.filters.equalizer,
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