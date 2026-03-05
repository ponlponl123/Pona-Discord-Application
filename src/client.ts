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
  VoiceState,
} from 'discord.js';
import { config } from '@config/discord';
import commandIndex from '@commands/index';
import type slashCommand from '@interfaces/command';
import { prefix as consolePrefix, type as consoleType } from '@config/console';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import {
  BaseMessage,
  ClusterClient,
  getInfo,
  messageType,
} from 'discord-hybrid-sharding';
import setVoiceChannelStatus from '@utils/setVoiceChannelStatus';
import { getWelcomeMessage } from '@utils/getWelcomeMessage';
import type GuildSettings from '@interfaces/guildSettings';
import type { Node } from '@/lavalink';
import { getGuildLanguage } from './utils/i18n';
import { database, lavalink } from '@/index';
import { EventEmitter } from 'events';

export type voiceStateChange =
  | 'clientJoined'
  | 'clientLeaved'
  | 'clientSwitched'
  | 'memberJoined'
  | 'memberLeaved'
  | 'memberSwitched';

export interface PonaEvents {
  heartbeat: (client: Client) => void;
  voiceStateUpdate: (
    type: voiceStateChange,
    oldState: VoiceState,
    newState: VoiceState,
  ) => void;
  clientReady: (client: Client) => void;
}

declare interface Pona {
  on<U extends keyof PonaEvents>(event: U, listener: PonaEvents[U]): this;
  emit<U extends keyof PonaEvents>(
    event: U,
    ...args: Parameters<PonaEvents[U]>
  ): boolean;
}

interface ClientWithCluster extends Client {
  cluster?: ClusterClient;
}

class Pona extends EventEmitter {
  public readonly prefix = 'pona!';
  public readonly heartbeatInterval = setInterval(
    () => this.heartbeatEvent(this.client),
    60_000,
  );
  public slashCommands = new Array<ApplicationCommandDataResolvable>();
  public slashCommandsMap = new Collection<string, slashCommand>();
  public ponaId: string;

  constructor(
    public readonly client: ClientWithCluster,
    public readonly needCluster: boolean,
  ) {
    super();
    this.ponaId = String(Date.now());

    if (needCluster) this.client.cluster = new ClusterClient(client);
    this.client.login(config.DISCORD_TOKEN);
    console.log(
      consoleType.info,
      consolePrefix.system,
      '\x1b[33mLogging in discord application...\x1b[0m',
    );

    this.setupCluster();
    this.setupClientEvents();
  }

  private setupCluster() {
    if (!this.client.cluster) return;

    if (this.client.cluster.maintenance) {
      console.log(
        consoleType.info,
        consolePrefix.system,
        `Bot on maintenance mode with ${this.client.cluster.maintenance}`,
      );
    }

    this.client.cluster.on('ready', (client) => {
      console.log(
        consoleType.info,
        consolePrefix.shard,
        consolePrefix.discord,
        `Cluster is ready ${client.id}`,
      );
    });

    this.client.cluster.on('message', (message) => {
      console.log(consoleType.info, consolePrefix.shard, message);
      if ((message as BaseMessage)['_type'] !== messageType.CUSTOM_REQUEST)
        return;
      if ((message as BaseMessage)['alive'])
        (message as BaseMessage)['reply']({ content: 'Yes I am!' });
    });

    setInterval(() => {
      this.client.cluster?.send({ content: 'I am alive as well!' });
    }, 5000);
  }

  private setupClientEvents() {
    this.client.once(Events.ClientReady, async () => {
      if (this.needCluster) {
        try {
          const shardInfo = getInfo();
          const totalGuilds = await this.client.guilds
            .fetch()
            .then((guilds) => guilds.size);
          const maxShards = Math.ceil(totalGuilds / 2500);
          if (shardInfo.TOTAL_SHARDS >= maxShards) {
            console.log(
              consoleType.error,
              consolePrefix.discord,
              '\x1b[31mDiscord exited: Shard total exceeds maximum limit.\x1b[0m',
            );
            return this.client.destroy();
          }
        } catch {
          console.log(
            consoleType.error,
            consolePrefix.discord,
            'An error occurred while fetching shard information.',
          );
        }
      }

      this.client.user?.setStatus('idle');
      console.log(
        consoleType.info,
        consolePrefix.discord,
        `\x1b[32m${this.client.user?.username}#${this.client.user?.discriminator} logged in! \ud83e\udd16\x1b[0m`,
      );
      this.heartbeatEvent(this.client);
      this.emit('clientReady', this.client);
      this.registerSlashCommands();

      lavalink.manager.on('nodeConnect', async (node: Node) => {
        this.client.user?.setStatus('online');
        console.log(
          consoleType.info,
          consolePrefix.lavalink,
          `\x1b[41mNode "${node.options.identifier}(${node.address})" have ${node.manager.players.size} players\x1b[0m`,
        );
        node.manager.players.map(async (player) => {
          console.log(
            consoleType.info,
            consolePrefix.lavalink,
            'Founded player: ' + player.guild,
          );
        });
      });

      lavalink.manager.init(config.DISCORD_CLIENT_ID);
    });

    this.client.on(Events.GuildCreate, async (guild: Guild) => {
      if (guild.systemChannel?.isSendable()) {
        guild.systemChannel.send({
          content: '<:PonaHello:1298343379561877656> Ohalo!',
        });
      }
    });

    this.client.on(Events.MessagePollVoteAdd, (answer, userId) => {
      console.log(
        consoleType.info,
        consolePrefix.discord,
        `\x1b[32mPoll Vote: \x1b[0m\x1b[47m\x1b[30m${answer.poll.message.guildId}\x1b[0m - \x1b[36m${answer.poll.question}\x1b[0m - \x1b[33m${userId}\x1b[0m - \x1b[31m${answer.voteCount}\x1b[0m`,
      );
    });

    this.client.on(Events.Warn, (info) =>
      console.log(consoleType.warn, consolePrefix.discord, info),
    );
    this.client.on(Events.Error, (error) =>
      console.error(consoleType.error, consolePrefix.discord, error),
    );

    this.client.on(
      Events.VoiceStateUpdate,
      async (oldState, newState): Promise<void> => {
        const guildId = oldState?.guild?.id || newState?.guild?.id;
        if (!this.client.user || !oldState.member) return;

        if (oldState.member.user.id === this.client.user.id) {
          await this.handleBotVoiceStateUpdate(oldState, newState, guildId);
        } else {
          this.handleMemberVoiceStateUpdate(oldState, newState, guildId);
        }
      },
    );

    this.client.on(
      Events.InteractionCreate,
      async (interaction): Promise<void> => {
        if (!interaction.isChatInputCommand()) return;
        const command = this.slashCommandsMap.get(interaction.commandName);
        command?.execute(interaction);
      },
    );
  }

