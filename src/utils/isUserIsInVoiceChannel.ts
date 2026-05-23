import type { GuildMember } from 'discord.js';
import { container } from '@/core/container';
import isPonaInVoiceChannel from './isPonaInVoiceChannel';

export default function isUserInVoiceChannel(member: GuildMember): boolean {
  return !!member.voice?.channel;
}

export async function fetchIsUserInVoiceChannel(
  guildId: string,
  memberId: string,
): Promise<boolean> {
  const { pona } = container;
  const member = await pona.client.guilds.cache
    .get(guildId)
    ?.members.fetch(memberId);
  return !!member?.voice?.channel;
}

export async function fetchIsUserInSameVoiceChannel(
  guildId: string,
  memberId: string,
): Promise<boolean> {
  const { pona } = container;
  const member = await pona.client.guilds.cache
    .get(guildId)
    ?.members.fetch(memberId);
  const player = await isPonaInVoiceChannel(guildId);
  return (
    !!player &&
    !!member?.voice?.channel &&
    member.voice.channel.id === player.voiceChannel
  );
}
