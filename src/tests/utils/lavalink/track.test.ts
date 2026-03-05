import { describe, it, expect } from 'bun:test';
import { createTrackData } from '@/utils/lavalink/track';

const baseSong = {
  track: 'encoded_track_string',
  timestamp: 0,
  uniqueId: 'unique-123',
  identifier: 'dQw4w9WgXcQ',
  isSeekable: true,
  author: 'Rick Astley',
  artist: null as null,
  position: 0,
  cleanAuthor: 'Rick Astley',
  duration: 213000,
  isrc: 'GBARL9300135',
  isStream: false,
  title: 'Never Gonna Give You Up',
  cleanTitle: 'Never Gonna Give You Up',
  uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  artworkUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  videoInfo: null as null,
  accentColor: '#FF5733',
  lyrics: null as null,
  sourceName: 'youtube' as const,
  pluginInfo: { someKey: 'someValue' },
};

describe('createTrackData', () => {
  it('returns an object with encoded, info and pluginInfo', () => {
    const track = createTrackData(baseSong);
    expect(track).toHaveProperty('encoded');
    expect(track).toHaveProperty('info');
    expect(track).toHaveProperty('pluginInfo');
  });

  it('maps encoded from song.track', () => {
    const track = createTrackData(baseSong);
    expect(track.encoded).toBe('encoded_track_string');
  });

  it('maps info.title correctly', () => {
    const track = createTrackData(baseSong);
    expect(track.info.title).toBe('Never Gonna Give You Up');
  });

  it('maps info.length from song.duration', () => {
    const track = createTrackData(baseSong);
    expect(track.info.length).toBe(213000);
  });

  it('maps info.author correctly', () => {
    const track = createTrackData(baseSong);
    expect(track.info.author).toBe('Rick Astley');
  });

  it('maps info.identifier correctly', () => {
    const track = createTrackData(baseSong);
    expect(track.info.identifier).toBe('dQw4w9WgXcQ');
  });

  it('maps pluginInfo as provided', () => {
    const track = createTrackData(baseSong);
    expect(track.pluginInfo).toEqual({ someKey: 'someValue' });
  });

  it('maps info.isSeekable', () => {
    const track = createTrackData(baseSong);
    expect(track.info.isSeekable).toBe(true);
  });

  it('maps info.isStream', () => {
    const track = createTrackData(baseSong);
    expect(track.info.isStream).toBe(false);
  });

  it('maps info.uri', () => {
    const track = createTrackData(baseSong);
    expect(track.info.uri).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  it('maps info.sourceName', () => {
    const track = createTrackData(baseSong);
    expect(track.info.sourceName).toBe('youtube');
  });
});
