/**
 * Bun test preload/setup file (referenced in bunfig.toml)
 * Runs before every test file to provide global mocks and environment setup.
 */
import { mock } from 'bun:test';

// ── Environment variables ─────────────────────────────────────────────────────
process.env['NODE_ENV'] ??= 'test';
process.env['LANG'] ??= 'en-US';

// ── Mock heavy side-effect modules ───────────────────────────────────────────
// These are modules that connect to external services (Discord, database, Redis,
// Lavalink, …) or trigger large initialisation chains.  We replace them with
// lightweight stubs so pure-logic tests can import any src file without
// unwanted side-effects.

mock.module('discord.js', () => ({
  Client: class {
    user: null = null;
    guilds = { cache: new Map<string, unknown>() };
    on() {
      return this;
    }
    login(): Promise<string> {
      return Promise.resolve('');
    }
  },
  GatewayIntentBits: {},
  Partials: {},
  REST: class {
    setToken() {
      return this;
    }
    put() {
      return Promise.resolve();
    }
  },
  Routes: {
    applicationGuildCommands: () => '',
  },
  EmbedBuilder: class {
    setDescription() {
      return this;
    }
    setFooter() {
      return this;
    }
    setColor() {
      return this;
    }
    data: Record<string, unknown> = {};
  },
  User: class {},
}));

mock.module('discord-hybrid-sharding', () => ({
  getInfo: () => ({ SHARD_LIST: [0], TOTAL_SHARDS: 1 }),
  ClusterClient: class {
    on() {
      return this;
    }
  },
}));

mock.module('@/database', () => ({
  Database: class {
    pool: null = null;
    query(): Promise<unknown[]> {
      return Promise.resolve([]);
    }
    connect(): Promise<void> {
      return Promise.resolve();
    }
  },
}));

// index.ts top-level exports that other utils import (database, pona, lavalink, …)
mock.module('@/index', () => ({
  database: {
    pool: null,
    query: (): Promise<unknown[]> => Promise.resolve([]),
    connect: (): Promise<void> => Promise.resolve(),
  },
  pona: {
    loadGuildSettings: (): Promise<null> => Promise.resolve(null),
    client: { user: null, guilds: { cache: new Map<string, unknown>() } },
  },
  discordClient: {
    client: { user: null, guilds: { cache: new Map<string, unknown>() } },
  },
  lavalink: {
    manager: {
      get: (): undefined => undefined,
      readPlayerState: () => Promise.resolve(null),
      loadPlayerStates: () => Promise.resolve(),
    },
    lavanodes: [],
  },
  redisClient: null,
  debugMode: false,
  config: {},
  toml: {},
  runner: 'bun',
  needCluster: false,
}));

// Also mock the relative path variant used by some utils
mock.module('../../index', () => ({
  database: {
    pool: null,
    query: (): Promise<unknown[]> => Promise.resolve([]),
    connect: (): Promise<void> => Promise.resolve(),
  },
  pona: {
    loadGuildSettings: (): Promise<null> => Promise.resolve(null),
    client: { user: null, guilds: { cache: new Map<string, unknown>() } },
  },
  discordClient: {
    client: { user: null, guilds: { cache: new Map<string, unknown>() } },
  },
  lavalink: {
    manager: {
      get: (): undefined => undefined,
      readPlayerState: () => Promise.resolve(null),
      loadPlayerStates: () => Promise.resolve(),
    },
    lavanodes: [],
  },
  redisClient: null,
  debugMode: false,
  config: {},
  toml: {},
  runner: 'bun',
  needCluster: false,
}));

mock.module('../index', () => ({
  database: {
    pool: null,
    query: (): Promise<unknown[]> => Promise.resolve([]),
    connect: (): Promise<void> => Promise.resolve(),
  },
  pona: {
    loadGuildSettings: (): Promise<null> => Promise.resolve(null),
    client: { user: null, guilds: { cache: new Map<string, unknown>() } },
  },
  discordClient: {
    client: { user: null, guilds: { cache: new Map<string, unknown>() } },
  },
  lavalink: {
    manager: {
      get: (): undefined => undefined,
      readPlayerState: () => Promise.resolve(null),
      loadPlayerStates: () => Promise.resolve(),
    },
    lavanodes: [],
  },
  redisClient: null,
  debugMode: false,
  config: {},
  toml: {},
  runner: 'bun',
  needCluster: false,
}));

mock.module('xmlhttprequest-ts', () => ({
  XMLHttpRequest: class {
    timeout = 0;
    readyState = 0;
    onreadystatechange: (() => void) | null = null;
    open() {}
    send() {
      return Promise.resolve();
    }
  },
}));

mock.module('axios', () => {
  const axiosMock = {
    get: () => Promise.resolve({ status: 200, data: {} }),
    post: () => Promise.resolve({ status: 200, data: {} }),
    patch: () => Promise.resolve({ status: 200, data: {} }),
    delete: () => Promise.resolve({ status: 200, data: {} }),
  };
  return { default: axiosMock, ...axiosMock };
});
