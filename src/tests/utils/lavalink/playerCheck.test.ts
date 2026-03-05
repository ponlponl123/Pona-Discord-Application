import { describe, it, expect } from 'bun:test';
import playerCheck from '@/utils/lavalink/playerCheck';

describe('playerCheck – valid options', () => {
  it('accepts minimum required options', () => {
    expect(() =>
      playerCheck({
        guild: '123456789',
        textChannel: '987654321',
        lastActive: Date.now(),
      }),
    ).not.toThrow();
  });

  it('accepts full valid options', () => {
    expect(() =>
      playerCheck({
        guild: '111222333',
        textChannel: '444555666',
        voiceChannel: '777888999',
        node: 'main-node',
        volume: 80,
        selfMute: false,
        selfDeafen: true,
        lastActive: Date.now(),
      }),
    ).not.toThrow();
  });
});

describe('playerCheck – invalid options', () => {
  it('throws TypeError when options is null', () => {
    expect(() => playerCheck(null as any)).toThrow(TypeError);
  });

  it('throws TypeError when guild is not a digit string', () => {
    expect(() =>
      playerCheck({ guild: 'abc', textChannel: '123', lastActive: 0 }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when guild is an empty string', () => {
    expect(() =>
      playerCheck({ guild: '', textChannel: '123', lastActive: 0 }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when node is not a string', () => {
    expect(() =>
      playerCheck({
        guild: '123',
        textChannel: '456',
        node: 99 as any,
        lastActive: 0,
      }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when selfDeafen is not a boolean', () => {
    expect(() =>
      playerCheck({
        guild: '123',
        textChannel: '456',
        selfDeafen: 'yes' as any,
        lastActive: 0,
      }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when selfMute is not a boolean', () => {
    expect(() =>
      playerCheck({
        guild: '123',
        textChannel: '456',
        selfMute: 1 as any,
        lastActive: 0,
      }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when textChannel is not a digit string', () => {
    expect(() =>
      playerCheck({ guild: '123', textChannel: 'notanumber', lastActive: 0 }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when voiceChannel is not a digit string', () => {
    expect(() =>
      playerCheck({
        guild: '123',
        textChannel: '456',
        voiceChannel: 'bad',
        lastActive: 0,
      }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when volume is not a number', () => {
    expect(() =>
      playerCheck({
        guild: '123',
        textChannel: '456',
        volume: '100' as any,
        lastActive: 0,
      }),
    ).toThrow(TypeError);
  });
});
