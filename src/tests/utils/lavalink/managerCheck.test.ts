import { describe, it, expect } from 'bun:test';
import managerCheck from '@/utils/lavalink/managerCheck';

const validSend = () => {};

describe('managerCheck – valid options', () => {
  it('does not throw with minimum valid options (send only)', () => {
    expect(() => managerCheck({ send: validSend })).not.toThrow();
  });

  it('accepts full valid options', () => {
    expect(() =>
      managerCheck({
        send: validSend,
        autoPlay: true,
        clientId: '123456789',
        clientName: 'Pona',
        defaultSearchPlatform: 'youtube',
        nodes: [{ host: 'localhost', port: 2333, password: 'secret' }],
        plugins: [],
        trackPartial: ['title', 'author'],
        usePriority: false,
        useNode: 'leastLoad',
        replaceYouTubeCredentials: false,
      }),
    ).not.toThrow();
  });
});

describe('managerCheck – invalid options', () => {
  it('throws TypeError when options is missing', () => {
    expect(() => managerCheck(null as any)).toThrow(TypeError);
  });

  it('throws TypeError when send is missing', () => {
    expect(() => managerCheck({ send: undefined as any })).toThrow(TypeError);
  });

  it('throws TypeError when autoPlay is not a boolean', () => {
    expect(() =>
      managerCheck({ send: validSend, autoPlay: 'yes' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when clientId contains non-digits', () => {
    expect(() => managerCheck({ send: validSend, clientId: 'abc' })).toThrow(
      TypeError,
    );
  });

  it('throws TypeError when clientName is not a string', () => {
    expect(() =>
      managerCheck({ send: validSend, clientName: 123 as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when nodes is not an array', () => {
    expect(() =>
      managerCheck({ send: validSend, nodes: 'bad' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when plugins is not an array', () => {
    expect(() => managerCheck({ send: validSend, plugins: {} as any })).toThrow(
      TypeError,
    );
  });

  it('throws TypeError when trackPartial is not an array', () => {
    expect(() =>
      managerCheck({ send: validSend, trackPartial: 'bad' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when usePriority is not a boolean', () => {
    expect(() =>
      managerCheck({ send: validSend, usePriority: 1 as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when useNode has invalid value', () => {
    expect(() =>
      managerCheck({ send: validSend, useNode: 'random' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when useNode is not a string', () => {
    expect(() => managerCheck({ send: validSend, useNode: 42 as any })).toThrow(
      TypeError,
    );
  });

  it('throws TypeError when usePriority=true but node is missing priority', () => {
    expect(() =>
      managerCheck({
        send: validSend,
        usePriority: true,
        nodes: [{ host: 'localhost' }], // no priority
      }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when replaceYouTubeCredentials is not boolean', () => {
    expect(() =>
      managerCheck({
        send: validSend,
        replaceYouTubeCredentials: 'yes' as any,
      }),
    ).toThrow(TypeError);
  });
});
