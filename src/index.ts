import Pona from './client'
import eventManager from './events'
import { Database } from './database'
import LavalinkServer from './lavalink'
import { prefix } from '@config/console'
import { config as redisConf } from '@config/redis'
import { config as discordConf } from '@config/discord'
import { config as expressConf } from '@config/express'
import { config as databaseConf } from '@config/database'
import { apiServer as createAPIServer } from '@server/main'
import { PonaDeliver as createBunAPIServer } from '@server/main-bun'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { getInfo } from 'discord-hybrid-sharding'
import { PonaYTMusicAPI } from './ytmusic'
import RedisClient from './redis'

export const needCluster = process.env["CLUSTER"] === 'true'
var shardList: number[] | undefined = undefined;
var shardCount = 1;

if (needCluster) {
    try {
        const info = getInfo();
        shardList = info.SHARD_LIST;
        shardCount = info.TOTAL_SHARDS;
    } catch (e) {
        console.info(prefix.shard, 'Cluster info not available.');
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
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.GuildMember
    ]
});

export const config = discordConf;
export const runner = process.env["RUNNER"] || 'default';
export const pona = new Pona(client, needCluster);
export const discordClient = pona;
export const database = new Database({
    host: databaseConf.host || 'localhost',
    port: databaseConf.port || 3306,
    user: databaseConf.user || 'localhost',
    password: databaseConf.password || 'secret',
    database: databaseConf.database || 'my_db',
});
export const redisClient = redisConf.REDIS_ENABLED ? new RedisClient(
    (redisConf.pub.host || redisConf.sub.host || 'localhost'),
    (redisConf.pub.port || redisConf.sub.port || 6379),
    redisConf.pub.auth?.password || redisConf.sub.auth?.password,
    {
        replica: {
            enabled: redisConf.sub.host ? true : false,
            host: redisConf.sub.host || 'localhost',
            port: redisConf.sub.port || 6379,
            password: redisConf.sub.auth?.password
        }
    }
) : undefined;
export const lavalink = new LavalinkServer(discordClient.client.user?.id || config.DISCORD_CLIENT_ID);
export const apiServer = runner === "bun" ?
    new createBunAPIServer(expressConf.EXPRESS_PORT) :
    new createAPIServer(expressConf.EXPRESS_PORT);
export const ponaEventManager = new eventManager();
export const ytmusic = new PonaYTMusicAPI();

process.on('exit', () => {
    if ( redisClient )
    {
        redisClient.redis.quit().then(() => {
            console.log(prefix.redis, 'Redis connection closed.');
        }).catch((err) => {
            console.error(prefix.redis, 'Error closing Redis connection:', err);
        });
        if ( redisClient.redis_ReadOnly )
            redisClient.redis_ReadOnly.quit().then(() => {
                console.log(prefix.redis, 'Redis Replica connection closed.');
            }).catch(err => {
                console.error(prefix.redis, 'Error closing Redis Replica connection:', err);
            });
    }
    if (database.connection) {
        database.connection.end().then(() => {
            console.log(prefix.database, 'Database connection closed.');
        }).catch((err) => {
            console.error(prefix.database, 'Error closing database connection:', err);
        });
    }
});