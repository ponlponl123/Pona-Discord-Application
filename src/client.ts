import path, { join } from 'path';
import { readdirSync } from 'fs';
import {
    Client,
    Guild,
    REST,
    Routes,
    ApplicationCommandDataResolvable,
    Collection,
    Events,
    ActivityType,
    VoiceBasedChannel,
    VoiceState
} from 'discord.js'
import { config } from '@config/discord';
import commandIndex from '@commands/index';
import slashCommand from '@interfaces/command';
import { prefix as consolePrefix } from '@config/console'
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import { BaseMessage, ClusterClient, getInfo, messageType } from "discord-hybrid-sharding";
import setVoiceChannelStatus from '@utils/setVoiceChannelStatus';
import { getWelcomeMessage } from '@utils/getWelcomeMessage';
import GuildSettings from '@interfaces/guildSettings';
import { Node } from '@/lavalink';
import { getGuildLanguage } from './utils/i18n';
import { database, lavalink } from "@/index";
import { setInterval } from 'timers';
import { EventEmitter } from 'events';

export type voiceStateChange = 'clientJoined' | 'clientLeaved' | 'clientSwitched' | 'memberJoined' | 'memberLeaved' | 'memberSwitched';

export interface PonaEvents {
    'heartbeat': (client: Client) => void;
    'voiceStateUpdate': (type: voiceStateChange, oldState: VoiceState, newState: VoiceState) => void;
    'clientReady': (client: Client) => void;
}

declare interface Pona {
    on<U extends keyof PonaEvents>(
        event: U, listener: PonaEvents[U]
    ): this;

    emit<U extends keyof PonaEvents>(
        event: U, ...args: Parameters<PonaEvents[U]>
    ): boolean;
}

interface ClientWithCluster extends Client {
    cluster?: ClusterClient;
}

class Pona extends EventEmitter {
    public readonly prefix = 'pona!';
    public readonly heartbeatInterval = setInterval(() => this.heartbeatEvent(this.client), 60 * 1000);
    public slashCommands = new Array<ApplicationCommandDataResolvable>();
    public slashCommandsMap = new Collection<string, slashCommand>();
    public ponaId: string;

