/**
 * pona-player
 *
 * Lightweight, high-performance Discord audio player.
 * No Lavalink, no NodeLink — direct voice connection + custom extraction.
 *
 * @example
 * ```ts
 * import { PlayerManager } from 'pona-player';
 *
 * const manager = new PlayerManager({
 *   clientId: 'your-bot-id',
 *   send: (guildId, payload) => {
 *     const guild = client.guilds.cache.get(guildId);
 *     if (guild) guild.shard.send(payload);
 *   },
 * });
 *
 * manager.init();
 * client.on('raw', (d) => manager.updateVoiceState(d));
 *
 * // Search and play
 * const result = await manager.search('never gonna give you up', user);
 * const player = manager.create({ guild: guildId, voiceChannel, textChannel });
 * player.connect();
 * player.queue.add(result.tracks[0]);
 * await player.play();
 *
 * // Events
 * manager.on('trackStart', (player, track) => { ... });
 * manager.on('queueEnd', (player) => { ... });
 * ```
 */

// Core
export { PlayerManager } from './manager';
export { Player } from './player';
export { Queue } from './queue';
export { Filters } from './filters';
export type { FilterName } from './filters';

// Extractors
export { YouTubeExtractor } from './youtube';

// Types
export type {
  // Search
  SearchPlatform,
  SearchQuery,
  SearchResult,
  PlaylistData,
  LoadType,
  // Track
  Track,
  TrackInfo,
  UnresolvedTrack,
  ArtistBasic,
  // Player
  PlayerState,
  PlayerOptions,
  PlayOptions,
  RepeatMode,
  // Manager
  ManagerOptions,
  ManagerEvents,
  PlayerStateEventType,
  GatewayPayload,
  TrackEndReason,
  // Voice
  VoicePacket,
  VoiceServer,
  VoiceStateUpdate,
  // Stream
  StreamOptions,
  // Equalizer
  EqualizerBand,
  // Extractor
  Extractor,
  ExtractorInfo,
} from './types';

// Utilities
export {
  randomId,
  parseDuration,
  extractVideoId,
  isUrl,
  cleanTitle,
  parseTitle,
} from './utils';
