import { Player } from "@/lavalink";
import { Track } from "@interfaces/player";

export default async function addToQueue( track: Track | Track[], player: Player ): Promise<boolean> {
    if ( (track as Track[]).length > 1 )
        player.queue.add((track as Track[])[0]);
    else
        player.queue.add(track);

    // Checks if the client should play the track if it's the first one added
    if (!player.playing && !player.paused && !player.queue.size)
        await player.play();

    if ( (track as Track[]).length > 1 ) {
        const tracks = track as Track[];
        tracks.shift();
        player.queue.add(tracks);
    }

    return true;
}