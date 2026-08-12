import { blockedWords } from '@/config/blockedWords';
import type { ArtistBasic } from '@/interfaces/lavaUtils';
import type {
  Lyric,
  NonTimestampLyrics,
  TimestampLyrics,
} from '@/interfaces/player';

export const noiseWords = [
  'official video',
  'official music video',
  'official mv',
  'official musicvideo',
  'official',
  'lyrics',
  'audio',
  'hd',
  '4k',
  'remastered',
  'explicit',
  'clean',
  'full song',
  'video edit',
  'cover',
  'live',
  'mv',
  'music',
  'musicvideo',
  'cut version',
];

export function parseYouTubeAuthorTitle(originalAuthor: string): string {
  if (!originalAuthor) return '';
  let author = originalAuthor.trim();
  author = author.replace(/\s*-\s*(Topic|Release|Single|Album|Various Artists|VEVO|Channel)\s*$/i, '').trim();
  return author;
}

export function parseYouTubeVideoTitle(title: string): string {
  title = title.replace(/\b(Topic|Release)\s*-\s*/i, '').trim();

  const allBlockedWords = [...blockedWords, ...noiseWords]
    .map(escapeRegExp)
    .join('|');
  if (allBlockedWords) {
    title = title
      .replace(new RegExp(`\\b(${allBlockedWords})\\b`, 'gi'), '')
      .trim();
  }

  title = title.replace(/\s*[\(\[\{].*?[\)\]\}]\s*/g, ' ').trim();

  title = title
    .replace(/\s*-\s*/g, ' - ')
    .replace(/^[^\w\dก-๙]+|[^\w\dก-๙]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  title = balanceBrackets(title);

  return title;
}

function splitArtistTitle(
  title: string,
  existingAuthor: string,
): { cleanTitle: string; cleanAuthor: string } {
  const parts = title.split(/\s*-\s*/);
  if (parts.length > 1) {
    const p0 = parts[0].trim();
    const p1 = parts.slice(1).join(' - ').trim();

    if (existingAuthor && existingAuthor.toLowerCase() === p1.toLowerCase()) {
      return { cleanAuthor: p1, cleanTitle: p0 };
    }
    if (existingAuthor && existingAuthor.toLowerCase() === p0.toLowerCase()) {
      return { cleanAuthor: p0, cleanTitle: p1 };
    }
    return { cleanAuthor: p0, cleanTitle: p1 };
  }

  return { cleanAuthor: existingAuthor, cleanTitle: title };
}

export function parseYouTubeTitle(
  title: string,
  originalAuthor: string,
): { cleanTitle: string; cleanAuthor: string } {
  const cleanAuthor = parseYouTubeAuthorTitle(originalAuthor || '');

  const isThai = /[\u0E00-\u0E7F]/.test(title);

  if (isThai) {
    const parts = title.split(/\s*-\s*/);
    if (parts.length > 1) {
      return splitArtistTitle(title, cleanAuthor);
    }
    return { cleanTitle: title, cleanAuthor };
  }

  let cleanedTitle = (title || '').replace(/\b(Topic|Release)\s*-\s*/i, '').trim();

  const allBlockedWords = [...blockedWords, ...noiseWords]
    .map(escapeRegExp)
    .join('|');
  if (allBlockedWords) {
    cleanedTitle = cleanedTitle
      .replace(new RegExp(`\\b(${allBlockedWords})\\b`, 'gi'), '')
      .trim();
  }

  cleanedTitle = cleanedTitle.replace(/(【covered by.*?】|covered by .*)/i, '').trim();

  cleanedTitle = cleanedTitle
    .replace(/@(\w+)/g, '$1')
    .replace(/\s*\([\s\)]*\)|\s*\[[\s\]]*\]|\s*\{[\s\}]*\}/g, '')
    .replace(/^[^\w\dก-๙]+|[^\w\dก-๙]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/#\w+/g, '')
    .trim();

  cleanedTitle = balanceBrackets(cleanedTitle);

  return splitArtistTitle(cleanedTitle, cleanAuthor);
}

export function balanceBrackets(str: string): string {
  const stack: string[] = [];
  const openBrackets = '([{';
  const closeBrackets = ')]}';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (openBrackets.includes(char)) {
      stack.push(char);
    } else if (closeBrackets.includes(char)) {
      if (stack.length > 0) {
        stack.pop();
      }
    }
  }

  let result = str;
  while (stack.length > 0) {
    const lastOpen = stack.pop();
    if (lastOpen === '(') result += ')';
    if (lastOpen === '[') result += ']';
    if (lastOpen === '{') result += '}';
  }

  return result;
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseLyrics(rawLyrics: string, source?: string): Lyric {
  if (!rawLyrics || typeof rawLyrics !== 'string') {
    return { isTimestamp: false, lyrics: [], source };
  }

  const lines = rawLyrics
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const timestampRegex = /^\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]\s*(.*)$/;
  const timestampLyrics: TimestampLyrics[] = [];
  const nonTimestampLyrics: NonTimestampLyrics[] = [];

  let isTimestamp = false;

  lines.forEach((line) => {
    const match = line.match(timestampRegex);
    if (match) {
      isTimestamp = true;
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3]
        ? parseInt(match[3].padEnd(3, '0'), 10)
        : 0;

      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
      const text = match[4].trim();

      if (text) {
        timestampLyrics.push({
          seconds: totalSeconds,
          lyrics: text,
        });
      }
    } else {
      nonTimestampLyrics.push(line);
    }
  });

  if (isTimestamp && timestampLyrics.length > 0) {
    return {
      isTimestamp: true,
      lyrics: timestampLyrics,
      source,
    };
  }

  return {
    isTimestamp: false,
    lyrics: nonTimestampLyrics,
    source,
  };
}

export function combineArtistName(artists: ArtistBasic[]): string {
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return '';
  }
  return artists
    .map((artist) => parseYouTubeAuthorTitle(artist.name))
    .filter((name) => name.length > 0)
    .join(' & ');
}
