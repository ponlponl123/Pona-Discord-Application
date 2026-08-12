export interface TimestampLyrics {
  seconds: number;
  lyrics: string;
}

export type NonTimestampLyrics = string;

export interface Lyric {
  isTimestamp: boolean;
  lyrics: TimestampLyrics[] | NonTimestampLyrics[];
  source?: string;
  error?: string;
}

export type SearchLyricEngine =
  | 'ytmusic_ts'
  | 'ytmusic_android'
  | 'ytmusic_innertube'
  | 'ytmusic_web'
  | 'pyytmusic'
  | 'boidu'
  | 'lrclib'
  | 'textyl';

export interface CueRange {
  startTimeMilliseconds: string | number;
  endTimeMilliseconds: string | number;
  metadata?: {
    id?: string | number;
  };
}

export interface TimedLyricsDataItem {
  lyricLine: string;
  cueRange: CueRange;
}

export interface TimedLyricsRes {
  timedLyricsData: TimedLyricsDataItem[];
  sourceMessage?: string;
}
