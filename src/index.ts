import Pona from './client'
import eventManager from './events'
import { Database } from './database'
import LavalinkServer from './lavalink'
import { config as discordConf } from '@config/discord'
import { config as expressConf } from '@config/express'
import { config as databaseConf } from '@config/database'
import { apiServer as createAPIServer } from '@server/main'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { getInfo } from 'discord-hybrid-sharding'

export const config = discordConf;

const needCluster = process.env.CLUSTER === 'true' ? true : false;
const client = new Client({
    shards: needCluster ? getInfo().SHARD_LIST : undefined,
    shardCount: needCluster ? getInfo().TOTAL_SHARDS : 1,
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

export const pona = new Pona(client, needCluster);
export const discordClient = pona;
export const database = new Database({
    host: databaseConf.host || 'localhost',
    port: databaseConf.port || 3306,
    user: databaseConf.user || 'localhost',
    password: databaseConf.password || 'secret',
    database: databaseConf.database || 'my_db',
});
export const lavalink = new LavalinkServer(discordClient.client.user?.id || config.DISCORD_CLIENT_ID);
export const apiServer = new createAPIServer(expressConf.EXPRESS_PORT);
export const ponaEventManager = new eventManager();