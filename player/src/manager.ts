/**
 * pona-player – PlayerManager
 *
 * Central orchestrator: manages guild players, voice adapter routing,
 * extractor registry, and search delegation.
 * Replaces Lavalink Manager entirely — no external server needed.
 */

import { EventEmitter } from 'node:events';
import { Collection } from '@discordjs/collection';
import type {
  DiscordGatewayAdapterCreator,
  DiscordGatewayAdapterLibraryMethods,
} from '@discordjs/voice';
import type { ClientUser, User } from 'discord.js';

import { Player } from './player';
import { YouTubeExtractor } from './youtube';
import { randomId, parseTitle, isUrl, extractVideoId } from './utils';
import type {
  Extractor,
  ManagerEvents,
  ManagerOptions,
  PlayerOptions,
  SearchPlatform,
  SearchQuery,
  SearchResult,
  Track,
  TrackInfo,
  VoicePacket,
  VoiceServer,
  VoiceStateUpdate,
} from './types';

// ─── Default Search Platform Map ──────────────────────────────────────────────

const PLATFORM_MAP: Record<string, SearchPlatform> = {
  'pona! search': 'youtube_music',
  'youtube music': 'youtube_music',
  youtube: 'youtube',
  spotify: 'spotify',
  soundcloud: 'soundcloud',
  deezer: 'deezer',
};

// ─── Typed EventEmitter ───────────────────────────────────────────────────────

export declare interface PlayerManager {
  on<U extends keyof ManagerEvents>(
    event: U,
    listener: (...args: ManagerEvents[U]) => void,
  ): this;
  emit<U extends keyof ManagerEvents>(
    event: U,
    ...args: ManagerEvents[U]
  ): boolean;
  off<U extends keyof ManagerEvents>(
    event: U,
    listener: (...args: ManagerEvents[U]) => void,
  ): this;
  once<U extends keyof ManagerEvents>(
    event: U,
    listener: (...args: ManagerEvents[U]) => void,
  ): this;
}

// ─── PlayerManager ────────────────────────────────────────────────────────────

export class PlayerManager extends EventEmitter {
  public readonly players = new Collection<string, Player>();
  public readonly options: ManagerOptions;
  public readonly extractors: Extractor[] = [];

  /** Voice adapter methods for each guild, used by @discordjs/voice */
  private adapters = new Map<string, DiscordGatewayAdapterLibraryMethods>();

  /** Built-in YouTube extractor */
  private youtube: YouTubeExtractor;

  private initiated = false;

