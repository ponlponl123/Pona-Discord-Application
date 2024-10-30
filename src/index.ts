import { Pona } from './client'
import { LavalinkServer } from './lavalink'
import { apiServer as createAPIServer } from '@server/main'
import { config as discordConf } from '@config/discord'
import { config as expressConf } from '@config/express'
import { Client, IntentsBitField } from 'discord.js'
import { getInfo } from 'discord-hybrid-sharding'

export const config = discordConf;

const needCluster = process.env.CLUSTER === 'true' ? true : false;
const client = new Client({
    shards: needCluster ? getInfo().SHARD_LIST : undefined,
    shardCount: needCluster ? getInfo().TOTAL_SHARDS : 1,
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessagePolls,
        IntentsBitField.Flags.GuildMessageReactions
    ],
});

export const discordClient = new Pona(client, needCluster);
export const lavalink = new LavalinkServer(discordClient.client.user?.id || config.DISCORD_CLIENT_ID);
export const apiServer = new createAPIServer(expressConf.EXPRESS_PORT);