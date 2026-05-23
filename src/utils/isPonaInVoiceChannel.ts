import { container } from '@/core/container';
import type { Player } from '@/lavalink';
import { fetchIsUserInVoiceChannel } from './isUserIsInVoiceChannel';

export default async function isPonaInVoiceChannel(
  guildId: string,
): Promise<Player | undefined> {
  const { pona, lavalink } = container;
  if (!pona.client.user?.id) return;

  const inVoice = await fetchIsUserInVoiceChannel(
    guildId,
    pona.client.user.id,
  );
  if (!inVoice) return;

  return (
    lavalink.manager.get(guildId) ??
    (await lavalink.manager.readPlayerState(guildId)) ??
    undefined
  );
}

