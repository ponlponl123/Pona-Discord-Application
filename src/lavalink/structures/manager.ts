/* eslint-disable no-async-promise-executor */
import {
	Plugin,
	Structure,
	TrackUtils
} from "./utils";
import { Node } from "./node";
import { Player } from "./player";
import managerCheck from "@utils/lavalink/managerCheck";
import { blockedWords } from "@config/blockedWords";
import { Collection } from "@discordjs/collection";
import { ClientUser, User } from "discord.js";
import { EventEmitter } from "events";
import fs from "fs";
import path from "path";

import setVoiceChannelStatus from "@utils/setVoiceChannelStatus";
import { prefix as consolePrefix } from "@/config/console";

import { PlayerOptions, Track } from "@interfaces/player";
import {
	VoiceState,
	VoicePacket,
	VoiceServer,
	TrackData,
	TrackEndEvent
} from "@interfaces/lavaUtils";
import { NodeOptions } from "@interfaces/node";
import {
	LavalinkResponse,
	PlaylistRawData,
	ManagerOptions,
	SearchPlatform,
	ManagerEvents,
	PlaylistData,
	SearchQuery,
	SearchResult
} from "@/interfaces/manager";
import randomString from "@/utils/randomString";

interface LavaPlayer {
	guildId: string;
	track: TrackData | Track;
	volume: number;
	paused: boolean;
	state: {
		time: number;
		position: number;
		connected: boolean;
		ping: number;
	};
	voice: {
		token: string;
		endpoint: string;
		sessionId: string;
	};
	filters: Record<string, unknown>;
}

export class Manager extends EventEmitter {
	private lastSaveTimes: Map<string, number> = new Map();
	private eventBatchInterval: NodeJS.Timeout | null = null;
	private eventBatchDuration: number = 1000;
	private latestPlayerStates: Map<string, Player> = new Map();
	
	public on<T extends keyof ManagerEvents>(event: T, listener: (...args: ManagerEvents[T]) => void): this {
		return super.on(event, listener);
	}

	public static readonly DEFAULT_SOURCES: Record<SearchPlatform, string> = {
		"youtube music": "ytmsearch",
		youtube: "ytsearch",
		spotify: "spsearch",
		jiosaavn: "jssearch",
		soundcloud: "scsearch",
		deezer: "dzsearch",
		tidal: "tdsearch",
		applemusic: "amsearch",
		bandcamp: "bcsearch",
	};

	public readonly players = new Collection<string, Player>();
	public readonly nodes = new Collection<string, Node>();
	public readonly options: ManagerOptions;
	private initiated = false;