  constructor(options: ManagerOptions) {
    super();
    this.options = {
      defaultSearchPlatform: 'youtube_music',
      clientName: 'pona-player',
      ...options,
    };

    // Register built-in extractors
    this.youtube = new YouTubeExtractor();
    this.extractors.push(this.youtube);
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  public init(clientId?: string): this {
    if (this.initiated) return this;
    if (clientId) this.options.clientId = clientId;
    if (!this.options.clientId) {
      throw new Error(
        '[pona-player] clientId is required. Pass it to init() or in the constructor.',
      );
    }
    this.initiated = true;
    console.log(`[pona-player] Initialized (client: ${this.options.clientId})`);
    return this;
  }

  // ─── Extractor Management ─────────────────────────────────────────────────

  /** Register a custom extractor (e.g. Spotify, SoundCloud) */
  public registerExtractor(extractor: Extractor): this {
    this.extractors.push(extractor);
    return this;
  }

  // ─── Player CRUD ──────────────────────────────────────────────────────────

  public create(options: PlayerOptions): Player {
    if (this.players.has(options.guild)) {
      return this.players.get(options.guild)!;
    }
    const player = new Player(this, options);
    this.players.set(options.guild, player);
    this.emit('playerCreate', player);
    return player;
  }

  public get(guild: string): Player | undefined {
    return this.players.get(guild);
  }

  public destroy(guild: string): void {
    const player = this.players.get(guild);
    if (player) player.destroy();
  }

  // ─── Search ───────────────────────────────────────────────────────────────

  public async search<T = User | ClientUser>(
    query: string | SearchQuery,
    requester?: T,
  ): Promise<SearchResult> {
    const q: SearchQuery = typeof query === 'string' ? { query } : query;
    const searchText = q.query;

    // Determine source platform
    const sourceName =
      q.source ?? this.options.defaultSearchPlatform ?? 'youtube_music';
    const platform = PLATFORM_MAP[sourceName] ?? sourceName;

    // If it's a URL, try extractors
    if (isUrl(searchText)) {
      for (const ext of this.extractors) {
        if (ext.validate(searchText)) {
          try {
            const info = await ext.extract(searchText);
            const tracks = info.tracks.map((t) =>
              this.buildTrack(t, requester),
            );

            if (info.playlist) {
              return {
                loadType: 'playlist',
                tracks: info.playlist.tracks.map((t) =>
                  this.buildTrack(t, requester),
                ),
                playlist: {
                  name: info.playlist.name,
                  duration: info.playlist.tracks.reduce(
                    (a, t) => a + t.duration,
                    0,
                  ),
                  tracks: info.playlist.tracks.map((t) =>
                    this.buildTrack(t, requester),
                  ),
                },
              };
            }

            return {
              loadType: tracks.length > 0 ? 'track' : 'empty',
              tracks,
            };
          } catch {
            // Try next extractor
          }
        }
      }

      return { loadType: 'empty', tracks: [] };
    }

    // Text search
    try {
      let results: TrackInfo[];

      if (platform === 'youtube_music') {
        results = await this.youtube.searchMusic(searchText, 10);
        // Fallback to regular YouTube if YT Music returns nothing
        if (results.length === 0) {
          results = await this.youtube.search(searchText, 10);
        }
      } else if (platform === 'youtube') {
        results = await this.youtube.search(searchText, 10);
      } else {
        // For unsupported platforms, search YouTube as fallback
        results = await this.youtube.search(searchText, 10);
      }

      const tracks = results.map((t) => this.buildTrack(t, requester));

      return {
        loadType: tracks.length > 0 ? 'search' : 'empty',
        tracks,
      };
    } catch (err) {
      return {
        loadType: 'error',
        tracks: [],
      };
    }
  }

  // ─── Stream URL Resolution ────────────────────────────────────────────────

  /** Get playable stream URL for a track */
  public async getStreamUrl(track: Track): Promise<string> {
    // Check if any extractor can handle this track's source
    for (const ext of this.extractors) {
      if (
        ext.name === track.sourceName ||
        (ext.name === 'youtube' &&
          (track.sourceName === 'youtube' ||
            track.sourceName === 'youtube_music'))
      ) {
        return ext.getStreamUrl(track.identifier);
      }
    }

    // Fallback: try YouTube if we have an identifier
    if (extractVideoId(track.uri) || track.identifier) {
      return this.youtube.getStreamUrl(
        extractVideoId(track.uri) ?? track.identifier,
      );
    }

    throw new Error(
      `[pona-player] No extractor found for: ${track.sourceName}`,
    );
  }

  // ─── Voice State Updates ──────────────────────────────────────────────────

  /**
   * Handle raw Discord gateway events.
   * Wire this up: `client.on('raw', d => manager.updateVoiceState(d))`
   */
  public updateVoiceState(
    data: VoicePacket | VoiceServer | VoiceStateUpdate,
  ): void {
    // Filter to voice events only
    if ('t' in data) {
      const packet = data as VoicePacket;
      if (
        packet.t !== 'VOICE_STATE_UPDATE' &&
        packet.t !== 'VOICE_SERVER_UPDATE'
      ) {
        return;
      }

      const payload = packet.d;

      if ('token' in payload) {
        // VOICE_SERVER_UPDATE
        const vs = payload as VoiceServer;
        const adapter = this.adapters.get(vs.guild_id);
        if (adapter) {
          adapter.onVoiceServerUpdate({
            token: vs.token,
            guild_id: vs.guild_id,
            endpoint: vs.endpoint,
          } as never);
        }
        return;
      }

      // VOICE_STATE_UPDATE
      const vsu = payload as VoiceStateUpdate;
      if (vsu.user_id !== this.options.clientId) return;

      const player = this.players.get(vsu.guild_id);
      const adapter = this.adapters.get(vsu.guild_id);

      if (adapter) {
        adapter.onVoiceStateUpdate({
          channel_id: vsu.channel_id,
          guild_id: vsu.guild_id,
          user_id: vsu.user_id,
          session_id: vsu.session_id,
        } as never);
      }

      // Handle channel moves / disconnects
      if (player) {
        if (vsu.channel_id) {
          if (player.voiceChannel !== vsu.channel_id) {
            this.emit(
              'playerMove',
              player,
              player.voiceChannel ?? '',
              vsu.channel_id,
            );
            player.voiceChannel = vsu.channel_id;
          }
        } else {
          // Bot was disconnected from voice
          this.emit('playerDisconnect', player, player.voiceChannel ?? '');
          player.destroy(false);
        }
      }
      return;
    }

    // Direct VoiceServer or VoiceStateUpdate objects
    if ('token' in data) {
      const vs = data as VoiceServer;
      const adapter = this.adapters.get(vs.guild_id);
      if (adapter) {
        adapter.onVoiceServerUpdate(vs as never);
      }
    } else if ('session_id' in data) {
      const vsu = data as VoiceStateUpdate;
      const adapter = this.adapters.get(vsu.guild_id);
      if (adapter) {
        adapter.onVoiceStateUpdate(vsu as never);
      }
    }
  }

  // ─── Voice Adapter Factory ────────────────────────────────────────────────

  /**
   * Creates a DiscordGatewayAdapterCreator for @discordjs/voice.
   * Routes voice payloads through the manager's `send` callback
   * and receives voice state updates via `updateVoiceState`.
   */
  public createAdapterCreator(guildId: string): DiscordGatewayAdapterCreator {
    return (methods: DiscordGatewayAdapterLibraryMethods) => {
      this.adapters.set(guildId, methods);

      return {
        sendPayload: (payload: { op: number; d: unknown }) => {
          try {
            this.options.send(guildId, payload as never);
            return true;
          } catch {
            return false;
          }
        },
        destroy: () => {
          this.adapters.delete(guildId);
        },
      };
    };
  }

  // ─── Track Builder ────────────────────────────────────────────────────────

  private buildTrack<T>(info: TrackInfo, requester?: T): Track {
    const { cleanTitle, cleanAuthor } = parseTitle(info.title, info.author);
    const videoId = extractVideoId(info.uri);
    const thumbnail = info.uri.includes('youtube')
      ? `https://img.youtube.com/vi/${videoId ?? info.identifier}/default.jpg`
      : info.artworkUrl || null;

    const SIZES = [
      '0',
      '1',
      '2',
      '3',
      'default',
      'mqdefault',
      'hqdefault',
      'maxresdefault',
    ];

    const track: Track = {
      track: info.identifier, // For API compat — stores identifier
      timestamp: Date.now(),
      uniqueId: randomId(32),
      title: info.title,
      cleanTitle,
      identifier: info.identifier,
      author: info.author,
      cleanAuthor,
      duration: info.duration,
      isrc: info.isrc ?? '',
      isSeekable: info.isSeekable,
      isStream: info.isStream,
      uri: info.uri,
      artworkUrl: info.artworkUrl ?? '',
      sourceName: info.sourceName,
      thumbnail,
      requester: requester as never,
      pluginInfo: {},
      customData: {},
      displayThumbnail(size = 'default'): string {
        const finalSize = SIZES.find((s) => s === size) ?? 'default';
        return this.uri.includes('youtube')
          ? `https://img.youtube.com/vi/${videoId ?? info.identifier}/${finalSize}.jpg`
          : (this.artworkUrl ?? '');
      },
    };

    track.displayThumbnail = track.displayThumbnail.bind(track);
    return track;
  }
}
