import { Player } from '@/lavalink';
import { Track } from '@interfaces/player';

export default async function addToQueue(
  track: Track | Track[],
  player: Player,
): Promise<boolean> {
  // Check if a track is already active/playing before modifying queue
  const isCurrentlyPlaying = player.playing || player.paused || player.queue.current !== null;

  if (Array.isArray(track) && track.length > 0) {
    player.queue.add(track[0]);
  } else if (!Array.isArray(track)) {
    player.queue.add(track);
  }

  // Only trigger play if no track was active/playing in queue
  if (!isCurrentlyPlaying && player.queue.totalSize) {
    await player.play();
  }

  if (Array.isArray(track) && track.length > 1) {
    const remainingTracks = track.slice(1);
    player.queue.add(remainingTracks);
  }

  return true;
}