    public constructor( public readonly client: ClientWithCluster, public readonly needCluster: Boolean ) {
        super();
        this.ponaId = String(new Date().getTime());
        if (needCluster) this.client.cluster = new ClusterClient(client);
        this.client.login(config.DISCORD_TOKEN);
        console.log(consolePrefix.system + "\x1b[33mLogging in discord application...\x1b[0m");

        if (this.client.cluster) {
            if (this.client.cluster.maintenance) console.log(`Bot on maintenance mode with ${this.client.cluster.maintenance}`);
    
            this.client.cluster.on('ready', (client) => {
                console.log(consolePrefix.shard + consolePrefix.discord + `Cluster is ready ${client.id}`)
            });

            this.client.cluster.on('message', message => {
                console.log(consolePrefix.shard + message);
                if ((message as BaseMessage)["_type"] !== messageType.CUSTOM_REQUEST) return; // Check if the message needs a reply
                if ((message as BaseMessage)["alive"]) (message as BaseMessage)["reply"]({ content: 'Yes I am!' });
            });

            setInterval(() => {
                if (this.client.cluster) this.client.cluster.send({ content: 'I am alive as well!' });
            }, 5000);
        }
    
        this.client.once(Events.ClientReady, async () => {
            if ( needCluster )
            {
                try {
                    const shardInfo = getInfo();
                    const totalGuilds = await client.guilds.fetch().then(guilds => guilds.size); // Fetch total number of guilds
                    const maxShards = Math.ceil(totalGuilds / 2500); // Calculate maximum shard count
                    if ( shardInfo.TOTAL_SHARDS >= maxShards )
                    {
                        console.log(consolePrefix.discord + `\x1b[31mDiscord exited: Shard is not enabled or total guilds exceed maximum limit.\x1b[0m`);
                        return this.client.destroy();
                    }
                } catch {
                    console.log(consolePrefix.discord + ' An error occurred while fetching shard information OR Shard is not enabled.');
                }
            }
            this.client.user?.setStatus('idle');
            console.log(consolePrefix.discord + `\x1b[32m${this.client.user?.username}#${this.client.user?.discriminator} logged in! 🤖\x1b[0m`);
            this.heartbeatEvent(this.client);
            this.emit('clientReady', client);

            this.registerSlashCommands();
            lavalink.manager.on('nodeConnect', async (node: Node) => {
                this.client.user?.setStatus('online');
                console.log( consolePrefix.lavalink + `\x1b[41mNode "${node.options.identifier}(${node.address})" have ${node.manager.players.size} players\x1b[0m` );
                node.manager.players.map(async player => {
                    console.log( consolePrefix.lavalink + 'Founded player: ' + player.guild );
                })
            })
            lavalink.manager.init(config.DISCORD_CLIENT_ID);
        });
    
        this.client.on(Events.GuildCreate, async (guild: Guild) => {
            if (guild.systemChannel?.isSendable())
                guild.systemChannel.send({
                    content: "<:PonaHello:1298343379561877656> Ohalo!"
                })
        });

        this.client.on(Events.MessagePollVoteAdd, (answer, userId) => {
            console.log(consolePrefix.discord + `\x1b[32mPoll Vote: \x1b[0m\x1b[47m\x1b[30m${answer.poll.message.guildId}\x1b[0m - \x1b[36m${answer.poll.question}\x1b[0m - \x1b[33m${userId}\x1b[0m - \x1b[31m${answer.voteCount}\x1b[0m`);
        });

        this.client.on(Events.Warn, (info) => console.log(consolePrefix.discord + info));
        this.client.on(Events.Error, console.error);

        this.client.on(Events.VoiceStateUpdate, async (oldState, newState): Promise<any> => {
            const guildId = oldState?.guild?.id || newState?.guild?.id;
            if (
                !this.client.user ||
                !oldState.member
            ) return;
            if ( oldState.member.user.id === this.client.user.id )
            {
                if ( !oldState.channelId && newState.channelId ) 
                    this.emit('voiceStateUpdate', 'clientJoined', oldState, newState);
                if ( oldState.channelId && !newState.channelId ) {
                    const getCurrentVoiceChannel = await isPonaInVoiceChannel( oldState.guild.id );
                    if ( getCurrentVoiceChannel ) {
                        const getPreviousVoiceChannel = await this.client.channels.fetch(oldState.channelId) as VoiceBasedChannel;
                        await setVoiceChannelStatus(getPreviousVoiceChannel);
                    }
                    this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
                } else if (
                    (oldState.channelId && newState.channelId) &&
                    oldState.channelId !== newState.channelId
                ) {
                    const getCurrentPlayerState = await isPonaInVoiceChannel(oldState.guild.id);
                    if ( getCurrentPlayerState ) {
                        const getPreviousVoiceChannel = await this.client.channels.fetch(oldState.channelId) as VoiceBasedChannel;
                        const getCurrentVoiceChannel = await this.client.channels.fetch(newState.channelId) as VoiceBasedChannel;
                        await setVoiceChannelStatus(getPreviousVoiceChannel);
                        const getExistPlayer = lavalink.manager.players.filter( rootPlayer => rootPlayer.guild === guildId );
                        if ( getExistPlayer.at(0)?.queue?.current ){
                            const lang = await getGuildLanguage(oldState.guild.id);
                            await setVoiceChannelStatus(
                                getCurrentVoiceChannel,
                                `${lang.data.music.state.voiceChannel.status} ${getExistPlayer.at(0)?.queue.current?.title} ${lang.data.music.play.author} ${getExistPlayer.at(0)?.queue.current?.author}`
                            );
                        }
                        this.emit('voiceStateUpdate', 'clientSwitched', oldState, newState);
                    }
                }
            }
            else
            {
                if ( !oldState.channelId && newState.channelId ) 
                    this.emit('voiceStateUpdate', 'memberJoined', oldState, newState);
                if ( oldState.channelId && !newState.channelId ) 
                    this.emit('voiceStateUpdate', 'memberLeaved', oldState, newState);
                if (
                    (oldState.channelId && newState.channelId) &&
                    oldState.channelId !== newState.channelId
                ) 
                    this.emit('voiceStateUpdate', 'memberSwitched', oldState, newState);
                const getExistPlayer = lavalink.manager.players.filter( rootPlayer => rootPlayer.guild === guildId );
                if (
                    (oldState.channelId && !newState.channelId) &&
                    oldState.channel &&
                    oldState.channel.members.size <= 1 &&
                    getExistPlayer && getExistPlayer.size > 0 &&
                    getExistPlayer.at(0)?.voiceChannel === oldState.channelId
                ) 
                    getExistPlayer.at(0)?.destroy(),this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
            }
        });
    
        this.client.on(Events.InteractionCreate, async (interaction): Promise<any> => {
            if (!interaction.isCommand()) {
                return;
            }
    
            const command = this.slashCommandsMap.get(interaction.commandName);
            if (command) {
                command.execute(interaction);
            }
        });
    }

