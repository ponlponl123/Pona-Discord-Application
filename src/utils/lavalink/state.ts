import { lavalink } from '@/index';

export default async function reloadState(): Promise<void> {
    lavalink.lavanodes.forEach(async node => {
        if ( !node.identifier ) return;
        await lavalink.manager.loadPlayerStates(node.identifier)
    })
}