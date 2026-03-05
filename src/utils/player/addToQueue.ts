import { Player } from '@/lavalink';
import { Track } from '@interfaces/player';

export default async function addToQueue(
  track: Track | Track[],
  player: Player,
): Promise<boolean> {
  if ((track as Track[]).length > 1) player.queue.add((track as Track[])[0]);
  else player.queue.add(track);

  // Checks if the client should play the track if it's the first one added
  // Use totalSize (current + queued) because the first track goes into queue.current,
  // not the array, so queue.size (== this.length) would be 0 and play would never trigger.
  if (!player.playing && !player.paused && player.queue.totalSize)
    await player.play();

  if ((track as Track[]).length > 1) {
    const tracks = track as Track[];
    tracks.shift();
    player.queue.add(tracks);
  }

  return true;
}
