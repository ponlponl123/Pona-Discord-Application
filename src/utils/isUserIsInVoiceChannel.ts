import { GuildMember } from 'discord.js';

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