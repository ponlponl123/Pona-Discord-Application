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
    User,
    VoiceBasedChannel,
    TextBasedChannel
} from 'discord.js'
import {
    DiscordGatewayAdapterCreator,
    VoiceConnection
} from '@discordjs/voice';
import { config } from './config/discord';
import slashCommand from './interfaces/command';
import { lavaPlayer } from './interfaces/lavaPlayer';
import { prefix as consolePrefix } from 'config/console'
import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from './utils/isPonaInVoiceChannel';
import { welcomeMessage } from './utils/getWelcomeMessage';
import { lavalink } from "@/index";
import fs from 'fs';

export class Pona {
    public readonly prefix = 'pona!';
    public slashCommands = new Array<ApplicationCommandDataResolvable>();
    public slashCommandsMap = new Collection<string, slashCommand>();
    public voiceConnections = new Array<VoiceConnection>();
    public playerConnections = new Array<lavaPlayer>();

    public constructor( public readonly client: Client ) {
        this.client.login(config.DISCORD_TOKEN);
        console.log(consolePrefix.system + "\x1b[33mLogging in discord application...\x1b[0m");
    
        this.client.once(Events.ClientReady, async (event) => {
            console.log(consolePrefix.system + `\x1b[32m${this.client.user?.username}#${this.client.user?.discriminator} is ready! 🤖\x1b[0m`);
            
            this.client.user?.setActivity({
                name: welcomeMessage,
                type: ActivityType.Custom,
                url: 'https://pona.ponlponl123.com/'
            })

            this.registerSlashCommands();
            this.loadSessionFromFile();
        });
    
        this.client.on(Events.GuildCreate, async (guild: Guild) => {
            guild.systemChannel?.send({
                content: "<:PonaHello:1298343379561877656> Ohalo!"
            })
        });

        this.client.on(Events.Warn, (info) => console.log(consolePrefix.discord + info));
        this.client.on(Events.Error, console.error);

        this.client.on(Events.VoiceStateUpdate, async (_oldState, _newState): Promise<any> => {
            if ( _oldState.client.user.username !== (this.client.user as User).username ) return false;
            if ( _oldState.channelId && !_newState.channelId ) {
                const getCurrentVoiceChannel = isPonaInVoiceChannel( _oldState.guild.id, false ) as IsPonaInVoiceChannel[];
                if ( getCurrentVoiceChannel.length > 0 && getCurrentVoiceChannel[0][1] === 'player' ) {
                    this.playerConnections = this.playerConnections.filter((connection) => connection.guild.id !== _oldState.guild.id)
                } else if ( getCurrentVoiceChannel.length > 0 && getCurrentVoiceChannel[0][1] === 'voice' ) {
                    this.voiceConnections = this.voiceConnections.filter((connection) => connection.joinConfig.guildId !== _oldState.guild.id)
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
        const commandsDirectory = join(__dirname, "commands");
        const commandFiles = readdirSync(commandsDirectory).filter((file) => !file.endsWith(".map"));
      
        for (const file of commandFiles) {
            if ( file.startsWith('index') || !file.endsWith('.ts') ) continue;

            const filePath = `file://${path.resolve(commandsDirectory, file)}`; // Convert to file URL
            const command: slashCommand = await import(filePath);

            if ('data' in command && 'execute' in command) {
                this.slashCommands.push(command.data.toJSON());
                this.slashCommandsMap.set(command.data.name, command);
                console.log(consolePrefix.discord + `\x1b[33mRegistering command: \x1b[0m\x1b[47m\x1b[30m ${command.data.name} \x1b[0m`);
            } else {
                console.log(consolePrefix.discord + `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
        const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
      
        const regisResult = await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });

        if ( regisResult )
            console.log(consolePrefix.discord + '\x1b[32mRegis Slash commands successfully!\x1b[0m');
        else
            console.log(consolePrefix.discord + '\x1b[31mRegis Slash commands failed :(\x1b[0m');
    }

    public saveSessionOnFile() {
        // Implement saving session to file
        console.log(consolePrefix.system + "\x1b[33mSaving session to file...\x1b[0m");
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
                
            console.log(consolePrefix.system + "\x1b[32mSession saved successfully!\x1b[0m");
        } catch (e) {
            console.log(consolePrefix.system + "\x1b[32mSession saved failed :(\x1b[0m\n", e);
        }
    }

    private loadSessionFromFile() {
        // Implement loading session from file
        console.log(consolePrefix.system + "\x1b[33mLoading session from file...\x1b[0m");
        try {
            // find ponaState directory in root directory
            const ponaStateDir = path.join(__dirname, "..", "ponaState");
            const ponaPlayerStateDir = path.join(ponaStateDir, "playerConnections");
            const ponaVoiceStateDir = path.join(ponaStateDir, "voiceConnections");
            
            // check if directory exists
            if ( !fs.existsSync(ponaStateDir) )
                return;
            
            for ( let i = 0; i < 2; i++ ) {
                switch ( i ) {
                    case 1:
                        if ( !fs.existsSync(ponaPlayerStateDir) )
                            continue;
                        const playerStates = readdirSync(ponaPlayerStateDir).filter((file) => file.endsWith(".json"));
                        for (const state of playerStates) {
                            const playerConnectionData = JSON.parse(fs.readFileSync(path.join(ponaPlayerStateDir, state), "utf8")) as lavaPlayer;
                            if ( !playerConnectionData.guild.id ) continue;
                            const fetchGuildData = this.client.guilds.cache.get(playerConnectionData.guild.id) as Guild;
                            const player = lavalink.manager.get(fetchGuildData.id);
                            if ( !player ) continue;
                            this.playerConnections.push({
                                player: player,
                                voiceChannel: fetchGuildData.channels.cache.get(playerConnectionData.voiceChannel.id) as VoiceBasedChannel,
                                textChannel: fetchGuildData.channels.cache.get(playerConnectionData.textChannel.id) as TextBasedChannel,
                                guild: fetchGuildData
                            });
                        }
                        continue;
                    case 2:
                        if ( !fs.existsSync(ponaVoiceStateDir) )
                            continue;
                        const voiceStates = readdirSync(ponaVoiceStateDir).filter((file) => file.endsWith(".json"));
                        for (const state of voiceStates) {
                            const voiceConnectionData = JSON.parse(fs.readFileSync(path.join(ponaVoiceStateDir, state), "utf8")) as VoiceConnection;
                            if ( !voiceConnectionData.joinConfig.channelId ) continue;
                            const fetchGuildData = this.client.guilds.cache.get(voiceConnectionData.joinConfig.guildId) as Guild;
                            this.voiceConnections.push(new VoiceConnection(voiceConnectionData.joinConfig, { adapterCreator: fetchGuildData.voiceAdapterCreator as DiscordGatewayAdapterCreator }));
                            console.log(consolePrefix.system + `\x1b[32mReconnected to voice channel: \x1b[0m\x1b[47m\x1b[30m ${voiceConnectionData.joinConfig.channelId} \x1b[0m`);
                        }
                        continue;
                    default:
                        continue;
                }
            }

            console.log(consolePrefix.system + "\x1b[31mLoad session successfully!\x1b[0m");
        } catch (e) {
            console.log(consolePrefix.system + "\x1b[31mLoad session failed :(\x1b[0m\n", e);
        }
    }
}