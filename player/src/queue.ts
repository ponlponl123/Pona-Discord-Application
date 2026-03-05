/**
 * pona-player – Queue management
 * Extends Array<Track> with queue operations, compatible with the existing API.
 */

import type { Track, UnresolvedTrack } from './types';
import type { ClientUser, User } from 'discord.js';

type QueueItem = Track | UnresolvedTrack;

export class Queue extends Array<QueueItem> {
  public current: QueueItem | null = null;
  public previous: QueueItem | null = null;

  /** Total duration of the queue including current track (ms) */
  public get duration(): number {
    const cur = this.current?.duration ?? 0;
    return this.reduce((acc, t) => acc + (t.duration ?? 0), cur);
  }

  /** Queue length including current track */
  public get totalSize(): number {
    return this.length + (this.current ? 1 : 0);
  }

  /** Queue length excluding current track */
  public get size(): number {
    return this.length;
  }

  private _onChange?: () => void;

  constructor(onChange?: () => void) {
    super();
    this._onChange = onChange;
  }

  private notify(): void {
    this._onChange?.();
  }

  /**
   * Add track(s) to the queue.
   * If no current track, the first track becomes current.
   * Deduplicates by uniqueId.
   */
  public add(track: QueueItem | QueueItem[], offset?: number): void {
    const addSingle = (t: QueueItem) => {
      if (!this.some((existing) => existing.uniqueId === t.uniqueId)) {
        this.push(t);
      }
    };

    if (!this.current) {
      if (Array.isArray(track)) {
        this.current = track.shift() ?? null;
        for (const t of track) addSingle(t);
      } else {
        this.current = track;
      }
    } else {
      if (typeof offset === 'number') {
        if (offset < 0 || offset > this.length)
          throw new RangeError(`Offset must be 0..${this.length}`);
        const items = Array.isArray(track) ? track : [track];
        for (const t of items) this.splice(offset++, 0, t);
      } else {
        if (Array.isArray(track)) {
          for (const t of track) addSingle(t);
        } else {
          addSingle(track);
        }
      }
    }
    this.notify();
  }

  /** Move track from one index to another (1-based) */
  public move(from: number, to: number): void {
    if (from < 1 || to < 1 || from > this.length || to > this.length)
      throw new RangeError('Invalid start or end values.');
    const [moved] = this.splice(from - 1, 1);
    if (moved) this.splice(to - 1, 0, moved);
    this.notify();
  }

  /** Remove track(s) by position or range (0-based) */
  public remove(start: number, end?: number): QueueItem[] {
    const removed =
      typeof end === 'number'
        ? this.splice(start, end - start)
        : this.splice(start, 1);
    this.notify();
    return removed;
  }

  /** Clear all queued tracks (does NOT clear current) */
  public clear(): void {
    this.splice(0);
    this.notify();
  }

  /** Fisher-Yates shuffle */
  public shuffle(): void {
    for (let i = this.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = this[i]!;
      this[i] = this[j]!;
      this[j] = tmp;
    }
    this.notify();
  }

  /** Fair shuffle preserving per-user order */
  public userBlockShuffle(): void {
    const byUser = new Map<string, QueueItem[]>();
    for (const track of this) {
      const uid = (track.requester as User | ClientUser)?.id ?? 'unknown';
      const list = byUser.get(uid) ?? [];
      list.push(track);
      byUser.set(uid, list);
    }

    const result: QueueItem[] = [];
    let remaining = true;
    while (remaining) {
      remaining = false;
      for (const tracks of byUser.values()) {
        const t = tracks.shift();
        if (t) {
          result.push(t);
          remaining = remaining || tracks.length > 0;
        }
      }
    }

    this.splice(0);
    for (const t of result) this.push(t);
    this.notify();
  }

  /** Round-robin shuffle: each user's tracks are shuffled, then interleaved */
  public roundRobinShuffle(): void {
    const byUser = new Map<string, QueueItem[]>();
    for (const track of this) {
      const uid = (track.requester as User | ClientUser)?.id ?? 'unknown';
      const list = byUser.get(uid) ?? [];
      list.push(track);
      byUser.set(uid, list);
    }

    // Shuffle each user's tracks
    for (const tracks of byUser.values()) {
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const tmp = tracks[i]!;
        tracks[i] = tracks[j]!;
        tracks[j] = tmp;
      }
    }

    // Interleave
    const queues = [...byUser.values()];
    const result: QueueItem[] = [];
    while (queues.some((q) => q.length > 0)) {
      for (const q of queues) {
        const t = q.shift();
        if (t) result.push(t);
      }
    }

    this.splice(0);
    for (const t of result) this.push(t);
    this.notify();
  }
}
