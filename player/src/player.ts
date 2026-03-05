/**
 * pona-player – Player (per-guild)
 *
 * Wraps @discordjs/voice AudioPlayer + VoiceConnection.
 * Handles playback, seeking, volume, position tracking, repeat modes.
 */

import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  StreamType,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import type {
  VoiceConnection,
  AudioPlayer,
  AudioResource,
  DiscordGatewayAdapterCreator,
} from '@discordjs/voice';
import type { Message } from 'discord.js';

import { Queue } from './queue';
import { Filters } from './filters';
import type { PlayerManager } from './manager';
import type {
  Track,
  UnresolvedTrack,
  PlayerOptions,
  PlayOptions,
  PlayerState,
  PlayerStateEventType,
  SearchQuery,
  SearchResult,
} from './types';
import { createFFmpegStream, type FFmpegProcess } from './utils';

export class Player {
  public readonly queue: Queue;
  public filters: Filters;

  // State
  public position = 0;
  public volume = 100;
  public playing = false;
  public paused = false;
  public state: PlayerState = 'DISCONNECTED';
  public trackRepeat = false;
  public queueRepeat = false;
  public dynamicRepeat = false;
  public isAutoplay = false;

  // Identifiers
  public guild: string;
  public voiceChannel: string | null = null;
  public textChannel: string | null = null;
  public nowPlayingMessage?: Message;

  // Internal
  public readonly manager: PlayerManager;
  public readonly options: PlayerOptions;
  private connection: VoiceConnection | null = null;
  private audioPlayer: AudioPlayer;
  private currentResource: AudioResource | null = null;
  private currentFFmpeg: FFmpegProcess | null = null;
  private positionTimer: ReturnType<typeof setInterval> | null = null;
  private dynamicLoopInterval: ReturnType<typeof setInterval> | null = null;
  private data: Record<string, unknown> = {};
  private _destroyed = false;

