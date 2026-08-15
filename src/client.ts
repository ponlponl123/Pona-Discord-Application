import {
  Client,
  Guild,
  Events,
  REST,
  Routes,
  ApplicationCommandDataResolvable,
  Collection,
  ActivityType,
  VoiceBasedChannel,
  VoiceState,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
} from 'discord.js';
import { config } from '@config/discord';
import commandIndex from '@commands/index';
import type ApplicationCommandStructure from '@interfaces/command';
import { prefix as consolePrefix } from '@config/console';
import isPonaInVoiceChannel from '@utils/isPonaInVoiceChannel';
import {
  BaseMessage,
  ClusterClient,
  messageType,
} from 'discord-hybrid-sharding';
import setVoiceChannelStatus from '@utils/setVoiceChannelStatus';
import { getWelcomeMessage } from '@utils/getWelcomeMessage';
import type GuildSettings from '@interfaces/guildSettings';
import type { Node } from '@/lavalink';
import { getGuildLanguage } from './utils/i18n';
import { EventEmitter } from 'events';
import { prisma } from './prisma';
import logger from '@/core/logger';
import type LavalinkServer from './lavalink';

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
  public slashCommandsMap = new Collection<string, ApplicationCommandStructure>();
  public ponaId: string;
  private lavalink?: LavalinkServer;

  constructor(
    public readonly client: ClientWithCluster,
    public readonly needCluster: boolean,
  ) {
    super();
    this.ponaId = String(Date.now());

    if (needCluster) this.client.cluster = new ClusterClient(client);
    this.client.login(config.DISCORD_TOKEN);
    logger.info(consolePrefix.system, '\x1b[33mLogging in discord application...\x1b[0m');

    this.setupCluster();
    this.setupClientEvents();
  }

  public setLavalink(lavalink: LavalinkServer) {
    this.lavalink = lavalink;
    this.lavalink.manager.on('nodeConnect', async (node: Node) => {
      this.client.user?.setStatus('online');
      logger.info(consolePrefix.lavalink, `\x1b[41mNode "${node.options.identifier}(${node.address})" connected\x1b[0m`);
    });
    this.lavalink.manager.init(config.DISCORD_CLIENT_ID);
  }

  private setupCluster() {
    if (!this.client.cluster) return;

    this.client.cluster.on('ready', (client) => {
      logger.info(consolePrefix.shard, `Cluster is ready ${client.id}`);
    });

    this.client.cluster.on('message', (message) => {
      if ((message as BaseMessage)['_type'] !== messageType.CUSTOM_REQUEST) return;
      if ((message as BaseMessage)['alive']) (message as BaseMessage)['reply']({ content: 'Yes I am!' });
    });
  }

  private setupClientEvents() {
    this.client.once(Events.ClientReady, async () => {
      this.client.user?.setStatus('idle');
      logger.info(consolePrefix.discord, `\x1b[32m${this.client.user?.username} logged in! \ud83e\udd16\x1b[0m`);
      this.heartbeatEvent(this.client);
      this.emit('clientReady', this.client);
      this.registerSlashCommands();

      // Re-send Opcode 4 (voice channel connect) for restored players now that Discord Gateway is ready
      if (this.lavalink?.manager?.players) {
        for (const player of this.lavalink.manager.players.values()) {
          if (player.voiceChannel) {
            try {
              player.connect();
              this.lavalink.manager.emit('playerStateUpdate', player, player, 'connectionChange');
            } catch (e) {
              logger.error(consolePrefix.lavalink, `Failed to reconnect player for guild ${player.guild}:`, e);
            }
          }
        }
      }
    });

    this.client.on(Events.GuildCreate, async (guild: Guild) => {
      if (guild.systemChannel?.isSendable()) {
        guild.systemChannel.send({ content: '<:PonaHello:1298343379561877656> Ohalo!' });
      }
    });

    this.client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      const guildId = oldState?.guild?.id || newState?.guild?.id;
      if (!this.client.user || !oldState.member || !guildId) return;

      if (oldState.member.user.id === this.client.user.id) {
        await this.handleBotVoiceStateUpdate(oldState, newState, guildId);
      } else {
        await this.handleMemberVoiceStateUpdate(oldState, newState, guildId);
      }
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        const command = this.slashCommandsMap.get(interaction.commandName);
        if (command) {
          try {
            await (command.execute as (i: ChatInputCommandInteraction) => Promise<any>)(interaction);
          } catch (error) {
            logger.error(consolePrefix.discord, `Error executing command ${interaction.commandName}`, error);
          }
        }
      } else if (interaction.isContextMenuCommand()) {
        const command = this.slashCommandsMap.get(interaction.commandName);
        if (command) {
          try {
            await (command.execute as (i: ContextMenuCommandInteraction) => Promise<any>)(interaction);
          } catch (error) {
            logger.error(consolePrefix.discord, `Error executing command ${interaction.commandName}`, error);
          }
        }
      }
    });
  }

  private async handleBotVoiceStateUpdate(oldState: VoiceState, newState: VoiceState, guildId: string) {
    if (!oldState.channelId && newState.channelId) {
      const player = this.lavalink?.manager.get(guildId);
      if (player && player.voiceChannel === newState.channelId) {
        try {
          const channel = (this.client.channels.cache.get(newState.channelId) ||
            await this.client.channels.fetch(newState.channelId).catch(() => null)) as VoiceBasedChannel | null;
          if (channel && channel.members.filter((m) => !m.user.bot).size === 0) {
            player.destroy();
            this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
            return;
          }
        } catch (e) {
          logger.error(consolePrefix.discord, `Error checking members on bot join for guild ${guildId}:`, e);
        }
      }
      this.emit('voiceStateUpdate', 'clientJoined', oldState, newState);
    } else if (oldState.channelId && !newState.channelId) {
      const currentPlayer = await isPonaInVoiceChannel(guildId);
      if (currentPlayer) {
        if (oldState.channelId) {
          const prevChannel = (this.client.channels.cache.get(oldState.channelId) ||
            await this.client.channels.fetch(oldState.channelId).catch(() => null)) as VoiceBasedChannel | null;
          if (prevChannel) await setVoiceChannelStatus(prevChannel);
        }
        if (currentPlayer.state !== 'DESTROYING') {
          currentPlayer.destroy();
        }
      }
      this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
    } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      const currentPlayer = await isPonaInVoiceChannel(guildId);
      if (currentPlayer) {
        if (oldState.channelId) {
          const prevChannel = (this.client.channels.cache.get(oldState.channelId) ||
            await this.client.channels.fetch(oldState.channelId).catch(() => null)) as VoiceBasedChannel | null;
          if (prevChannel) await setVoiceChannelStatus(prevChannel);
        }
        if (newState.channelId) {
          const newChannel = (this.client.channels.cache.get(newState.channelId) ||
            await this.client.channels.fetch(newState.channelId).catch(() => null)) as VoiceBasedChannel | null;
          if (newChannel) {
            const player = this.lavalink?.manager.get(guildId);
            if (player?.queue?.current) {
              const lang = await getGuildLanguage(guildId);
              await setVoiceChannelStatus(newChannel, `${lang.data.music.state.voiceChannel.status} ${player.queue.current.title}`);
            }
            if (newChannel.members.filter((m) => !m.user.bot).size === 0 && player) {
              player.destroy();
              this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
              return;
            }
          }
        }
      }
      this.emit('voiceStateUpdate', 'clientSwitched', oldState, newState);
    }
  }

  private async handleMemberVoiceStateUpdate(oldState: VoiceState, newState: VoiceState, guildId: string) {
    if (!oldState.channelId && newState.channelId) {
      this.emit('voiceStateUpdate', 'memberJoined', oldState, newState);
    } else if (oldState.channelId && !newState.channelId) {
      this.emit('voiceStateUpdate', 'memberLeaved', oldState, newState);
    } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      this.emit('voiceStateUpdate', 'memberSwitched', oldState, newState);
    }

    const player = this.lavalink?.manager.get(guildId);
    if (player && player.voiceChannel) {
      const channelIdToCheck = player.voiceChannel;
      if (oldState.channelId === channelIdToCheck || newState.channelId === channelIdToCheck) {
        try {
          const channel = (this.client.channels.cache.get(channelIdToCheck) ||
            await this.client.channels.fetch(channelIdToCheck).catch(() => null)) as VoiceBasedChannel | null;
          if (channel) {
            const humanMembers = channel.members.filter((m) => !m.user.bot);
            if (humanMembers.size === 0) {
              player.destroy();
              this.emit('voiceStateUpdate', 'clientLeaved', oldState, newState);
            }
          }
        } catch (e) {
          logger.error(consolePrefix.discord, `Error checking channel members for guild ${guildId}:`, e);
        }
      }
    }
  }

  private async registerSlashCommands() {
    for (const command of commandIndex) {
      if ('data' in command && 'execute' in command) {
        this.slashCommands.push(command.data.toJSON());
        this.slashCommandsMap.set(command.data.name, command);
      }
    }

    const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);
    try {
      await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });
      logger.info(consolePrefix.discord, 'Slash commands registered successfully!');
    } catch (error) {
      logger.error(consolePrefix.discord, 'Failed to register slash commands', error);
    }
  }

  private async heartbeatEvent(client: Client): Promise<void> {
    if (!client?.user) return;
    client.user.setActivity({
      name: getWelcomeMessage(),
      type: ActivityType.Custom,
      url: 'https://pona.ponlponl123.com/',
    });
    this.emit('heartbeat', client);
  }

  public async loadGuildSettings(guildId: string): Promise<GuildSettings | undefined> {
    try {
      const row = await prisma.guilds.findUnique({ where: { guildid: guildId }, select: { args: true } });
      if (row?.args) {
        return JSON.parse(row.args) as GuildSettings;
      }
      return undefined;
    } catch (error) {
      logger.error(consolePrefix.discord, `Failed to load guild settings for ${guildId}`, error);
      return undefined;
    }
  }

  public async saveGuildSettings(guildId: string, settings: GuildSettings): Promise<boolean> {
    try {
      const row = await prisma.guilds.findUnique({ where: { guildid: guildId }, select: { args: true } });
      const prevSettings = row?.args ? JSON.parse(row.args) : {};
      const merged = JSON.stringify({ ...prevSettings, ...settings });

      await prisma.guilds.upsert({
        where: { guildid: guildId },
        update: { args: merged },
        create: { guildid: guildId, args: merged },
      });
      return true;
    } catch (error) {
      logger.error(consolePrefix.discord, `Failed to save guild settings for ${guildId}`, error);
      return false;
    }
  }
}

export default Pona;