	public async loadPlayerStates(nodeId: string): Promise<void> {
		const node = this.nodes.get(nodeId);
		if (!node) throw new Error(`Could not find node: ${nodeId}`);

		const info = (await node.rest.getAllPlayers()) as LavaPlayer[];

		const playerStatesDir = path.join(process.cwd(), "ponaState", "lavalink", "players");

		if (!fs.existsSync(playerStatesDir)) {
			fs.mkdirSync(playerStatesDir, { recursive: true });
			console.log(consolePrefix.lavalink + `Created lavalink states directory at ${playerStatesDir}`);
		}

		const playerFiles = fs.readdirSync(playerStatesDir);

		const createTrackData = ( song: any ): TrackData => ({
			encoded: song.track,
			info: {
				timestamp: song.timestamp,
				uniqueId: song.uniqueId,
				identifier: song.identifier,
				isSeekable: song.isSeekable,
				author: song.author,
				length: song.duration,
				isrc: song.isrc,
				isStream: song.isStream,
				title: song.title,
				uri: song.uri,
				artworkUrl: song.artworkUrl,
				sourceName: song.sourceName,
			},
				pluginInfo: (song.pluginInfo as Record<string, string>),
		});

		for (const file of playerFiles) {
			const filePath = path.join(playerStatesDir, file);
			const data = fs.readFileSync(filePath, "utf-8");
			const state = JSON.parse(data);

			if (state && typeof state === "object" && state.guild && state.node.options.identifier === nodeId) {
				const lavaPlayer = info.find((player) => player.guildId === state.guild);
				if (!lavaPlayer) {
					this.destroy(state.guild);
					continue;
				}
				const playerOptions: PlayerOptions = {
					guild: state.options.guild,
					textChannel: state.options.textChannel,
					voiceChannel: state.options.voiceChannel,
					selfDeafen: state.options.selfDeafen,
					volume: lavaPlayer.volume || state.options.volume,
				};

				this.create(playerOptions);

				const player = this.get(state.options.guild) as Player;
				if (!lavaPlayer.state.connected) {
					try {
						player.connect();
					} catch (error) {
						console.log(consolePrefix.lavalink + error);
						continue;
					}
				}

				const tracks = [];

				if (!lavaPlayer.track) {
					if (state.queue.current !== null) {
						for (const key in state.queue) {
							if (!isNaN(Number(key)) && key !== "current" && key !== "previous" && key !== "manager") {
								const song = state.queue[key];
								tracks.push(TrackUtils.build(createTrackData(song), song.requester));
							}
						}

						if (tracks.length > 0) {
							if (player.state !== "CONNECTED") player.connect();
							player.queue.add(tracks);
							if (!state.paused && player.state === "CONNECTED") player.play();
							else console.log(consolePrefix.lavalink + player.state);
						} else {
							const payload = {
								reason: "finished",
							};
							node.queueEnd(player, state.queue.current, payload as TrackEndEvent);
							continue;
						}
					} else {
						if (state.queue.previous !== null) {
							const payload = {
								reason: "finished",
							};
							node.queueEnd(player, state.queue.previous, payload as TrackEndEvent);
						} else this.destroy(state.guild);
					}
				} else {
					const currentTrack = state.queue.current;
					if ( currentTrack ) {
						tracks.push(TrackUtils.build(createTrackData(currentTrack), currentTrack.requester));

						for (const key in state.queue) {
							if (!isNaN(Number(key)) && key !== "current" && key !== "previous" && key !== "manager") {
								const song = state.queue[key];
								tracks.push(TrackUtils.build(createTrackData(song), song.requester));
							}
						}
						if (player.state !== "CONNECTED") player.connect();
						player.queue.add(tracks);
					}
				}

				if (state.paused) player.pause(true);
				player.setTrackRepeat(state.trackRepeat);
				player.setQueueRepeat(state.queueRepeat);
				if (state.dynamicRepeat) {
					player.setDynamicRepeat(state.dynamicRepeat, state.dynamicLoopInterval._idleTimeout);
				}
				if (state.isAutoplay) {
					player.setAutoplay(state.isAutoplay, state.data.Internal_BotUser);
				}
				console.log(consolePrefix.lavalink + `Loaded lavalink player state for ${state.options.guild}.`);
			}
		}

		console.log(consolePrefix.lavalink + "Restored lavalink states from player files.");
	}

	private getPlayerFilePath(guildId: string): string {
		const playerStateFilePath = path.join(process.cwd(), "ponaState", "lavalink", "players", `${guildId}.json`);
		const configDir = path.dirname(playerStateFilePath);
		if (!fs.existsSync(configDir)) {
			fs.mkdirSync(configDir, { recursive: true });
			console.log(consolePrefix.lavalink + `Created lavalink states directory at: ${configDir}`);
		}
		return playerStateFilePath;
	}

	public savePlayerState(guildId: string): void {
		const playerStateFilePath = this.getPlayerFilePath(guildId);

		const player = this.players.get(guildId);
		if (!player || player.state === "DISCONNECTED" || !player.voiceChannel) return this.cleanupInactivePlayers();
		const serializedPlayer = this.serializePlayer(player) as unknown as Player;
		fs.writeFileSync(playerStateFilePath, JSON.stringify(serializedPlayer, null, 2), "utf-8");

		console.log(consolePrefix.lavalink + `Saved player state to: ${playerStateFilePath} for ${guildId}`);
	}

	private serializePlayer(player: Player): Record<string, unknown> {
		const seen = new WeakSet();

		const serialize = (obj: unknown): unknown => {
			if (obj && typeof obj === "object") {
				if (seen.has(obj)) return;

				seen.add(obj);
			}
			return obj;
		};

		const serializedPlayer = JSON.parse(
			JSON.stringify(player, (key, value) => {
				if (key === "filters" || key === "manager") {
					return null;
				}

				if (key === "queue") {
					return {
						...value,
						current: value.current || null,
					};
				}

				return serialize(value);
			})
		);

		return serializedPlayer;
	}

