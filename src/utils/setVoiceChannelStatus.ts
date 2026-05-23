import { container } from '@/core/container';
import { config } from '@/config/discord';
import { prefix as consolePrefix } from '@/config/console';
import * as discord from 'discord.js';
import type { VoiceBasedChannel } from 'discord.js';
import { Routes } from 'discord.js';

async function resolveVoiceChannel(
  ref: VoiceBasedChannel | string,
): Promise<VoiceBasedChannel | false> {
  const { pona, lavalink } = container;
  if (typeof ref !== 'string') return ref;

  if (ref.startsWith('guild-')) {
    const player = lavalink.manager.players
      .filter((p: any) => p.guild === ref)
      .at(0);
    if (!player?.voiceChannel) {
      console.error(
        consolePrefix.discord +
          `\x1b[31mCannot find player for voice channel status. ${ref}\x1b[0m`,
      );
      return false;
    }
    return (await pona.client.channels.fetch(
      player.voiceChannel,
    )) as VoiceBasedChannel;
  }

  return (await pona.client.channels.fetch(ref)) as VoiceBasedChannel;
}

export default async function setVoiceChannelStatus(
  voiceChannelRef: VoiceBasedChannel | string,
  text = '',
): Promise<unknown> {
  const voiceChannel = await resolveVoiceChannel(voiceChannelRef);
  if (!voiceChannel) return false;

  if (!voiceChannel.isVoiceBased()) {
    console.error(
      consolePrefix.discord +
        `\x1b[31mCannot set voice channel status, not voice-based. ${voiceChannel}\x1b[0m`,
    );
    return false;
  }

  const rest = new discord.REST({ version: '10' }).setToken(
    config.DISCORD_TOKEN,
  );
  try {
    const req = await rest.put(
      (Routes.channel(voiceChannel.id) + '/voice-status') as discord.RouteLike,
      { body: { status: text } },
    );
    if (req) {
      console.log(
        consolePrefix.discord +
          `\x1b[32mEdit voice status for ${voiceChannel.id}(${voiceChannel.guildId}) successfully!\x1b[0m`,
      );
    }
    return req;
  } catch {
    console.error(
      consolePrefix.discord +
        `\x1b[31mError on setting voice status. ${voiceChannel.id}(${voiceChannel.guildId})\x1b[0m`,
    );
    return false;
  }
}