  private async handleBotVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState,
    guildId: string,
  ) {
    if (!oldState.channelId && newState.channelId) {
      this.emit('voiceStateUpdate', 'clientJoined', oldState, newState);
      return;
    }

    if (oldState.channelId && !newState.channelId) {
      const currentPlayer = await isPonaInVoiceChannel(oldState.guild.id);
      if (currentPlayer) {
        const prevChannel = (await this.client.channels.fetch(
          oldState.channelId,
        )) as VoiceBasedChannel;
        await setVoiceChannelStatus(prevChannel);
      }
      this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
      return;
    }

    if (
      oldState.channelId &&
      newState.channelId &&
      oldState.channelId !== newState.channelId
    ) {
      const currentPlayer = await isPonaInVoiceChannel(oldState.guild.id);
      if (currentPlayer) {
        const prevChannel = (await this.client.channels.fetch(
          oldState.channelId,
        )) as VoiceBasedChannel;
        const newChannel = (await this.client.channels.fetch(
          newState.channelId,
        )) as VoiceBasedChannel;
        await setVoiceChannelStatus(prevChannel);
        const existPlayer = lavalink.manager.players.filter(
          (p) => p.guild === guildId,
        );
        if (existPlayer.at(0)?.queue?.current) {
          const lang = await getGuildLanguage(oldState.guild.id);
          await setVoiceChannelStatus(
            newChannel,
            `${lang.data.music.state.voiceChannel.status} ${existPlayer.at(0)?.queue.current?.title} ${lang.data.music.play.author} ${existPlayer.at(0)?.queue.current?.author}`,
          );
        }
        this.emit('voiceStateUpdate', 'clientSwitched', oldState, newState);
      }
    }
  }

  private handleMemberVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState,
    guildId: string,
  ) {
    if (!oldState.channelId && newState.channelId) {
      this.emit('voiceStateUpdate', 'memberJoined', oldState, newState);
    } else if (oldState.channelId && !newState.channelId) {
      this.emit('voiceStateUpdate', 'memberLeaved', oldState, newState);
    } else if (
      oldState.channelId &&
      newState.channelId &&
      oldState.channelId !== newState.channelId
    ) {
      this.emit('voiceStateUpdate', 'memberSwitched', oldState, newState);
    }

    const existPlayer = lavalink.manager.players.filter(
      (p) => p.guild === guildId,
    );
    if (
      oldState.channelId &&
      !newState.channelId &&
      oldState.channel &&
      oldState.channel.members.size <= 1 &&
      existPlayer?.size > 0 &&
      existPlayer.at(0)?.voiceChannel === oldState.channelId
    ) {
      existPlayer.at(0)?.destroy();
      this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
    }
  }

  private async registerSlashCommands() {
    if (process.env['AUTO_ROUTE'] !== 'no') {
      const commandsDirectory = join(__dirname, 'commands');
      const commandFiles = readdirSync(commandsDirectory).filter(
        (file) =>
          !file.endsWith('.map') &&
          !file.startsWith('index') &&
          (file.endsWith('.ts') || file.endsWith('.js')),
      );

      for (const file of commandFiles) {
        const filePath = path.resolve(commandsDirectory, file);
        let command: slashCommand;

        try {
          command = await import('file://' + filePath);
        } catch {
          console.warn(
            consoleType.warn,
            consolePrefix.discord,
            'Failed to import ESM module, retrying with MJS',
          );
          try {
            command = await import(filePath);
          } catch (err) {
            console.error(
              consoleType.error,
              consolePrefix.discord,
              `Failed to import command at ${filePath}:`,
              err,
            );
            continue;
          }
        }

        if ('data' in command && 'execute' in command) {
          this.slashCommands.push(command.data.toJSON());
          this.slashCommandsMap.set(command.data.name, command);
          console.log(
            consoleType.info,
            consolePrefix.discord,
            `\x1b[33mRegistering command: \x1b[0m\x1b[47m\x1b[30m ${command.data.name} \x1b[0m`,
          );
        } else {
          console.log(
            consoleType.warn,
            consolePrefix.discord,
            `[WARNING] The command at ${filePath} is missing "data" or "execute" property.`,
          );
        }
      }
    } else {
      for (const command of commandIndex) {
        if ('data' in command && 'execute' in command) {
          this.slashCommands.push(command.data.toJSON());
          this.slashCommandsMap.set(command.data.name, command);
          console.log(
            consoleType.info,
            consolePrefix.discord,
            `\x1b[33mRegistering command: \x1b[0m\x1b[47m\x1b[30m ${command.data.name} \x1b[0m`,
          );
        } else {
          console.log(
            consoleType.warn,
            consolePrefix.discord,
            `[WARNING] Command is missing "data" or "execute" property.`,
          );
        }
      }
    }

    const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);
    const result = await rest.put(
      Routes.applicationCommands(this.client.user!.id),
      { body: this.slashCommands },
    );
    console.log(
      consoleType.info,
      consolePrefix.discord,
      result
        ? '\x1b[32mSlash commands registered successfully!\x1b[0m'
        : '\x1b[31mSlash commands registration failed :(\x1b[0m',
    );
  }

  private async heartbeatEvent(client: Client): Promise<void> {
    if (!client?.user) return;
    const date = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
    );
    console.log(
      consoleType.info,
      consolePrefix.discord,
      `${date.toLocaleString()} Heartbeat interval event received from client`,
    );
    client.user.setActivity({
      name: getWelcomeMessage(),
      type: ActivityType.Custom,
      url: 'https://pona.ponlponl123.com/',
    });
    this.emit('heartbeat', client);
  }

  public async defaultGuildLanguageChangedEvent(
    guildId: string,
  ): Promise<void> {
    if (!lavalink) return;
    const existPlayer = lavalink.manager.players.filter(
      (p) => p.guild === guildId,
    );
    if (existPlayer.size > 0) {
      const lang = await getGuildLanguage(guildId);
      const player = existPlayer.at(0);
      await setVoiceChannelStatus(
        'guild-' + (player?.guild as string),
        `${lang.data.music.state.voiceChannel.status} ${player?.queue?.current?.title} ${lang.data.music.play.author} ${player?.queue?.current?.author}`,
      );
    }
  }

  public async saveGuildSettings(
    guildId: string,
    settings: GuildSettings,
  ): Promise<boolean> {
    if (!guildId || !database?.pool) return false;
    console.log(
      consoleType.info,
      consolePrefix.discord,
      `\x1b[33mSaving guild setting: ${guildId}\x1b[0m`,
    );

    try {
      const rows = (await database.query(
        'SELECT args FROM guilds WHERE guildid = ? LIMIT 1',
        [guildId],
      )) as Array<{ args?: string }>;
      const prevSettings = rows?.[0]?.args ? JSON.parse(rows[0].args) : {};
      const merged = JSON.stringify({ ...prevSettings, ...settings });

      await database.query(
        'INSERT IGNORE INTO guilds (guildid, args) VALUES (?, ?) ON DUPLICATE KEY UPDATE args = ?',
        [guildId, merged, merged],
      );

      if (settings.language)
        await this.defaultGuildLanguageChangedEvent(guildId);

      console.log(
        consoleType.info,
        consolePrefix.discord,
        `\x1b[32mSaved guild setting: ${guildId}\x1b[0m`,
      );
      return true;
    } catch (error) {
      console.error(
        consoleType.error,
        consolePrefix.discord,
        `\x1b[31mFailed to save guild setting: ${guildId}\x1b[0m`,
        error,
      );
      return false;
    }
  }

  public async loadGuildSettings(
    guildId: string,
  ): Promise<GuildSettings | undefined> {
    if (!guildId || !database?.pool) return;
    console.log(
      consoleType.info,
      consolePrefix.discord,
      `\x1b[33mLoading guild setting: ${guildId}\x1b[0m`,
    );

    try {
      const rows = (await database.query(
        'SELECT args FROM guilds WHERE guildid = ? LIMIT 1',
        [guildId],
      )) as Array<{ args?: string }>;
      if (rows?.[0]?.args) return JSON.parse(rows[0].args);
      console.log(
        consoleType.info,
        consolePrefix.discord,
        `\x1b[32mLoaded guild setting: ${guildId}\x1b[0m`,
      );
      return;
    } catch (error) {
      console.error(
        consoleType.error,
        consolePrefix.discord,
        `\x1b[31mFailed to load guild setting: ${guildId}\x1b[0m`,
        error,
      );
      return;
    }
  }
}

export default Pona;