	private cleanupInactivePlayers(): void {
		const playerStatesDir = path.join(process.cwd(), "ponaState", "lavalink", "players");

		if (!fs.existsSync(playerStatesDir)) {
			fs.mkdirSync(playerStatesDir, { recursive: true });
			console.log(consolePrefix.lavalink + `Created lavalink states directory at ${playerStatesDir}`);
		}

		const playerFiles = fs.readdirSync(playerStatesDir);

		const activeGuildIds = new Set(this.players.keys());

		for (const file of playerFiles) {
			const guildId = path.basename(file, ".json");

			if (!activeGuildIds.has(guildId)) {
				const filePath = path.join(playerStatesDir, file);
				fs.unlinkSync(filePath);
				console.log(consolePrefix.lavalink + `Deleted inactive player file: ${filePath}`);
			}
		}
	}

	private get leastLoadNode(): Collection<string, Node> {
		return this.nodes
			.filter((node) => node.connected)
			.sort((a, b) => {
				const aload = a.stats.cpu ? (a.stats.cpu.lavalinkLoad / a.stats.cpu.cores) * 100 : 0;
				const bload = b.stats.cpu ? (b.stats.cpu.lavalinkLoad / b.stats.cpu.cores) * 100 : 0;
				return aload - bload;
			});
	}

	private get leastPlayersNode(): Collection<string, Node> {
		return this.nodes.filter((node) => node.connected).sort((a, b) => a.stats.players - b.stats.players);
	}

	private get priorityNode(): Node {
		const filteredNodes = this.nodes.filter((node) => node.connected && (node.options.priority as number) > 0);
		const totalWeight = filteredNodes.reduce((total, node) => total + (node.options.priority as number), 0);
		const weightedNodes = filteredNodes.map((node) => ({
			node,
			weight: node.options.priority as number / totalWeight,
		}));
		const randomNumber = Math.random();

		let cumulativeWeight = 0;

		for (const { node, weight } of weightedNodes) {
			cumulativeWeight += weight;
			if (randomNumber <= cumulativeWeight) {
				return node;
			}
		}

		return this.options.useNode === "leastLoad" ? this.leastLoadNode.first() as Node : this.leastPlayersNode.first() as Node;
	}

	public get useableNodes(): Node {
		return this.options.usePriority ? this.priorityNode : this.options.useNode === "leastLoad" ? this.leastLoadNode.first() as Node : this.leastPlayersNode.first() as Node;
	}

	private registerPlayerStateEvents(): void {
		const events: (keyof ManagerEvents)[] = ["playerStateUpdate", "playerDestroy"];
		
		for (const event of events) {
			this.on(event, (...args: any[]) => {
				if (event === "playerStateUpdate") {
					const [oldPlayer, newPlayer] = args;
					this.collectPlayerStateEvent(event, newPlayer);
				} else if (event === "playerDestroy") {
					const [player] = args;
					this.collectPlayerStateEvent(event, player);
				}
			});
		}
	}

	private async collectPlayerStateEvent(event: keyof ManagerEvents, player: Player): Promise<void> {
		if (!player) return; // Ensure player is defined
		if (event === "playerDestroy") {
			this.lastSaveTimes.delete(player.guild);
			this.players.delete(player.guild);
			await setVoiceChannelStatus(`guild-${player.guild}`);
			this.cleanupInactivePlayers();
		} else if (event === "playerStateUpdate") {
			this.latestPlayerStates.set(player.guild, player);
		}

		if (!this.eventBatchInterval) {
			this.eventBatchInterval = setTimeout(() => this.processBatchEvents(), this.eventBatchDuration);
		}
	}

	private processBatchEvents(): void {
		if (this.eventBatchInterval) {
			clearTimeout(this.eventBatchInterval);
			this.eventBatchInterval = null;
		}

		this.latestPlayerStates.forEach((player, guildId) => {
			this.savePlayerState(guildId);
		});

		this.latestPlayerStates.clear();
	}