  constructor(manager: PlayerManager, options: PlayerOptions) {
    this.manager = manager;
    this.options = options;
    this.guild = options.guild;
    this.voiceChannel = options.voiceChannel ?? null;
    this.textChannel = options.textChannel ?? null;
    this.volume = options.volume ?? 100;

    // Queue with change notification
    this.queue = new Queue(() => {
      this.emitStateUpdate('queueChange');
    });

    // Filters with rebuild callback
    this.filters = new Filters(() => {
      if (this.playing && this.queue.current) {
        this.rebuildStream().catch(() => {});
      }
    });

    // Audio player
    this.audioPlayer = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play },
    });

    this.setupAudioPlayerEvents();
  }

  // ─── Data Store ───────────────────────────────────────────────────────────

  public set(key: string, value: unknown): void {
    this.data[key] = value;
  }

  public get<T>(key: string): T {
    return this.data[key] as T;
  }

  // ─── Search (delegate to manager) ─────────────────────────────────────────

  public search(
    query: string | SearchQuery,
    requester?: unknown,
  ): Promise<SearchResult> {
    return this.manager.search(query, requester);
  }

  // ─── Voice Connection ─────────────────────────────────────────────────────

  public connect(): this {
    if (!this.voiceChannel)
      throw new RangeError('No voice channel has been set.');
    if (this._destroyed) throw new Error('Player has been destroyed.');

    const oldState = this.state;
    this.state = 'CONNECTING';

    const adapterCreator = this.manager.createAdapterCreator(this.guild);

    this.connection = joinVoiceChannel({
      channelId: this.voiceChannel,
      guildId: this.guild,
      adapterCreator,
      selfDeaf: this.options.selfDeafen ?? true,
      selfMute: this.options.selfMute ?? false,
    });

    this.connection.subscribe(this.audioPlayer);

    // Handle connection state changes
    this.connection.on('stateChange', (_oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Ready) {
        this.state = 'CONNECTED';
        if (oldState !== 'CONNECTED') {
          this.emitStateUpdate('connectionChange');
        }
      } else if (newState.status === VoiceConnectionStatus.Disconnected) {
        // Try to reconnect
        this.tryReconnect();
      } else if (newState.status === VoiceConnectionStatus.Destroyed) {
        this.state = 'DISCONNECTED';
      }
    });

    this.connection.on('error', (err) => {
      console.error(
        `[pona-player] Voice connection error for ${this.guild}:`,
        err.message,
      );
    });

    // Don't wait for ready – set connected optimistically for API compat
    this.state = 'CONNECTED';
    this.emitStateUpdate('connectionChange');
    return this;
  }

  public disconnect(): this {
    if (!this.voiceChannel) return this;

    this.state = 'DISCONNECTING';
    this.stopPositionTracking();
    this.killFFmpeg();

    if (this.audioPlayer) {
      this.audioPlayer.stop(true);
    }

    if (this.connection) {
      try {
        this.connection.destroy();
      } catch {
        // Already destroyed
      }
      this.connection = null;
    }

    this.voiceChannel = null;
    this.state = 'DISCONNECTED';
    this.playing = false;
    this.paused = false;
    this.emitStateUpdate('connectionChange');
    return this;
  }

  public destroy(disconnect = true): void {
    if (this._destroyed) return;
    this._destroyed = true;

    this.state = 'DESTROYING';
    if (disconnect) this.disconnect();
    this.stopPositionTracking();
    this.killFFmpeg();

    if (this.dynamicLoopInterval) {
      clearInterval(this.dynamicLoopInterval);
      this.dynamicLoopInterval = null;
    }

    this.manager.emit('playerDestroy', this);
    this.manager.players.delete(this.guild);
    this.emitStateUpdate('playerDestroy');
  }

  // ─── Channel Management ───────────────────────────────────────────────────

  public setVoiceChannel(channel: string): this {
    this.voiceChannel = channel;
    this.connect();
    this.emitStateUpdate('channelChange');
    return this;
  }

  public setTextChannel(channel: string): this {
    this.textChannel = channel;
    this.emitStateUpdate('channelChange');
    return this;
  }

  public setNowPlayingMessage(message: Message): Message {
    this.nowPlayingMessage = message;
    return message;
  }

  // ─── Playback ─────────────────────────────────────────────────────────────

  public async play(): Promise<void>;
  public async play(track: Track | UnresolvedTrack): Promise<void>;
  public async play(options: PlayOptions): Promise<void>;
  public async play(
    track: Track | UnresolvedTrack,
    options: PlayOptions,
  ): Promise<void>;
  public async play(
    trackOrOptions?: PlayOptions | Track | UnresolvedTrack,
    playOptions?: PlayOptions,
  ): Promise<void> {
    if (this._destroyed) throw new Error('Player has been destroyed.');

    // If a track was provided, set it as current
    if (trackOrOptions && 'title' in trackOrOptions) {
      if (this.queue.current) this.queue.previous = this.queue.current;
      this.queue.current = trackOrOptions as Track;
    }

    if (!this.queue.current) throw new RangeError('No current track.');

    const track = this.queue.current as Track;
    const options =
      playOptions ??
      (trackOrOptions && !('title' in trackOrOptions)
        ? (trackOrOptions as PlayOptions)
        : {});

    // Resolve stream URL if not already set
    if (!track._streamUrl) {
      try {
        const streamUrl = await this.manager.getStreamUrl(track);
        (track as Track)._streamUrl = streamUrl;
      } catch (err) {
        this.manager.emit(
          'trackError',
          this,
          track,
          err instanceof Error ? err : new Error(String(err)),
        );
        // Try next track
        if (this.queue[0]) {
          this.queue.current = this.queue.shift()!;
          return this.play();
        }
        return;
      }
    }

    // Build FFmpeg stream
    const seekSeconds = (options.startTime ?? 0) / 1000;
    this.createAndPlayStream(track._streamUrl!, seekSeconds);

    this.position = options.startTime ?? 0;
    this.playing = true;
    this.paused = false;

    this.startPositionTracking();
    this.manager.emit('trackStart', this, track);
  }

  public stop(amount?: number): this {
    if (typeof amount === 'number' && amount > 1) {
      if (amount > this.queue.length)
        throw new RangeError('Cannot skip more than the queue length.');
      this.queue.splice(0, amount - 1);
    }

    this.audioPlayer.stop(true);
    this.killFFmpeg();
    this.emitStateUpdate('trackChange');
    return this;
  }

  public skipto(index: number): this {
    if (index > this.queue.length)
      throw new RangeError('Cannot skip more than the queue length.');
    if (!this.queue.current) throw new ReferenceError('No current track.');

    const skipped = this.queue.splice(0, index);
    for (const t of skipped) this.queue.push(t);

    this.audioPlayer.stop(true);
    this.killFFmpeg();
    this.emitStateUpdate('trackChange');
    return this;
  }

  public previous(): this {
    if (this.queue.previous) {
      this.queue.unshift(this.queue.previous);
      this.queue.previous = null;
    }
    this.stop();
    this.emitStateUpdate('trackChange');
    return this;
  }

  public pause(paused: boolean): this {
    if (this.paused === paused || !this.queue.totalSize) return this;

    if (paused) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.unpause();
    }

    this.playing = !paused;
    this.paused = paused;
    this.emitStateUpdate('pauseChange');
    return this;
  }

  public async seek(positionMs: number): Promise<this> {
    if (!this.queue.current) return this;
    const track = this.queue.current as Track;

    positionMs = Math.max(0, Math.min(positionMs, track.duration ?? 0));

    if (!track._streamUrl) return this;

    // Rebuild stream from the seek position
    this.killFFmpeg();
    this.createAndPlayStream(track._streamUrl, positionMs / 1000);

    this.position = positionMs;
    this.emitStateUpdate('trackChange');
    return this;
  }

  public restart(): void {
    if (!this.queue.current) {
      if (this.queue.length) this.play();
      return;
    }
    this.seek(0);
  }

  // ─── Volume ───────────────────────────────────────────────────────────────

  public setVolume(vol: number): this {
    if (isNaN(vol)) throw new TypeError('Volume must be a number.');
    this.volume = vol;

    // Apply volume to current resource if available
    if (this.currentResource?.volume) {
      this.currentResource.volume.setVolume(vol / 100);
    }

    this.emitStateUpdate('volumeChange');
    return this;
  }

  // ─── Repeat Modes ─────────────────────────────────────────────────────────

  public setTrackRepeat(repeat: boolean): this {
    this.trackRepeat = repeat;
    if (repeat) {
      this.queueRepeat = false;
      this.dynamicRepeat = false;
    }
    this.emitStateUpdate('repeatChange');
    return this;
  }

  public setQueueRepeat(repeat: boolean): this {
    this.queueRepeat = repeat;
    if (repeat) {
      this.trackRepeat = false;
      this.dynamicRepeat = false;
    }
    this.emitStateUpdate('repeatChange');
    return this;
  }

  public setDynamicRepeat(repeat: boolean, intervalMs: number): this {
    if (repeat && this.queue.size <= 1) {
      throw new RangeError('Queue must have more than 1 track.');
    }

    this.dynamicRepeat = repeat;
    if (repeat) {
      this.trackRepeat = false;
      this.queueRepeat = false;

      this.dynamicLoopInterval = setInterval(() => {
        if (!this.dynamicRepeat) return;
        this.queue.shuffle();
      }, intervalMs);
    } else {
      if (this.dynamicLoopInterval) {
        clearInterval(this.dynamicLoopInterval);
        this.dynamicLoopInterval = null;
      }
    }

    this.emitStateUpdate('repeatChange');
    return this;
  }

  // ─── Autoplay ─────────────────────────────────────────────────────────────

  public setAutoplay(state: boolean, botUser?: object): this {
    this.isAutoplay = state;
    if (botUser) this.set('Internal_BotUser', botUser);
    this.emitStateUpdate('autoplayChange');
    return this;
  }

  // ─── Internal: Audio Pipeline ─────────────────────────────────────────────

  private createAndPlayStream(url: string, seekSeconds = 0): void {
    this.killFFmpeg();

    const filters = this.filters.toFFmpegArgs();

    this.currentFFmpeg = createFFmpegStream(url, {
      seek: seekSeconds,
      filters: filters.length > 0 ? filters : undefined,
    });

    this.currentResource = createAudioResource(this.currentFFmpeg.stream, {
      inputType: StreamType.Raw,
      inlineVolume: true,
    });

    // Apply current volume
    if (this.currentResource.volume) {
      this.currentResource.volume.setVolume(this.volume / 100);
    }

    this.audioPlayer.play(this.currentResource);
  }

  private async rebuildStream(): Promise<void> {
    if (!this.queue.current || this._destroyed) return;
    const track = this.queue.current as Track;
    if (!track._streamUrl) return;

    const currentPos = this.position / 1000;
    this.createAndPlayStream(track._streamUrl, currentPos);
  }

  private killFFmpeg(): void {
    if (this.currentFFmpeg) {
      this.currentFFmpeg.kill();
      this.currentFFmpeg = null;
    }
    this.currentResource = null;
  }

  // ─── Internal: Audio Player Events ────────────────────────────────────────

  private setupAudioPlayerEvents(): void {
    this.audioPlayer.on('stateChange', (oldState, newState) => {
      // Track ended naturally
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        this.handleTrackEnd();
      }
    });

    this.audioPlayer.on('error', (err) => {
      console.error(
        `[pona-player] Audio error for ${this.guild}:`,
        err.message,
      );
      if (this.queue.current) {
        this.manager.emit('trackError', this, this.queue.current as Track, err);
      }
      // Try next track
      this.handleTrackEnd();
    });
  }

  private handleTrackEnd(): void {
    this.stopPositionTracking();
    this.killFFmpeg();
    this.playing = false;

    const ended = this.queue.current as Track | null;
    if (!ended) return;

    // Emit trackEnd
    this.manager.emit('trackEnd', this, ended, 'FINISHED');

    // ─ Track Repeat ─
    if (this.trackRepeat && ended) {
      ended._streamUrl = undefined; // Force re-fetch
      this.queue.current = ended;
      this.play().catch(() => {});
      return;
    }

    // ─ Queue Repeat ─
    if (this.queueRepeat && ended) {
      this.queue.push(ended);
    }

    // ─ Advance Queue ─
    const next = this.queue.shift();
    if (next) {
      if (this.queue.current) this.queue.previous = this.queue.current;
      this.queue.current = next;
      this.play().catch(() => {});
      return;
    }

    // ─ Queue Empty ─
    this.queue.current = null;
    this.manager.emit('queueEnd', this);
  }

  // ─── Internal: Position Tracking ──────────────────────────────────────────

  private startPositionTracking(): void {
    this.stopPositionTracking();
    this.positionTimer = setInterval(() => {
      if (this.playing && !this.paused) {
        this.position += 1000;
        this.manager.emit('trackPos', this.guild, this.position);
      }
    }, 1000);
  }

  private stopPositionTracking(): void {
    if (this.positionTimer) {
      clearInterval(this.positionTimer);
      this.positionTimer = null;
    }
  }

  // ─── Internal: Reconnection ───────────────────────────────────────────────

  private async tryReconnect(): Promise<void> {
    if (!this.connection || this._destroyed) return;
    try {
      await entersState(
        this.connection,
        VoiceConnectionStatus.Connecting,
        5_000,
      );
    } catch {
      // Can't reconnect — destroy
      if (!this._destroyed) {
        this.destroy();
      }
    }
  }

  // ─── Internal: State Events ───────────────────────────────────────────────

  private emitStateUpdate(type: PlayerStateEventType): void {
    // Create a shallow snapshot for "old" state (best-effort)
    this.manager.emit('playerStateUpdate', this, this, type);
  }
}
