import { GuildMember } from 'discord.js';
import { discordClient as self } from '..';
import isPonaInVoiceChannel from './isPonaInVoiceChannel';

export default function isUserInVoiceChannel(member: GuildMember): boolean {
    if (!member.voice) {
      return false; // User is not in any voice channel
    }
  
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return false; // User is in a voice channel but it's not defined
    }
  
    return true; // User is in a defined voice channel
}

export async function fetchIsUserInVoiceChannel(guildId: string, memberId: string): Promise<boolean> {
  const member = await self.client.guilds.cache.get(guildId)?.members.fetch(memberId);
  if (member && member.voice && member.voice.channel) {
    return true;
  }

  return false;
}

export async function fetchIsUserInSameVoiceChannel(guildId: string, memberId: string): Promise<boolean> {
  const member = await self.client.guilds.cache.get(guildId)?.members.fetch(memberId);
  const player = await isPonaInVoiceChannel(guildId);
  if (player && member ) {
    const voiceChannel = member.voice.channel;
    if (voiceChannel) return voiceChannel && voiceChannel.id === player.voiceChannel;
  }
  return false;
}