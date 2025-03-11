import Pona from './client'
import eventManager from './events'
import { Database } from './database'
import LavalinkServer from './lavalink'
import { config as discordConf } from '@config/discord'
import { config as expressConf } from '@config/express'
import { config as databaseConf } from '@config/database'
import { apiServer as createAPIServer } from '@server/main'
import { PonaDeliver as createBunAPIServer } from '@server/main-bun'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { getInfo } from 'discord-hybrid-sharding'
import { PonaYTMusicAPI } from './ytmusic'

export class PonaDiscordApp {
    public needCluster;
    public client;
    public config;
    public runner;
    public pona;
    public discordClient;
    public database;
    public lavalink;
    public apiServer;
    public ponaEventManager;
    public ytmusic;

    constructor ()
    {
        this.needCluster = process.env["CLUSTER"] === 'true' ? true : false;
        this.client = new Client({
            shards: this.needCluster ? getInfo().SHARD_LIST : undefined,
            shardCount: this.needCluster ? getInfo().TOTAL_SHARDS : 1,
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
        
        this.config = discordConf;
        this.runner = process.env["RUNNER"] || 'default';
        this.pona = new Pona(this.client, this.needCluster);
        this.discordClient = this.pona;
        this.database = new Database({
            host: databaseConf.host || 'localhost',
            port: databaseConf.port || 3306,
            user: databaseConf.user || 'localhost',
            password: databaseConf.password || 'secret',
            database: databaseConf.database || 'my_db',
        });
        this.lavalink = new LavalinkServer(this.discordClient.client.user?.id || this.config.DISCORD_CLIENT_ID);
        this.apiServer = this.runner === "bun" ?
            new createBunAPIServer(expressConf.EXPRESS_PORT) :
            new createAPIServer(expressConf.EXPRESS_PORT);
        this.ponaEventManager = new eventManager();
        this.ytmusic = new PonaYTMusicAPI();
    }
}

export const  main = new PonaDiscordApp();
export const  needCluster = main.needCluster;
export const  client = main.client;
export const  config = main.config;
export const  runner = main.runner;
export const  pona = main.pona;
export const  discordClient = main.discordClient;
export const  database = main.database;
export const  lavalink = main.lavalink;
export const  apiServer = main.apiServer;
export const  ponaEventManager = main.ponaEventManager;
export const  ytmusic = main.ytmusic;
export default main;