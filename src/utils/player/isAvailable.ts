import { discordClient as self, lavalink } from "@/index";

export default async function isAvailable(): Promise<boolean> {
    if ( self.client.isReady() && lavalink.manager.useableNodes && lavalink.manager.useableNodes.connected ) return true;
    return false;
}