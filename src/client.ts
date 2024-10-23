import path, { join } from 'path';
import { readdirSync } from 'fs';
import {
    Client,
    Guild,
    REST,
    Routes,
    ApplicationCommandDataResolvable,
    SlashCommandBuilder,
    Collection,
    Events
} from 'discord.js'
import {
    VoiceConnection
} from '@discordjs/voice';
import { lavaPlayer } from './interfaces/lavaPlayer';
import { config } from './config/discord';
import { commands } from './commands';
import { prefix as consolePrefix } from 'config/console'
import isPonaInVoiceChannel, { IsPonaInVoiceChannel } from './utils/isPonaInVoiceChannel';

export class Pona {
    public readonly prefix = 'pona!';
    public commands = new Collection<string, SlashCommandBuilder>();
    public slashCommands = new Array<ApplicationCommandDataResolvable>();
    public slashCommandsMap = new Collection<string, SlashCommandBuilder>();
    public voiceConnections = new Array<VoiceConnection>();
    public playerConnections = new Array<lavaPlayer>();

    public constructor( public readonly client: Client ) {
        this.client.login(config.DISCORD_TOKEN);
        console.log(consolePrefix.system + "\x1b[33mLogging in discord application...\x1b[0m");
    
        this.client.once(Events.ClientReady, async (event) => {
            console.log(consolePrefix.system + `\x1b[32m${this.client.user?.username}#${this.client.user?.discriminator} is ready! 🤖\x1b[0m`);
            
            this.registerSlashCommands();
        });
    
        this.client.on(Events.GuildCreate, async (guild: Guild) => {
            guild.systemChannel?.send({
                content: "<:PonaHello:1298343379561877656> Ohalo!"
            })
        });

        this.client.on(Events.Warn, (info) => console.log(consolePrefix.discord + info));
        this.client.on(Events.Error, console.error);

        this.client.on(Events.VoiceStateUpdate, async (_oldState, _newState): Promise<any> => {
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
    
            const { commandName } = interaction;
            if (commands[commandName as keyof typeof commands]) {
              commands[commandName as keyof typeof commands].execute(interaction);
            }
        });
    }

    private async registerSlashCommands() {
        const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
      
        const commandsDirectory = join(__dirname, "commands");
        const commandFiles = readdirSync(commandsDirectory).filter((file) => !file.endsWith(".map"));
      
        for (const file of commandFiles) {
            if ( file.startsWith('index') ) continue;
            const filePath = `file://${path.resolve(commandsDirectory, file)}`; // Convert to file URL
            const commandData: SlashCommandBuilder = await import(filePath).then(module => module.data);

            console.log(consolePrefix.discord + `\x1b[33mRegistering command: \x1b[0m\x1b[47m\x1b[30m ${commandData.name} \x1b[0m`);
        
            this.slashCommands.push(commandData);
            this.slashCommandsMap.set(commandData.name, commandData);
        }
      
        const regisResult = await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });

        if ( regisResult )
            console.log(consolePrefix.discord + '\x1b[32mRegis Slash commands successfully!\x1b[0m');
        else
            console.log(consolePrefix.discord + '\x1b[31mRegis Slash commands failed :(\x1b[0m');
    }
}