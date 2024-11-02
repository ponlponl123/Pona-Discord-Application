import { Pona } from './client'
import { LavalinkServer } from './lavalink'
import { apiServer as createAPIServer } from '@server/main'
import { config as discordConf } from '@config/discord'
import { config as expressConf } from '@config/express'
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

export const discordClient = new Pona(client, needCluster);
export const lavalink = new LavalinkServer(discordClient.client.user?.id || config.DISCORD_CLIENT_ID);
export const apiServer = new createAPIServer(expressConf.EXPRESS_PORT);