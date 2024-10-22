import { Rest } from 'lavacord';
import { lavalink } from '@/index'

export default async function getSongs(search: string): Promise<Rest | null> {
    // This gets the best node available, what I mean by that is the idealNodes getter will filter all the connected nodes and then sort them from best to least beast.
    const node = lavalink.manager.idealNodes[0];

    return Rest.load(node, search)
        .catch(err => {
            console.error(err);
            return null;
        });
}