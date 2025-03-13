import { lavalink, discordClient } from '@/index';
import { Player } from '@/lavalink';
import { fetchIsUserInVoiceChannel } from './isUserIsInVoiceChannel';

export default async function isPonaInVoiceChannel(guildId: string): Promise<Player | undefined> {
    if ( !discordClient.client.user?.id ) return;
    const isPonaInVoiceChannel = await fetchIsUserInVoiceChannel(guildId, discordClient.client.user?.id);
    if ( !isPonaInVoiceChannel ) return;
    // const player = await lavalink.manager.readPlayerState(guildId);
    const player = lavalink.manager.get(guildId);
    if (player) return player;
    const fetchPlayer = await lavalink.manager.readPlayerState(guildId);
    if (fetchPlayer) return fetchPlayer;
    return undefined;
}