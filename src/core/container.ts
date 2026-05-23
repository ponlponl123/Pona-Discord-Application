import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import Pona from '@/client';
import { Database } from '@/database';
import RedisClient from '@/redis';
import LavalinkServer from '@/lavalink';
import { apiServer as ApiServer } from '@/server/main';
import eventManager from '@/events';
import { PonaYTMusicAPI } from '@/ytmusic';
import { config as databaseConf } from '@config/database';
import { config as redisConf } from '@config/redis';
import { config as discordConf } from '@config/discord';
import { config as expressConf } from '@config/express';
import logger from './logger';
import { prefix } from '@config/console';

export class Container {
  private static instance: Container;

  public pona!: Pona;
  public database!: Database;
  public redis?: RedisClient;
  public lavalink!: LavalinkServer;
  public apiServer!: ApiServer;
  public eventManager!: eventManager;
  public ytmusic!: PonaYTMusicAPI;

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public async initialize() {
    logger.info(prefix.system, 'Initializing Pona Backend Services...');

    // 1. Database
    this.database = new Database({
      host: databaseConf.host || 'localhost',
      port: databaseConf.port || 3306,
      user: databaseConf.user || 'localhost',
      password: databaseConf.password || 'secret',
      database: databaseConf.database || 'my_db',
    });

    // 2. Redis
    if (redisConf.REDIS_ENABLED) {
      this.redis = new RedisClient();
    }

    // 3. Discord Client
    const needCluster = process.env['CLUSTER'] === 'true';
    let shardList: number[] | undefined;
    let shardCount = 1;

    if (needCluster) {
      try {
        const info = getInfo();
        shardList = info.SHARD_LIST;
        shardCount = info.TOTAL_SHARDS;
      } catch {
        logger.warn(prefix.shard, 'Cluster info not available.');
      }
    }

    const discordClient = new Client({
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

    this.pona = new Pona(discordClient, needCluster);

    // 4. Lavalink
    this.lavalink = new LavalinkServer(discordConf.DISCORD_CLIENT_ID, this.pona);

    // 5. YTMusic
    this.ytmusic = new PonaYTMusicAPI();

    // 6. Event Manager
    this.eventManager = new eventManager(this.pona, this.lavalink, this.apiServer);

    // 7. API Server
    this.apiServer = new ApiServer(expressConf.EXPRESS_PORT);

    logger.info(prefix.system, 'All services initialized successfully.');
  }
}

export const container = Container.getInstance();