	constructor(options: ManagerOptions) {
		super();
		this.registerPlayerStateEvents();
		managerCheck(options);

		Structure.get("Player").init(this);
		Structure.get("Node").init(this);
		TrackUtils.init(this);

		if (options.trackPartial) {
			TrackUtils.setTrackPartial(options.trackPartial);
			delete options.trackPartial;
		}

		this.options = {
			plugins: [],
			nodes: [
				{
					identifier: "default",
					host: "localhost",
					resumeStatus: false,
					resumeTimeout: 1000,
				},
			],
			autoPlay: true,
			usePriority: false,
			clientName: "Pona!",
			defaultSearchPlatform: "youtube",
			useNode: "leastPlayers",
			...options,
		}

		if (this.options.plugins) {
			for (const [index, plugin] of this.options.plugins.entries()) {
				if (!(plugin instanceof Plugin)) throw new RangeError(`Plugin at index ${index} does not extend Plugin.`);
				plugin.load(this);
			}
		}

		if (this.options.nodes) {
			for (const nodeOptions of this.options.nodes) new (Structure.get("Node"))(nodeOptions);
		}
	}

	public init(clientId?: string): this {
		if (this.initiated) return this;
		if (typeof clientId !== "undefined") this.options.clientId = clientId;

		if (typeof this.options.clientId !== "string") throw new Error('"clientId" set is not type of "string"');

		if (!this.options.clientId) throw new Error('"clientId" is not set. Pass it in Manager#init() or as a option in the constructor.');

		for (const node of this.nodes.values()) {
			try {
				node.connect();
			} catch (err) {
				this.emit("nodeError", node, err);
			}
		}

		this.initiated = true;
		return this;
	}

