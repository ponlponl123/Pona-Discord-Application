import { container } from '@/core/container';
import type { Player } from '@/lavalink';
import { fetchIsUserInVoiceChannel } from './isUserIsInVoiceChannel';

export default async function isPonaInVoiceChannel(
  guildId: string,
): Promise<Player | undefined> {
  const { pona, lavalink } = container;

  // Return active player immediately if present in Lavalink manager with voiceChannel set
  const activePlayer = lavalink.manager.get(guildId);
  if (activePlayer && activePlayer.voiceChannel) {
    return activePlayer;
  }

  if (!pona.client.user?.id) return;

  const inVoice = await fetchIsUserInVoiceChannel(
    guildId,
    pona.client.user.id,
  );
  if (!inVoice) return;

  return (
    activePlayer ??
    (await lavalink.manager.readPlayerState(guildId)) ??
    undefined
  );
}
