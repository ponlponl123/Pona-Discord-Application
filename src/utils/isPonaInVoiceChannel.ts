import { lavalink } from '@/index';
import { Player } from '@/lavalink';

export default async function isPonaInVoiceChannel(guildId: string): Promise<Player | undefined> {
    const player = await lavalink.manager.readPlayerState(guildId);
    return player;
}