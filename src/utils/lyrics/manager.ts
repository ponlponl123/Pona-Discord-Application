import type { Lyric, SearchLyricEngine } from './types';
import { getCachedLyrics, setCachedLyrics } from './cache';
import {
  fetchYtmusicTsApiLyrics,
  fetchYtmusicAndroidLyrics,
  fetchPyytmusicLyrics,
  fetchLrclibLyrics,
  fetchBoiduLyrics,
  fetchTextylLyrics,
  fetchYtmusicInnertubeLyrics,
  fetchYtmusicWebLyrics,
} from './engines';

export async function fetchLyrics(
  engine: 'ytmusic_ts' | 'ytmusic_web' | 'ytmusic_android' | 'ytmusic_innertube',
  v: string,
  author?: string,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: 'pyytmusic',
  v: string,
  userId?: string,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: 'boidu' | 'lrclib',
  title: string,
  author: string,
  duration?: number,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: 'textyl',
  title: string,
  author: string,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: SearchLyricEngine,
  arg1: string,
  arg2?: string,
  arg3?: number,
): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: SearchLyricEngine,
  arg1: string,
  arg2?: string,
  arg3?: number,
): Promise<false | Lyric> {
  switch (engine) {
    case 'ytmusic_ts':
      return fetchYtmusicTsApiLyrics(arg1);
    case 'pyytmusic':
      return fetchPyytmusicLyrics(arg1, arg2);
    case 'ytmusic_android':
      return fetchYtmusicAndroidLyrics(arg1);
    case 'ytmusic_innertube':
      return fetchYtmusicInnertubeLyrics(arg1);
    case 'ytmusic_web':
      return fetchYtmusicWebLyrics(arg1, arg2);
    case 'boidu':
      return fetchBoiduLyrics(arg1, arg2 || '');
    case 'lrclib':
      return fetchLrclibLyrics(arg1, arg2 || '', arg3);
    case 'textyl':
      return fetchTextylLyrics(arg1, arg2 || '');
    default:
      return false;
  }
}

export async function getDynamicLyrics(
  videoId?: string,
  title?: string,
  author?: string,
  duration?: number,
  userId?: string,
): Promise<Lyric> {
  let fallbackPlainLyrics: Lyric | false = false;

  if (videoId) {
    const cached = await getCachedLyrics(videoId);
    if (cached) return cached;
  }

  const stage1Promises: Promise<Lyric | false>[] = [];

  if (videoId) {
    stage1Promises.push(fetchYtmusicTsApiLyrics(videoId).catch(() => false));
    stage1Promises.push(fetchYtmusicAndroidLyrics(videoId).catch(() => false));
    stage1Promises.push(fetchPyytmusicLyrics(videoId, userId).catch(() => false));
  }

  if (title && author) {
    stage1Promises.push(fetchLrclibLyrics(title, author, duration).catch(() => false));
  }

  if (stage1Promises.length > 0) {
    const results = await Promise.all(stage1Promises);
    for (const res of results) {
      if (res) {
        if (res.isTimestamp) {
          if (videoId) {
            setCachedLyrics(videoId, res).catch(() => { });
          }
          return res;
        }
        if (!fallbackPlainLyrics) {
          fallbackPlainLyrics = res;
        }
      }
    }
  }

  if (!fallbackPlainLyrics) {
    const stage2Promises: Promise<Lyric | false>[] = [];

    if (videoId) {
      stage2Promises.push(fetchYtmusicInnertubeLyrics(videoId).catch(() => false));
    }

    if (title && author) {
      stage2Promises.push(fetchBoiduLyrics(title, author).catch(() => false));
      stage2Promises.push(fetchTextylLyrics(title, author).catch(() => false));
    }

    if (title) {
      stage2Promises.push(fetchYtmusicWebLyrics(title, author).catch(() => false));
    }

    if (stage2Promises.length > 0) {
      const settledResults = await Promise.allSettled(stage2Promises);
      for (const result of settledResults) {
        if (result.status === 'fulfilled' && result.value) {
          fallbackPlainLyrics = result.value;
          break;
        }
      }
    }
  }

  if (fallbackPlainLyrics) {
    if (videoId) {
      setCachedLyrics(videoId, fallbackPlainLyrics).catch(() => { });
    }
    return fallbackPlainLyrics;
  }

  const notFoundLyrics: Lyric = { isTimestamp: false, lyrics: [], error: 'Lyrics not found' };
  if (videoId) {
    setCachedLyrics(videoId, notFoundLyrics).catch(() => { });
  }

  return notFoundLyrics;
}
