import { lavalink, discordClient } from '@/index';
import type { Player } from '@/lavalink';
import { fetchIsUserInVoiceChannel } from './isUserIsInVoiceChannel';

export default async function isPonaInVoiceChannel(
  guildId: string,
): Promise<Player | undefined> {
  if (!discordClient.client.user?.id) return;

  const inVoice = await fetchIsUserInVoiceChannel(
    guildId,
    discordClient.client.user.id,
  );
  if (!inVoice) return;

  return (
    lavalink.manager.get(guildId) ??
    (await lavalink.manager.readPlayerState(guildId)) ??
    undefined
  );
}
