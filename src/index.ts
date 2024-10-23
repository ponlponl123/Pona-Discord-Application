import { Pona } from './client'
import { LavalinkServer } from './lavalink'
import { createHttpServer } from 'server/main'
import { Client, IntentsBitField } from 'discord.js'
import { config as discordConf } from 'config/discord'
import { config as expressConf } from 'config/express'

export const config = discordConf;

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "DirectMessages",
        "MessageContent",
        IntentsBitField.Flags.GuildVoiceStates
    ],
});

export const discordClient = new Pona(client);
export const lavalink = new LavalinkServer(discordClient.client.user?.id || config.DISCORD_CLIENT_ID);
export const apiServer = createHttpServer(expressConf.EXPRESS_PORT);