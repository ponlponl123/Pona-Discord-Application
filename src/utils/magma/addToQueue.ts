import { lavaPlayer } from "@/interfaces/lavaPlayer";
import { Track } from "magmastream";

export default async function addToQueue( track: Track, LavaPlayer: lavaPlayer ): Promise<boolean> {
    LavaPlayer.player.queue.add(track);

    // Checks if the client should play the track if it's the first one added
    if (!LavaPlayer.player.playing && !LavaPlayer.player.paused && !LavaPlayer.player.queue.size)
        await LavaPlayer.player.play();

    return true;
}