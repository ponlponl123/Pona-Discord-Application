/**
 * pona-player – Core type definitions
 * Lightweight, high-performance Discord audio player for Bun
 */

import type { ClientUser, User } from 'discord.js';

// ─── Search ───────────────────────────────────────────────────────────────────

export type SearchPlatform =
  | 'youtube'
  | 'youtube_music'
  | 'soundcloud'
  | 'spotify'
  | 'deezer'
  | 'url';

export type LoadType = 'track' | 'playlist' | 'search' | 'empty' | 'error';

export interface SearchQuery {
  source?: SearchPlatform | string;
  query: string;
}

export interface SearchResult {
  loadType: LoadType;
  tracks: Track[];
  playlist?: PlaylistData;
}

export interface PlaylistData {
  name: string;
  duration: number;
  tracks: Track[];
}

// ─── Track ────────────────────────────────────────────────────────────────────

export interface TrackInfo {
  title: string;
  author: string;
  identifier: string;
  uri: string;
  duration: number;
  artworkUrl: string;
  isStream: boolean;
  isSeekable: boolean;
  sourceName: string;
  isrc?: string;
}

export interface Track extends TrackInfo {
  uniqueId: string;
  timestamp: number;
  track: string;
  cleanTitle: string;
  artist?: ArtistBasic[];
  cleanAuthor: string;
  thumbnail: string | null;
  requester?: User | ClientUser;
  pluginInfo: Record<string, unknown>;
  customData: Record<string, unknown>;
  /** @internal URL for the raw audio stream */
  _streamUrl?: string;
  displayThumbnail(size?: string): string;
}

export interface UnresolvedTrack extends Partial<Track> {
  title: string;
  uniqueId: string;
  author?: string;
  artist?: ArtistBasic[];
  duration?: number;
  resolve(): Promise<void>;
}

export interface ArtistBasic {
  id: string;
  name: string;
}

// ─── Player ───────────────────────────────────────────────────────────────────

export type PlayerState =
  | 'IDLE'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'DISCONNECTING'
  | 'DESTROYING';

export type RepeatMode = 'OFF' | 'TRACK' | 'QUEUE' | 'DYNAMIC';

export interface PlayerOptions {
  guild: string;
  textChannel?: string;
  voiceChannel?: string;
  volume?: number;
  selfMute?: boolean;
  selfDeafen?: boolean;
  lastActive?: number;
}

export interface PlayOptions {
  startTime?: number;
  endTime?: number;
  noReplace?: boolean;
}

// ─── Manager ──────────────────────────────────────────────────────────────────

export type PlayerStateEventType =
  | 'connectionChange'
  | 'playerCreate'
  | 'playerDestroy'
  | 'channelChange'
  | 'volumeChange'
  | 'pauseChange'
  | 'queueChange'
  | 'trackChange'
  | 'repeatChange'
  | 'autoplayChange';

export interface ManagerOptions {
  clientId?: string;
  clientName?: string;
  defaultSearchPlatform?: SearchPlatform;
  send(id: string, payload: GatewayPayload): void;
}

export interface GatewayPayload {
  op: number;
  d: {
    guild_id: string;
    channel_id: string | null;
    self_mute: boolean;
    self_deaf: boolean;
  };
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type TrackEndReason =
  | 'FINISHED'
  | 'LOAD_FAILED'
  | 'STOPPED'
  | 'REPLACED'
  | 'CLEANUP';

export interface ManagerEvents {
  playerCreate: [player: import('./player').Player];
  playerDestroy: [player: import('./player').Player];
  playerStateUpdate: [
    oldPlayer: import('./player').Player,
    newPlayer: import('./player').Player,
    changeType: PlayerStateEventType,
  ];
  playerMove: [
    player: import('./player').Player,
    oldChannel: string,
    newChannel: string,
  ];
  playerDisconnect: [player: import('./player').Player, channel: string];
  trackStart: [player: import('./player').Player, track: Track];
  trackEnd: [
    player: import('./player').Player,
    track: Track,
    reason: TrackEndReason,
  ];
  trackPos: [guildId: string, position: number];
  trackError: [
    player: import('./player').Player,
    track: Track | UnresolvedTrack,
    error: Error,
  ];
  queueEnd: [player: import('./player').Player];
}

// ─── Voice ────────────────────────────────────────────────────────────────────

export interface VoiceServer {
  token: string;
  guild_id: string;
  endpoint: string;
}

export interface VoiceStateUpdate {
  guild_id: string;
  user_id: string;
  session_id: string;
  channel_id: string;
}

export interface VoicePacket {
  t?: 'VOICE_SERVER_UPDATE' | 'VOICE_STATE_UPDATE';
  d: VoiceStateUpdate | VoiceServer;
}

// ─── Stream ───────────────────────────────────────────────────────────────────

export interface StreamOptions {
  seek?: number;
  filters?: string[];
  volume?: number;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export interface EqualizerBand {
  band: number;
  gain: number;
}

// ─── Extractor ────────────────────────────────────────────────────────────────

export interface ExtractorInfo {
  tracks: TrackInfo[];
  playlist?: { name: string; tracks: TrackInfo[] };
}

export interface Extractor {
  name: string;
  validate(query: string): boolean;
  extract(query: string): Promise<ExtractorInfo>;
  search(query: string, limit?: number): Promise<TrackInfo[]>;
  getStreamUrl(identifier: string): Promise<string>;
}
