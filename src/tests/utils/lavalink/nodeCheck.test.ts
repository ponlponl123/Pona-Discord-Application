import { describe, it, expect } from 'bun:test';
import nodeCheck from '@/utils/lavalink/nodeCheck';

describe('nodeCheck – valid options', () => {
  it('accepts minimum valid options', () => {
    expect(() => nodeCheck({ host: 'localhost' })).not.toThrow();
  });

  it('accepts full valid options', () => {
    expect(() =>
      nodeCheck({
        host: 'lavalink.example.com',
        port: 2333,
        password: 'youshallnotpass',
        secure: false,
        identifier: 'main-node',
        retryAmount: 5,
        retryDelay: 3000,
        resumeStatus: true,
        resumeTimeout: 60,
        requestTimeout: 10000,
        priority: 1,
      }),
    ).not.toThrow();
  });
});

describe('nodeCheck – invalid options', () => {
  it('throws TypeError when options is null', () => {
    expect(() => nodeCheck(null as any)).toThrow(TypeError);
  });

  it('throws TypeError when host is missing', () => {
    expect(() => nodeCheck({ host: '' })).toThrow(TypeError);
  });

  it('throws TypeError when host is not a string', () => {
    expect(() => nodeCheck({ host: 123 as any })).toThrow(TypeError);
  });

  it('throws TypeError when identifier is not a string', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', identifier: 99 as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when password is not a string', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', password: 123 as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when port is not a number', () => {
    expect(() => nodeCheck({ host: 'localhost', port: '2333' as any })).toThrow(
      TypeError,
    );
  });

  it('throws TypeError when requestTimeout is not a number', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', requestTimeout: '5000' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when resumeStatus is not a boolean', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', resumeStatus: 1 as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when resumeTimeout is not a number', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', resumeTimeout: 'yes' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when retryAmount is not a number', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', retryAmount: true as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when retryDelay is not a number', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', retryDelay: {} as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when secure is not a boolean', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', secure: 'yes' as any }),
    ).toThrow(TypeError);
  });

  it('throws TypeError when priority is not a number', () => {
    expect(() =>
      nodeCheck({ host: 'localhost', priority: 'high' as any }),
    ).toThrow(TypeError);
  });
});
