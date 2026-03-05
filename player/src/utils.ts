/**
 * pona-player – Utility helpers
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { Readable } from 'node:stream';
import type { StreamOptions } from './types';

// ─── ID Generation ────────────────────────────────────────────────────────────

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomId(len = 24): string {
  let id = '';
  for (let i = 0; i < len; i++) {
    id += CHARS[(Math.random() * CHARS.length) | 0];
  }
  return id;
}

// ─── Duration Parsing ─────────────────────────────────────────────────────────

/** Parse "3:33" or "1:02:15" to milliseconds */
export function parseDuration(text: string): number {
  const parts = text.split(':').map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    seconds = (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
  } else if (parts.length === 2) {
    seconds = (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  } else {
    seconds = parts[0] ?? 0;
  }
  return seconds * 1000;
}

// ─── YouTube URL Parsing ──────────────────────────────────────────────────────

const YT_VIDEO_RE =
  /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|v\/)|youtu\.be\/|music\.youtube\.com\/watch\?.*v=)([\w-]{11})/;
const YT_PLAYLIST_RE = /[?&]list=([\w-]+)/;

export function extractVideoId(url: string): string | null {
  return url.match(YT_VIDEO_RE)?.[1] ?? null;
}

export function extractPlaylistId(url: string): string | null {
  return url.match(YT_PLAYLIST_RE)?.[1] ?? null;
}

export function isUrl(str: string): boolean {
  return /^https?:\/\//i.test(str);
}

// ─── FFmpeg ───────────────────────────────────────────────────────────────────

let _ffmpegPath: string | null = null;

export function resolveFFmpegPath(): string {
  if (_ffmpegPath) return _ffmpegPath;

  // Try ffmpeg-static package
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _ffmpegPath = require('ffmpeg-static') as string;
    if (_ffmpegPath) return _ffmpegPath;
  } catch {
    // not installed
  }

  // Fallback to system ffmpeg
  _ffmpegPath = 'ffmpeg';
  return _ffmpegPath;
}

export interface FFmpegProcess {
  process: ChildProcess;
  stream: Readable;
  kill(): void;
}

/**
 * Spawn an FFmpeg process that outputs raw signed 16-bit LE PCM at 48kHz stereo.
 * This format is compatible with @discordjs/voice StreamType.Raw + inlineVolume.
 */
export function createFFmpegStream(
  inputUrl: string,
  options: StreamOptions = {},
): FFmpegProcess {
  const ffmpeg = resolveFFmpegPath();
  const args: string[] = [];

  // Network resilience
  args.push(
    '-reconnect',
    '1',
    '-reconnect_streamed',
    '1',
    '-reconnect_delay_max',
    '5',
  );

  // Custom headers for YouTube
  if (
    inputUrl.includes('googlevideo.com') ||
    inputUrl.includes('youtube.com')
  ) {
    args.push(
      '-headers',
      'User-Agent: com.google.ios.youtube/19.45.4 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)\r\n',
    );
  }

  // Seek
  if (options.seek && options.seek > 0) {
    args.push('-ss', String(options.seek));
  }

  // Input
  args.push('-i', inputUrl);

  // Audio filters
  const filters = options.filters?.filter(Boolean) ?? [];
  if (filters.length > 0) {
    args.push('-af', filters.join(','));
  }

  // Output: raw s16le PCM, 48kHz, stereo
  args.push(
    '-analyzeduration',
    '0',
    '-loglevel',
    '0',
    '-f',
    's16le',
    '-ar',
    '48000',
    '-ac',
    '2',
    'pipe:1',
  );

  const proc = spawn(ffmpeg, args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });

  const stream = proc.stdout as Readable;

  // Forward errors
  proc.stderr?.on('data', () => {
    // Silently consume stderr to prevent backpressure issues
  });

  proc.on('error', (err) => {
    stream.destroy(err);
  });

  return {
    process: proc,
    stream,
    kill() {
      if (!proc.killed) proc.kill('SIGKILL');
    },
  };
}

// ─── Title Parsing ────────────────────────────────────────────────────────────

const CLEAN_PATTERNS = [
  /\(official\s*(music\s*)?video\)/gi,
  /\[official\s*(music\s*)?video\]/gi,
  /\(official\s*audio\)/gi,
  /\[official\s*audio\]/gi,
  /\(lyrics?\)/gi,
  /\[lyrics?\]/gi,
  /\(visualizer\)/gi,
  /\[visualizer\]/gi,
  /\(audio\)/gi,
  /\[audio\]/gi,
  /\(hd\)/gi,
  /\[hd\]/gi,
  /\bMV\b/g,
  /【[^】]*】/g,
  /\s{2,}/g,
];

export function cleanTitle(title: string): string {
  let clean = title;
  for (const pattern of CLEAN_PATTERNS) {
    clean = clean.replace(pattern, ' ');
  }
  return clean.trim();
}

export function parseTitle(title: string, fallbackAuthor: string) {
  const dashMatch = title.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) {
    return {
      cleanAuthor: (dashMatch[1] ?? fallbackAuthor)
        .replace(/\s*-\s*Topic$/, '')
        .trim(),
      cleanTitle: cleanTitle(dashMatch[2] ?? title),
    };
  }
  return {
    cleanAuthor: fallbackAuthor.replace(/\s*-\s*Topic$/, '').trim(),
    cleanTitle: cleanTitle(title),
  };
}
