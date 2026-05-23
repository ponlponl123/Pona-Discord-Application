import { container } from '@/core/container';

export default async function isAvailable(): Promise<boolean> {
    if ( container.pona.client.isReady() && container.lavalink.manager.useableNodes && container.lavalink.manager.useableNodes.connected ) return true;
    return false;
}