	public async search<T = User | ClientUser>(query: string | SearchQuery, requester?: T): Promise<SearchResult> {
		const node = this.useableNodes;
		if (!node) {
			throw new Error("No available nodes.");
		}
		const _query: SearchQuery = typeof query === "string" ? { query } : query;
		const _source = _query.source ? Manager.DEFAULT_SOURCES[this.options.defaultSearchPlatform as SearchPlatform] : _query.source as string;
		let search = _query.query;
		if (!/^https?:\/\//.test(search)) {
			search = `${_source}:${search}`;
		}

		try {
			const res = (await node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent(search)}`)) as LavalinkResponse;
			if (!res) throw new Error("Query not found.");
			let searchData: any[] = [];
			let playlistData: PlaylistRawData | undefined;
			switch (res.loadType) {
				case "search":
					searchData = res.data as TrackData[];
					break;
				case "track":
					searchData = [res.data as TrackData[]];
					break;
				case "playlist":
					playlistData = res.data as PlaylistRawData;
					break;
			}

			const tracks = searchData.map((track: TrackData) => {
				track.info.timestamp = new Date().getTime();
				track.info.uniqueId = randomString(32);
				return TrackUtils.build(track, requester)
			});
			let playlist = null;
			if (res.loadType === "playlist") {
				playlist = {
					name: playlistData!.info.name,
					tracks: playlistData!.tracks.map((track) => {
						track.info.timestamp = new Date().getTime();
						track.info.uniqueId = randomString(32);
						return TrackUtils.build(track, requester)
					}),
					duration: playlistData!.tracks.reduce((acc, cur) => acc + (cur.info.length || 0), 0),
				};
			}

			const result: SearchResult = {
				loadType: res.loadType,
				tracks: tracks,
				playlist: (playlist as PlaylistData),
			}
			if (this.options.replaceYouTubeCredentials) {
				const replaceCreditsURLs = ["youtube.com", "youtu.be"];
				const processTrack = (track: Track) => {
					if (!replaceCreditsURLs.some((url) => track.uri.includes(url))) return track;
					const { cleanTitle, cleanAuthor } = this.parseYouTubeTitle(track.title, track.author);
					track.title = cleanTitle;
					track.author = cleanAuthor;
					return track;
				}
				if (result.loadType === "playlist") (result.playlist as PlaylistData).tracks = (result.playlist as PlaylistData).tracks.map(processTrack);
				else result.tracks = result.tracks.map(processTrack);
			}
			return result;
		} catch (err: any) {
			throw new Error(err);
		}
	}

	private parseYouTubeTitle(title: string, originalAuthor: string): { cleanTitle: string; cleanAuthor: string } {
		const cleanAuthor = originalAuthor.replace("- Topic", "").trim();
		title = title.replace("Topic -", "").trim();

		const escapedBlockedWords = blockedWords.map((word) => this.escapeRegExp(word));
		const blockedWordsPattern = new RegExp(`\\b(${escapedBlockedWords.join("|")})\\b`, "gi");
		title = title.replace(blockedWordsPattern, "").trim();

		title = title
			.replace(/[([{]\s*[)\]}]/g, "")
			.replace(/^[^\w\d]*|[^\w\d]*$/g, "")
			.replace(/\s{2,}/g, " ")
			.trim();
		title = title.replace(/@(\w+)/g, "$1");
		title = this.balanceBrackets(title);

		if (title.includes(" - ")) {
			const [artist, songTitle] = title.split(" - ").map((part) => part.trim());
			if (artist.toLowerCase() === cleanAuthor.toLowerCase() || cleanAuthor.toLowerCase().includes(artist.toLowerCase())) {
				return { cleanAuthor, cleanTitle: songTitle };
			}
			return { cleanAuthor: artist, cleanTitle: songTitle };
		}

		return { cleanAuthor, cleanTitle: title };
	}

	private balanceBrackets(str: string): string {
		const stack: string[] = [];
		const openBrackets = "([{";
		const closeBrackets = ")]}";
		let result = "";

		for (const char of str) {
			if ( openBrackets.includes(char) )
			{
				stack.push(char);
				result += char;
			}
			else if ( closeBrackets.includes(char) )
			{
				if (stack.length > 0 && openBrackets.indexOf(stack[stack.length - 1]) === closeBrackets.indexOf(char))
				{
					stack.pop();
					result += char;
				}
			}
			else
			{
				result += char;
			}
		}

		while (stack.length > 0)
		{
			const lastOpen = stack.pop()!;
			result += closeBrackets[openBrackets.indexOf(lastOpen)];
		}
		return result;
	}

	private escapeRegExp(string: string): string {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	public decodeTracks(tracks: string[]): Promise<TrackData[]> {
		return new Promise(async (resolve, reject) => {
			const node = this.nodes.first();
			if (!node) throw new Error("No available nodes.");
			const res = (await node.rest.post("/v4/decodetracks", JSON.stringify(tracks)).catch((err) => reject(err))) as TrackData[];
			if (!res) return reject(new Error("No data returned from query."));
			return resolve(res);
		});
	}

	public async decodeTrack(track: string): Promise<TrackData> {
		const res = await this.decodeTracks([track]);
		return res[0];
	}

	public create(options: PlayerOptions): Player {
		if (this.players.has(options.guild)) return this.players.get(options.guild) as Player;
		return new (Structure.get("Player"))(options);
	}

	public get(guild: string): Player | undefined {
		return this.players.get(guild);
	}

	public async destroy(guild: string): Promise<void> {
		await setVoiceChannelStatus(`guild-${guild}`);
		this.players.delete(guild);
		this.cleanupInactivePlayers();
	}

	public createNode(options: NodeOptions): Node {
		if (this.nodes.has(options.identifier || options.host)) return this.nodes.get(options.identifier || options.host) as Node;
		return new (Structure.get("Node"))(options);
	}

	public destroyNode(identifier: string): void {
		const node = this.nodes.get(identifier);
		if (!node) return;
		node.destroy();
		this.nodes.delete(identifier);
	}

	public async updateVoiceState(data: VoicePacket | VoiceServer | VoiceState): Promise<void> {
		if ("t" in data && !["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(data.t as string)) return;
		const update = "d" in data ? data.d : data;
		if (!update || (!("token" in update) && !("session_id" in update))) return;
		const player = this.players.get(update.guild_id);
		if (!player) return;
		if ("token" in update) {
			player.voiceState.event = update;
			const {
				sessionId,
				event: { token, endpoint }
			} = player.voiceState;
			await player.node.rest.updatePlayer({
				guildId: player.guild,
				data: {
					voice: {
						token: token,
						endpoint: endpoint,
						sessionId: sessionId as string
					}
				}
			});
			return;
		}
		if (update.user_id !== this.options.clientId) return;
		if (update.channel_id) {
			if (player.voiceChannel !== update.channel_id) this.emit("playerMove", player, player.voiceChannel, update.channel_id);
			player.voiceState.sessionId = update.session_id;
			player.voiceChannel = update.channel_id;
			return;
		}
		this.emit("playerDisconnect", player, player.voiceChannel);
		player.voiceChannel = null;
		player.voiceState = Object.assign({});
		player.destroy();
		return;
	}
}