import { container } from '@/core/container';

export default async function reloadState(): Promise<void> {
    container.lavalink.lavanodes.forEach(async node => {
        if ( !node.identifier ) return;
        await container.lavalink.manager.loadPlayerStates(node.identifier)
    })
}