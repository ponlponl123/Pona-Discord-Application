import Pona from './client';
import eventManager from './events';
import { Database } from './database';
import LavalinkServer from './lavalink';
import { prefix as consolePrefix, type as consoleType } from '@config/console';
import { config as redisConf } from '@config/redis';
import { config as discordConf } from '@config/discord';
import { config as expressConf } from '@config/express';
import { config as databaseConf } from '@config/database';
import { apiServer as createAPIServer } from '@server/main';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { getInfo } from 'discord-hybrid-sharding';
import { PonaYTMusicAPI } from './ytmusic';
import tomlConfig from './config/toml';
import RedisClient from './redis';
import { prisma } from './prisma';

export const needCluster = process.env['CLUSTER'] === 'true';
let shardList: number[] | undefined;
let shardCount = 1;

if (needCluster) {
  try {
    const info = getInfo();
    shardList = info.SHARD_LIST;
    shardCount = info.TOTAL_SHARDS;
  } catch {
    console.info(
      consoleType.info,
      consolePrefix.shard,
      'Cluster info not available.',
    );
  }
}

const client = new Client({
  shards: shardList,
  shardCount,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.GuildMember],
});

export const debugMode =
  process.env['DEBUG_MODE'] === 'true' ||
  process.env['NODE_ENV'] === 'development';
export const config = discordConf;
export const toml = tomlConfig;
export const runner = process.env['RUNNER'] || 'default';
export const pona = new Pona(client, needCluster);
export const discordClient = pona;
export const database = new Database({
  host: databaseConf.host || 'localhost',
  port: databaseConf.port || 3306,
  user: databaseConf.user || 'localhost',
  password: databaseConf.password || 'secret',
  database: databaseConf.database || 'my_db',
});
export const redisClient = redisConf.REDIS_ENABLED
  ? new RedisClient()
  : undefined;
export const lavalink = new LavalinkServer(
  discordClient.client.user?.id || config.DISCORD_CLIENT_ID,
);
export const apiServer = new createAPIServer(expressConf.EXPRESS_PORT);
export const ponaEventManager = new eventManager();
export const ytmusic = new PonaYTMusicAPI();

async function shutdown() {
  try {
    await redisClient?.redis.quit();
    console.log(
      consoleType.info,
      consolePrefix.redis,
      'Redis connection closed.',
    );
  } catch (err) {
    console.error(
      consoleType.error,
      consolePrefix.redis,
      'Error closing Redis:',
      err,
    );
  }

  try {
    await prisma.$disconnect();
    console.log(
      consoleType.info,
      consolePrefix.database,
      'Database connection closed.',
    );
  } catch (err) {
    console.error(
      consoleType.error,
      consolePrefix.database,
      'Error closing database:',
      err,
    );
  }

  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
