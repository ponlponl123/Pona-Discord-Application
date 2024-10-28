import { lavaPlayer, Track } from "@interfaces/player";

export default async function addToQueue( track: Track | Track[], LavaPlayer: lavaPlayer ): Promise<boolean> {
    if ( (track as Track[]).length > 1 )
        LavaPlayer.player.queue.add((track as Track[])[0]);
    else
        LavaPlayer.player.queue.add(track);

    // Checks if the client should play the track if it's the first one added
    if (!LavaPlayer.player.playing && !LavaPlayer.player.paused && !LavaPlayer.player.queue.size)
        await LavaPlayer.player.play();

    if ( (track as Track[]).length > 1 ) {
        const tracks = track as Track[];
        tracks.shift();
        LavaPlayer.player.queue.add(tracks);
    }

    return true;
}