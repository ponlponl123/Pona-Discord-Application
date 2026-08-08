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
  return originalAuthor.replace(/\s*-\s*Topic\s*$/i, '').trim();
}

export function parseYouTubeVideoTitle(title: string): string {
  title = title.replace(/\bTopic\s*-\s*/i, '').trim();

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

export function parseYouTubeTitle(
  title: string,
  originalAuthor: string,
): { cleanTitle: string; cleanAuthor: string } {
  let cleanAuthor = parseYouTubeAuthorTitle(originalAuthor);

  // Check if the title contains Thai characters
  const isThai = /[\u0E00-\u0E7F]/.test(title);

  if (isThai) {
    // If Thai, return the raw title and cleaned author
    return { cleanTitle: title, cleanAuthor };
  }

  title = title.replace(/\bTopic\s*-\s*/i, '').trim();

  const allBlockedWords = [...blockedWords, ...noiseWords]
    .map(escapeRegExp)
    .join('|');
  if (allBlockedWords) {
    title = title
      .replace(new RegExp(`\\b(${allBlockedWords})\\b`, 'gi'), '')
      .trim();
  }

  title = title.replace(/(【covered by.*?】|covered by .*)/i, '').trim();

  title = title
    .replace(/@(\w+)/g, '$1')
    .replace(/\s*\([\s\)]*\)|\s*\[[\s\]]*\]|\s*\{[\s\}]*\}/g, '')
    .replace(/^[^\w\d]+|[^\w\d]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  title = balanceBrackets(title);

  const cleanedTitle = title.replace(/#\w+/g, '').trim();

  const parts = cleanedTitle.split(/\s*-\s*/);
  if (parts.length > 1) {
    const [songTitle] = parts.map((part) => part.trim());
    return { cleanAuthor, cleanTitle: songTitle };
  }

  return { cleanAuthor, cleanTitle: cleanedTitle };
}

export function balanceBrackets(str: string): string {
  const stack: string[] = [];
  const openBrackets = '([{';
  const closeBrackets = ')]}';
  let result = '';

  for (const char of str) {
    if (openBrackets.includes(char)) {
      stack.push(char);
      result += char;
    } else if (closeBrackets.includes(char)) {
      if (
        stack.length > 0 &&
        openBrackets.indexOf(stack[stack.length - 1]) ===
          closeBrackets.indexOf(char)
      ) {
        stack.pop();
        result += char;
      }
    } else {
      result += char;
    }
  }

  while (stack.length > 0) {
    const lastOpen = stack.pop()!;
    result += closeBrackets[openBrackets.indexOf(lastOpen)];
  }
  return result;
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseLyrics(input: string): Lyric {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  const timestampRegex = /^\[(\d+):(\d+\.\d+)\]\s*(.*)$/;
  const parsedLyrics: TimestampLyrics[] = [];
  const nonTimestampLyrics: NonTimestampLyrics[] = [];

  for (const line of lines) {
    const match = line.match(timestampRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      parsedLyrics.push({
        seconds: minutes * 60 + seconds,
        lyrics: match[3],
      });
    } else {
      nonTimestampLyrics.push(line);
    }
  }

  return {
    isTimestamp: parsedLyrics.length > 0,
    lyrics: parsedLyrics.length > 0 ? parsedLyrics : nonTimestampLyrics,
  };
}

export function combineArtistName(artists: ArtistBasic[]): string {
  if (!artists) return '';
  return artists
    .filter((a) => a.name)
    .map((a) => a.name)
    .join(' & ');
}
