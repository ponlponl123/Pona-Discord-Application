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
    TextBasedChannel,
    VoiceState
} from 'discord.js'
import {
    DiscordGatewayAdapterCreator,
    VoiceConnection
} from '@discordjs/voice';
import { config } from '@config/discord';
import commandIndex from '@commands/index';
import slashCommand from '@interfaces/command';
import { lavaPlayer } from '@/interfaces/player';
import { prefix as consolePrefix } from '@config/console'
import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from '@utils/isPonaInVoiceChannel';
import { BaseMessage, ClusterClient, getInfo, messageType } from "discord-hybrid-sharding";
import setVoiceChannelStatus from '@utils/setVoiceChannelStatus';
import { getWelcomeMessage } from '@utils/getWelcomeMessage';
import GuildSettings from '@interfaces/guildSettings';
import { Manager, Node, Player } from '@/lavalink';
import { getGuildLanguage } from './utils/i18n';
import { lavalink } from "@/index";
import { setInterval } from 'timers';
import { EventEmitter } from 'events';
import fs from 'fs';

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
    public voiceConnections = new Array<VoiceConnection>();
    public playerConnections = new Array<lavaPlayer>();
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
            // else {
            //     // check if discord bot is already logged in by another process or any then logout this session
            //     if (this.client.user?.presence?.status === 'online') this.client.destroy();
            //     console.log(consolePrefix.discord + `\x1b[31mDiscord exited: Bot is already logged in by another process or any!\x1b[0m`);
            //     return;
            // }
            this.client.user?.setStatus('idle');
            console.log(consolePrefix.discord + `\x1b[32m${this.client.user?.username}#${this.client.user?.discriminator} logged in! 🤖\x1b[0m`);
            this.heartbeatEvent(this.client);
            this.emit('clientReady', client);

            this.registerSlashCommands();
            lavalink.manager.on('nodeConnect', async (node: Node) => {
                this.client.user?.setStatus('online');
                await this.loadSessionFromFile(node.manager);
                console.log( consolePrefix.lavalink + `\x1b[41mNode "${node.options.identifier}(${node.address})" have ${node.manager.players.size} players\x1b[0m` );
                node.manager.players.map(async player => {
                    console.log( consolePrefix.lavalink + 'Founded player: ' + player.guild );
                })
            })
            lavalink.manager.on('playerCreate', async (player: Player) => {
                const getExistPlayer = this.playerConnections.filter( rootPlayer => rootPlayer.player.guild === player.guild );
                if ( getExistPlayer.length > 0 ) return true;
                if ( !player.voiceChannel || !player.textChannel ) return false;
                const voiceChannel = await this.client.channels.fetch(player.voiceChannel) as VoiceBasedChannel;
                const textChannel = await this.client.channels.fetch(player.textChannel) as TextBasedChannel;
                const guild = await this.client.guilds.fetch(player.guild) as Guild;
                // const checkIsPlayerIsExist = this.playerConnections.filter( rootPlayer => rootPlayer.player.guild === player.guild );
                if ( getExistPlayer.length > 0 ) {
                    console.log( consolePrefix.lavalink + '\x1b[32mIgnore exist player: \x1b[0m\x1b[47m\x1b[30m' + player.guild + '\x1b[0m' );
                    return true;
                }
                this.playerConnections.push({
                    player: player,
                    voiceChannel: voiceChannel,
                    textChannel: textChannel,
                    guild: guild
                })
                console.log( consolePrefix.lavalink + '\x1b[32mRestored missing player: \x1b[0m\x1b[47m\x1b[30m' + player.guild + '\x1b[0m' );
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
            if (
                !this.client.user ||
                !oldState.member
            ) return;
            if ( oldState.member.user.id === this.client.user.id )
            {
                if ( !oldState.channelId && newState.channelId ) 
                    this.emit('voiceStateUpdate', 'clientJoined', oldState, newState);
                if ( oldState.channelId && !newState.channelId ) {
                    const getCurrentVoiceChannel = isPonaInVoiceChannel( oldState.guild.id, false ) as IsPonaInVoiceChannel[];
                    if ( getCurrentVoiceChannel.length > 0 && getCurrentVoiceChannel[0][1] === 'player' ) {
                        const getPreviousVoiceChannel = await this.client.channels.fetch(oldState.channelId) as VoiceBasedChannel;
                        this.playerConnections = this.playerConnections.filter((connection) => connection.guild.id !== oldState.guild.id);
                        await setVoiceChannelStatus(getPreviousVoiceChannel);
                    } else if ( getCurrentVoiceChannel.length > 0 && getCurrentVoiceChannel[0][1] === 'voice' ) {
                        this.voiceConnections = this.voiceConnections.filter((connection) => connection.joinConfig.guildId !== oldState.guild.id);
                    }
                    this.saveSessionOnFile();
                    this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
                } else if (
                    (oldState.channelId && newState.channelId) &&
                    oldState.channelId !== newState.channelId
                ) {
                    const getCurrentPlayerState = isPonaInVoiceChannel( oldState.guild.id, 'player' ) as lavaPlayer[];
                    if ( getCurrentPlayerState.length > 0 ) {
                        const playerConnection = this.playerConnections.findIndex((connection) => connection.guild.id === oldState.guild.id);
                        const getPreviousVoiceChannel = await this.client.channels.fetch(oldState.channelId) as VoiceBasedChannel;
                        const getCurrentVoiceChannel = await this.client.channels.fetch(newState.channelId) as VoiceBasedChannel;
                        await setVoiceChannelStatus(getPreviousVoiceChannel);
                        if ( this.playerConnections[playerConnection].player.queue.current ){
                            const lang = getGuildLanguage(oldState.guild.id);
                            await setVoiceChannelStatus(
                                getCurrentVoiceChannel,
                                `${lang.data.music.state.voiceChannel.status} ${this.playerConnections[playerConnection].player.queue.current.title} ${lang.data.music.play.author} ${this.playerConnections[playerConnection].player.queue.current.author}`
                            );
                        }
                        this.playerConnections[playerConnection].player.setVoiceChannel(getCurrentVoiceChannel.id);
                        this.playerConnections[playerConnection].player.manager.savePlayerState(newState.guild.id);
                        this.playerConnections[playerConnection].voiceChannel = getCurrentVoiceChannel;
                        this.saveSessionOnFile();
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
                if (
                    (oldState.channelId && !newState.channelId) &&
                    oldState.channel &&
                    oldState.channel.members.size <= 1
                ) {
                    const playerConnection = this.playerConnections.filter((connection) => connection.guild.id === oldState.guild.id);
                    const voiceConnection = this.voiceConnections.filter((connection) => connection.joinConfig.guildId === oldState.guild.id);
                    if (playerConnection.length > 0) {
                        playerConnection[0].player.destroy();
                        playerConnection[0].player.disconnect();
                        this.playerConnections = this.playerConnections.filter((connection) => connection.guild.id !== oldState.guild.id);
                        await setVoiceChannelStatus(oldState.channel);
                        this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
                    } else if (voiceConnection.length > 0) {
                        voiceConnection[0].destroy();
                        this.voiceConnections = this.voiceConnections.filter((connection) => connection.joinConfig.guildId !== oldState.guild.id);
                        this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
                    }
                }
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
        const checkPlayerConnectionExist = this.playerConnections.filter((connection) => connection.guild.id === guildId);
        if ( checkPlayerConnectionExist.length > 0 ) {
            const lang = getGuildLanguage(guildId);
            await setVoiceChannelStatus(
                checkPlayerConnectionExist[0].voiceChannel,
                `${lang.data.music.state.voiceChannel.status} ${checkPlayerConnectionExist[0].player.queue.current?.title} ${lang.data.music.play.author} ${checkPlayerConnectionExist[0].player.queue.current?.author}`
            );
        }
    }

    public saveGuildSettings(guild: Guild, settings: GuildSettings): boolean {
        if ( !guild.id ) return false;
        console.log( consolePrefix.discord + '\x1b[33mSaving guild setting: ' + guild.id + '\x1b[0m');
        // find ponaState directory in root directory
        const ponaStateDir = path.join(__dirname, "..", "ponaState");
        const guildSettingDir = path.join(ponaStateDir, "guildSettings");

        // create directory if not exists
        if (!fs.existsSync(ponaStateDir) )
            fs.mkdirSync(ponaStateDir);
        if (!fs.existsSync(guildSettingDir) )
            fs.mkdirSync(guildSettingDir);

        const settingsFilePath = path.join(guildSettingDir, `${guild.id}.json`);
        let defaultSetting = {};
        if ( fs.existsSync(settingsFilePath) )
            defaultSetting = JSON.parse(fs.readFileSync(settingsFilePath, "utf-8"));

        fs.writeFileSync(settingsFilePath, JSON.stringify({ ...defaultSetting, ...settings }));
        
        if ( settings.language !== undefined && settings.language ) this.defaultGuildLanguageChangedEvent(guild.id);

        console.log( consolePrefix.discord + '\x1b[32bSaved guild setting: ' + guild.id + '\x1b[0m');

        return true;
    }

    public loadGuildSettings(guild: Guild): GuildSettings | undefined {
        if ( !guild.id ) return;
        console.log( consolePrefix.discord + '\x1b[33mLoading guild setting: ' + guild.id + '\x1b[0m');
        // find ponaState directory in root directory
        const ponaStateDir = path.join(__dirname, "..", "ponaState");
        const guildSettingDir = path.join(ponaStateDir, "guildSettings");

        // check if directory exists
        if ( !fs.existsSync(ponaStateDir) || !fs.existsSync(guildSettingDir) )
        {
            console.log( consolePrefix.discord + '\x1b[33bLoaded guild setting: ' + guild.id + ' Failed.\nRoot state directory not exist\x1b[0m');
            return;
        }

        const settingsFilePath = path.join(guildSettingDir, `${guild.id}.json`);
        if (!fs.existsSync(settingsFilePath) )
        {
            console.log( consolePrefix.discord + '\x1b[33bLoad guild setting: ' + guild.id + ' Failed.\nSettings file not exist\x1b[0m');
            return;
        }
        
        const settingsData = fs.readFileSync(settingsFilePath, "utf-8");
        const settings: GuildSettings = JSON.parse(settingsData);

        console.log( consolePrefix.discord + '\x1b[32bLoaded guild setting: ' + guild.id + '\x1b[0m');

        return settings;
    }

    public saveSessionOnFile() {
        // Implement saving session to file
        console.log(consolePrefix.discord + "\x1b[33mSaving session to file...\x1b[0m");
        try {
            // find ponaState directory in root directory
            const ponaStateDir = path.join(__dirname, "..", "ponaState");
            const ponaPlayerStateDir = path.join(ponaStateDir, "playerConnections");
            const ponaVoiceStateDir = path.join(ponaStateDir, "voiceConnections");
            
            // create directory if not exists
            if (!fs.existsSync(ponaStateDir) )
                fs.mkdirSync(ponaStateDir);
            if (!fs.existsSync(ponaPlayerStateDir) )
                fs.mkdirSync(ponaPlayerStateDir);
            if (!fs.existsSync(ponaVoiceStateDir) )
                fs.mkdirSync(ponaVoiceStateDir);

            for ( let i = 0; i < 2; i++ ) {
                switch ( i ) {
                    case 1:
                        const playerStates = readdirSync(ponaPlayerStateDir).filter((file) => file.endsWith(".json"));
                        for (const state of playerStates) {
                            const readSession = JSON.parse(fs.readFileSync(path.join(ponaPlayerStateDir, state), "utf8"));
                            if ( this.playerConnections.filter((e) => e.guild.id === readSession.guild.id).length > 0 ) continue;
                            fs.unlinkSync(path.join(ponaPlayerStateDir, state));
                            console.log(consolePrefix.discord + `\x1b[32mDrop inactive player: \x1b[0m\x1b[47m\x1b[30m ${readSession.guild.id} \x1b[0m`);
                        }
                        continue;
                    case 2:
                        const voiceStates = readdirSync(ponaVoiceStateDir).filter((file) => file.endsWith(".json"));
                        for (const state of voiceStates) {
                            const readSession = JSON.parse(fs.readFileSync(path.join(ponaVoiceStateDir, state), "utf8")) as VoiceConnection;
                            if ( this.voiceConnections.filter((e)=>e.joinConfig.guildId === readSession.joinConfig.guildId).length > 0 ) continue;
                            fs.unlinkSync(path.join(ponaVoiceStateDir, state));
                            console.log(consolePrefix.discord + `\x1b[32mDrop inactive player: \x1b[0m\x1b[47m\x1b[30m ${readSession.joinConfig.guildId} \x1b[0m`);
                        }
                        continue;
                    default:
                        continue;
                }
            }
            
            // save session data to a file
            this.playerConnections.map((e) => {
                fs.writeFileSync(path.join(ponaPlayerStateDir, `${e.guild.id}.json`), JSON.stringify({
                    player: e.player.guild,
                    voiceChannel: e.voiceChannel,
                    textChannel: e.textChannel,
                    guild: e.guild
                }));
            })

            this.voiceConnections.map((e) => {
                fs.writeFileSync(path.join(ponaVoiceStateDir, `${e.joinConfig.guildId}.json`), JSON.stringify(e));
            })
                
            console.log(consolePrefix.discord + "\x1b[32mSession saved successfully!\x1b[0m");
        } catch (e) {
            console.log(consolePrefix.discord + "\x1b[31mSession saved failed :(\x1b[0m\n", e);
        }
    }

    private async loadSessionFromFile(lavalink: Manager, restore?: string): Promise<void> {
        // Implement loading session from file
        console.log(consolePrefix.discord + "\x1b[33mLoading session from file...\x1b[0m");
        try {
            // find ponaState directory in root directory
            const ponaStateDir = path.join(__dirname, "..", "ponaState");
            const ponaPlayerStateDir = path.join(ponaStateDir, "playerConnections");
            const ponaVoiceStateDir = path.join(ponaStateDir, "voiceConnections");
            
            // check if directory exists
            if ( !fs.existsSync(ponaStateDir) )
                return;

            if ( restore ) {
                const guild = await this.client.guilds.fetch(restore) as Guild;
                if (!guild ) {
                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for guild ${restore}!\nGuild not found\x1b[0m`)
                    return;
                }
                const target = path.join(ponaPlayerStateDir, `${guild.id}.json`);
                if ( !fs.existsSync(target) ) {
                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${guild.id}!\nSession not exist or dropped.\x1b[0m`)
                    return;
                }
                const playerConnectionData = JSON.parse(fs.readFileSync(target, "utf8"));
                if ( !playerConnectionData.player ) {
                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${guild.id}!\nPlayerId is not define in session file\x1b[0m`)
                    return;
                }
                if ( !this.client.guilds.cache.get(playerConnectionData.player) ) {
                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${playerConnectionData.player}! (Guild not found)\x1b[0m`);
                    return;
                }
                const fetchGuildData = await this.client.guilds.fetch(playerConnectionData.player) as Guild;
                const player = lavalink.get(playerConnectionData.player);
                if ( !player ) {
                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${playerConnectionData.player}!\nPlayer is never in lavalink\x1b[0m`)
                    return;
                }
                const getExistPlayer = this.playerConnections.filter( rootPlayer => rootPlayer.player.guild === player.guild );
                if ( getExistPlayer.length > 0 ) {
                    console.log(consolePrefix.discord + `\x1b[32mIgnore exist player: \x1b[0m\x1b[47m\x1b[30m ${playerConnectionData.player} \x1b[0m`);
                } else {
                    this.playerConnections.push({
                        player: player,
                        voiceChannel: fetchGuildData.channels.cache.get(playerConnectionData.voiceChannel.id) as VoiceBasedChannel,
                        textChannel: fetchGuildData.channels.cache.get(playerConnectionData.textChannel.id) as TextBasedChannel,
                        guild: fetchGuildData
                    });
                    console.log(consolePrefix.discord + `\x1b[32mReconnected to player: \x1b[0m\x1b[47m\x1b[30m ${playerConnectionData.player} \x1b[0m`);
                }
            } else {
                for ( let i = 0; i < 2; i++ ) {
                    switch ( i ) {
                        case 1:
                            if ( !fs.existsSync(ponaPlayerStateDir) )
                                continue;
                            const playerStates = readdirSync(ponaPlayerStateDir).filter((file) => file.endsWith(".json"));
                            for (const state of playerStates) {
                                const playerConnectionData = JSON.parse(fs.readFileSync(path.join(ponaPlayerStateDir, state), "utf8"));
                                if ( !playerConnectionData.player ) {
                                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${playerConnectionData.player}! (PlayerId is not define in session file) \x1b[0m`)
                                    continue
                                }
                                if ( !this.client.guilds.cache.get(playerConnectionData.player) ) {
                                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${playerConnectionData.player}! (Guild not found)\x1b[0m`);
                                    continue
                                }
                                const fetchGuildData = await this.client.guilds.fetch(playerConnectionData.player) as Guild;
                                const player = lavalink.get(fetchGuildData.id);
                                if ( !player ) {
                                    console.log(consolePrefix.discord + `\x1b[31mFailed to restore session for ${playerConnectionData.player}! (Player is never in lavalink)\x1b[0m`);
                                    setTimeout(() => {
                                        console.log(consolePrefix.discord + `\x1b[90mRetrying to restore session for ${playerConnectionData.player}!\x1b[0m`);
                                        setTimeout(() => {
                                            this.loadSessionFromFile(lavalink, fetchGuildData.id)
                                        }, 1000);
                                    }, 320);
                                    continue
                                }
                                const getExistPlayer = this.playerConnections.filter( rootPlayer => rootPlayer.player.guild === player.guild );
                                if ( getExistPlayer.length > 0 ) {
                                    console.log(consolePrefix.discord + `\x1b[32mIgnore exist player: \x1b[0m\x1b[47m\x1b[30m ${playerConnectionData.player} \x1b[0m`);
                                    continue
                                }
                                this.playerConnections.push({
                                    player: player,
                                    voiceChannel: fetchGuildData.channels.cache.get(playerConnectionData.voiceChannel.id) as VoiceBasedChannel,
                                    textChannel: fetchGuildData.channels.cache.get(playerConnectionData.textChannel.id) as TextBasedChannel,
                                    guild: fetchGuildData
                                });
                                console.log(consolePrefix.discord + `\x1b[32mReconnected to player: \x1b[0m\x1b[47m\x1b[30m ${playerConnectionData.player} \x1b[0m`);
                            }
                            continue;
                        case 2:
                            if ( !fs.existsSync(ponaVoiceStateDir) )
                                continue;
                            const voiceStates = readdirSync(ponaVoiceStateDir).filter((file) => file.endsWith(".json"));
                            for (const state of voiceStates) {
                                const voiceConnectionData = JSON.parse(fs.readFileSync(path.join(ponaVoiceStateDir, state), "utf8")) as VoiceConnection;
                                if ( !voiceConnectionData.joinConfig.channelId ) continue;
                                const fetchGuildData = await this.client.guilds.fetch(voiceConnectionData.joinConfig.guildId) as Guild;
                                this.voiceConnections.push(new VoiceConnection(voiceConnectionData.joinConfig, { adapterCreator: fetchGuildData.voiceAdapterCreator as DiscordGatewayAdapterCreator }));
                                console.log(consolePrefix.discord + `\x1b[32mReconnected to voice channel: \x1b[0m\x1b[47m\x1b[30m ${voiceConnectionData.joinConfig.channelId} \x1b[0m`);
                            }
                            continue;
                        default:
                            continue;
                    }
                }
            }

            console.log(consolePrefix.discord + "\x1b[32mLoad session successfully!\x1b[0m");
        } catch (e) {
            console.log(consolePrefix.discord + "\x1b[31mLoad session failed :(\x1b[0m\n", e);
        }
    }
}

export default Pona;