    private async registerSlashCommands() {
        if ( process.env["AUTO_ROUTE"] !== "no" )
        {
            const commandsDirectory = join(__dirname, "commands");
            const commandFiles = readdirSync(commandsDirectory).filter((file) => !file.endsWith(".map"));
    
            for (const file of commandFiles) {
                if ( file.startsWith('index') || (!file.endsWith('.ts') && !file.endsWith('.js')) ) continue;
    
                const filePath_mjs = path.resolve(commandsDirectory, file);
                const filePath_esm = 'file://' + filePath_mjs;
                let filePath: string = filePath_esm;
                let command: slashCommand;
                try {
                    const test = await import(filePath_esm);
                    command = test;
                } catch (err) {
                    console.warn(consolePrefix.discord + 'Failed to import ESM module, retrying with MJS');
                    try {
                        const test = await import(filePath_mjs);
                        command = test;
                    } catch (err) {
                        console.error(consolePrefix.discord + `Failed to import command at ${filePath_mjs}:`, err);
                        continue;
                    }
                }
    
                if ('data' in command && 'execute' in command) {
                    this.slashCommands.push(command.data.toJSON());
                    this.slashCommandsMap.set(command.data.name, command);
                    console.log(consolePrefix.discord + `\x1b[33mRegistering command: \x1b[0m\x1b[47m\x1b[30m ${command.data.name} \x1b[0m`);
                } else {
                    console.log(consolePrefix.discord + `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        } else {
            commandIndex.forEach((command, index) => {
                if ('data' in command && 'execute' in command) {
                    this.slashCommands.push(command.data.toJSON());
                    this.slashCommandsMap.set(command.data.name, command);
                    console.log(consolePrefix.discord + `\x1b[33mRegistering command: \x1b[0m\x1b[47m\x1b[30m ${command.data.name} \x1b[0m`);
                } else {
                    console.log(consolePrefix.discord + `[WARNING] The command at ${index}(index) is missing a required "data" or "execute" property.`);
                }
            })
        }
        const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
        const regisResult = await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });
        if ( regisResult )
            console.log(consolePrefix.discord + '\x1b[32mRegis Slash commands successfully!\x1b[0m');
        else
            console.log(consolePrefix.discord + '\x1b[31mRegis Slash commands failed :(\x1b[0m');
    }

    private async heartbeatEvent(client: Client): Promise<void> {
        if ( !client?.user ) return;
        const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
        console.log( consolePrefix.discord + `${date.toLocaleString()} Heartbeat interval event received from client` );
        client.user.setActivity({
            name: getWelcomeMessage(),
            type: ActivityType.Custom,
            url: 'https://pona.ponlponl123.com/'
        })
        this.emit('heartbeat', client);
    }

    public async defaultGuildLanguageChangedEvent(guildId: string): Promise<void> {
        if ( !lavalink ) return;
        const getExistPlayer = lavalink.manager.players.filter( rootPlayer => rootPlayer.guild === guildId );
        if ( getExistPlayer.size > 0 ) {
            const lang = await getGuildLanguage(guildId);
            await setVoiceChannelStatus(
                'guild-'+getExistPlayer.at(0)?.guild as string,
                `${lang.data.music.state.voiceChannel.status} ${getExistPlayer.at(0)?.queue?.current?.title} ${lang.data.music.play.author} ${getExistPlayer.at(0)?.queue?.current?.author}`
            );
        }
    }

    public async saveGuildSettings(guildId: string, settings: GuildSettings): Promise<boolean> {
        if (!guildId || !database || !database.connection) return false;
        console.log(consolePrefix.discord + '\x1b[33mSaving guild setting: ' + guildId + '\x1b[0m');
        
        try {
            const fetchPrevGuildSettings = await database.connection.query(
                `SELECT args FROM guilds WHERE guildid = ? LIMIT 1`,
                [guildId]
            );

            let defaultSetting = {};
            if (fetchPrevGuildSettings && fetchPrevGuildSettings[0]?.args) {
                defaultSetting = JSON.parse(fetchPrevGuildSettings[0].args);
            }

            const newSetting = JSON.stringify({ ...defaultSetting, ...settings });
            await database.connection.query(
                `INSERT IGNORE INTO guilds (guildid, args) VALUES (?, ?) ON DUPLICATE KEY UPDATE args = ?`,
                [guildId, newSetting, newSetting]
            );

            if (settings.language !== undefined && settings.language) {
                await this.defaultGuildLanguageChangedEvent(guildId);
            }

            console.log(consolePrefix.discord + '\x1b[32mSaved guild setting: ' + guildId + '\x1b[0m');
            return true;
        } catch (error) {
            console.error(consolePrefix.discord + '\x1b[31mFailed to save guild setting: ' + guildId + '\x1b[0m', error);
            return false;
        }
    }

    public async loadGuildSettings(guildId: string): Promise<GuildSettings | undefined> {
        if ( !guildId || !database || !database.connection ) return;
        console.log( consolePrefix.discord + '\x1b[33mLoading guild setting: ' + guildId + '\x1b[0m');

        try {
            const fetchPrevGuildSettings = await database.connection.query(
                `SELECT args FROM guilds WHERE guildid = ? LIMIT 1`,
                [guildId]
            )

            if ( fetchPrevGuildSettings && fetchPrevGuildSettings[0] && fetchPrevGuildSettings[0].args )
                return JSON.parse(fetchPrevGuildSettings[0].args);
    
            console.log( consolePrefix.discord + '\x1b[32bLoaded guild setting: ' + guildId + '\x1b[0m');
            return;
        } catch (error) {
            console.error(consolePrefix.discord + '\x1b[31mFailed to load guild setting: ' + guildId + '\x1b[0m', error);
            return;
        }
    }
}

export default Pona;