/**
 * Bun test preload/setup file (referenced in bunfig.toml)
 * Runs before every test file to provide global mocks and environment setup.
 */
import { mock } from 'bun:test';
import * as discordJS from 'discord.js';

// ── Environment variables ─────────────────────────────────────────────────────
process.env['NODE_ENV'] ??= 'test';
process.env['LANG'] ??= 'en-US';
process.env['DISCORD_TOKEN'] ??= 'test-token-placeholder';
process.env['DISCORD_CLIENT_ID'] ??= '123456789012345678';
process.env['DISCORD_GUILD_ID'] ??= '123456789012345678';
process.env['HTTP_PORT'] ??= '3000';
process.env['EXPRESS_PORT'] ??= '3000';

// ── Mock heavy side-effect modules ───────────────────────────────────────────
// Replace side-effecting network calls (Client.login, REST.put) while preserving
// all discord.js exports, builders, enums, and types.

mock.module('discord.js', () => ({
  ...discordJS,
  Client: class DummyClient extends (discordJS.Client || class {}) {
    override login(): Promise<string> {
      return Promise.resolve('');
    }
  },
  REST: class DummyREST extends (discordJS.REST || class {}) {
    override put(): Promise<any> {
      return Promise.resolve();
    }
  },
}));

mock.module('discord-hybrid-sharding', () => ({
  getInfo: () => ({ SHARD_LIST: [0], TOTAL_SHARDS: 1 }),
  ClusterClient: class {
    on() {
      return this;
    }
  },
  messageType: {},
}));

mock.module('ioredis', () => ({
  default: class RedisMock {
    on() {
      return this;
    }
    get() {
      return Promise.resolve(null);
    }
    set() {
      return Promise.resolve('OK');
    }
    setex() {
      return Promise.resolve('OK');
    }
    del() {
      return Promise.resolve(1);
    }
  },
}));

mock.module('@prisma/client', () => ({
  PrismaClient: class {
    $connect() {
      return Promise.resolve();
    }
    $disconnect() {
      return Promise.resolve();
    }
  },
}));

mock.module('@/prisma', () => ({
  prisma: {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
  },
}));
