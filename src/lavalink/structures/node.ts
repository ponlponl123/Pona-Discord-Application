import {
	Structure,
	TrackUtils
} from "./utils";
import { ClientUser } from "discord.js";
import { Manager } from "./manager";
import { Player } from "./player";
import { Rest } from "./rest";
import WebSocket from "ws";
import path from "path";
import fs from "fs";

import { prefix as consolePrefix } from "@/config/console";

import nodeCheck from "@utils/lavalink/nodeCheck";
import { Lyric, Track, UnresolvedTrack } from "@interfaces/player";
import {
	PlayerEvent,
	PlayerEvents,
	TrackEndEvent,
	TrackExceptionEvent,
	TrackStartEvent,
	TrackStuckEvent,
	WebSocketClosedEvent,
	SponsorBlockChapterStarted,
	SponsorBlockChaptersLoaded,
	SponsorBlockSegmentsLoaded,
	SponsorBlockSegmentSkipped,
} from "@interfaces/lavaUtils";
import { LavalinkInfo, NodeOptions, NodeStats } from "@interfaces/node";
import { LavalinkResponse, PlaylistData, PlaylistRawData } from "@/interfaces/manager";
import { config as expressConfig } from "@/config/express";

export const validSponsorBlocks = ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "filler"];
export type SponsorBlockSegment = "sponsor" | "selfpromo" | "interaction" | "intro" | "outro" | "preview" | "music_offtopic" | "filler";

const sessionIdsFilePath = path.join(process.cwd(), "ponaState", "lavalink", "sessionIds.json");
let sessionIdsMap: Map<string, string> = new Map();

const configDir = path.dirname(sessionIdsFilePath);
if (!fs.existsSync(configDir)) {
	fs.mkdirSync(configDir, { recursive: true });
	console.log(consolePrefix.lavalink + `Created lavalink states directory at ${configDir}`);
}

export class Node {
	public socket: WebSocket | null = null;
	public stats: NodeStats;
	public manager!: Manager;
	public sessionId: string | null;
	public readonly rest: Rest;
	private static _manager: Manager;
	private reconnectTimeout?: NodeJS.Timeout;
	private reconnectAttempts = 1;
	public info: LavalinkInfo | null = null;
	
	public get connected(): boolean {
		if (!this.socket) return false;
		return this.socket.readyState === WebSocket.OPEN;
	}

	public get address(): string {
		return `${this.options.host}:${this.options.port}`;
	}

	public static init(manager: Manager): void {
		this._manager = manager;
	}

	constructor(public options: NodeOptions) {
		if (!this.manager) this.manager = Structure.get("Node")._manager;
		if (!this.manager) throw new RangeError("Manager has not been initiated.");

		const getExistNode = this.manager.nodes.get(options.identifier || options.host) as Node;
		if (getExistNode) {
			this.stats = getExistNode.stats;
			this.sessionId = getExistNode.sessionId;
			this.rest = getExistNode.rest;
			return this.manager.nodes.get(options.identifier || options.host) as Node;
		}

		nodeCheck(options);

		this.options = {
			port: 2333,
			password: "youshallnotpass",
			secure: false,
			retryAmount: 30,
			retryDelay: 60000,
			priority: 0,
			...options,
		};

		if (this.options.secure) {
			this.options.port = 443;
		}

		this.options.identifier = options.identifier || options.host;
		this.stats = {
			players: 0,
			playingPlayers: 0,
			uptime: 0,
			memory: {
				free: 0,
				used: 0,
				allocated: 0,
				reservable: 0,
			},
			cpu: {
				cores: 0,
				systemLoad: 0,
				lavalinkLoad: 0,
			},
			frameStats: {
				sent: 0,
				nulled: 0,
				deficit: 0,
			},
		};

		this.sessionId = null;

		this.manager.nodes.set(this.options.identifier, this);
		this.manager.emit("nodeCreate", this);
		this.rest = new Rest(this);

		this.createSessionIdsFile();
		this.loadSessionIds();
	}

	public createSessionIdsFile(): void {
		if (!fs.existsSync(sessionIdsFilePath)) {
			fs.writeFileSync(sessionIdsFilePath, JSON.stringify({}), "utf-8");
			console.log(consolePrefix.lavalink + `Created lavalink sessionIds.json at ${sessionIdsFilePath}`);
		}
	}

	public loadSessionIds(): void {
		if (fs.existsSync(sessionIdsFilePath)) {
			const sessionIdsData = fs.readFileSync(sessionIdsFilePath, "utf-8");
			sessionIdsMap = new Map(Object.entries(JSON.parse(sessionIdsData)));
			console.log(consolePrefix.lavalink + `Loaded lavalink session IDs from JSON file`);
		}
	}

	public updateSessionId(): void {
		sessionIdsMap.set(this.options.identifier as string, this.sessionId as string);
		fs.writeFileSync(sessionIdsFilePath, JSON.stringify(Object.fromEntries(sessionIdsMap)));
		console.log(consolePrefix.lavalink + `Updated lavalink sessionId for ${this.options.identifier} to ${this.sessionId}`);
	}

	public connect(): void {
		if (this.connected) return;

		const headers: { [key: string]: string | undefined } = {
				Authorization: this.options.password,
				"User-Id": this.manager.options.clientId,
				"Client-Name": this.manager.options.clientName,
		};

		if (this.sessionId) {
			headers["Session-Id"] = this.sessionId;
		} else if (this.options.resumeStatus && sessionIdsMap.has(this.options.identifier as string)) {
			this.sessionId = sessionIdsMap.get(this.options.identifier as string) || null;
			headers["Session-Id"] = this.sessionId as string;
			console.log(consolePrefix.lavalink + `Resuming lavalink session with Id: ${this.sessionId}`);
		}

		this.socket = new WebSocket(`ws${this.options.secure ? "s" : ""}://${this.address}/v4/websocket`, { headers });
		this.socket.on("open", this.open.bind(this));
		this.socket.on("close", this.close.bind(this));
		this.socket.on("message", this.message.bind(this));
		this.socket.on("error", this.error.bind(this));
	}

	public destroy(): void {
		if (!this.connected || !this.socket) return;

		const players = this.manager.players.filter((p) => p.node == this);
		if (players.size) players.forEach((p) => p.destroy());

		this.socket.close(1000, "destroy");
		this.socket.removeAllListeners();
		this.socket = null;

		this.reconnectAttempts = 1;
		clearTimeout(this.reconnectTimeout);

		this.manager.emit("nodeDestroy", this);
		this.manager.destroyNode(this.options.identifier as string);
	}

	private reconnect(): void {
		this.reconnectTimeout = setTimeout(() => {
			if (this.reconnectAttempts >= (this.options.retryAmount as number)) {
				const error = new Error(`Unable to connect after ${this.options.retryAmount} attempts.`);

				this.manager.emit("nodeError", this, error);
				return this.destroy();
			}
			this.socket?.removeAllListeners();
			this.socket = null;
			this.manager.emit("nodeReconnect", this);
			this.connect();
			this.reconnectAttempts++;
		}, this.options.retryDelay);
	}

	protected open(): void {
		if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
		this.manager.emit("nodeConnect", this);
	}

	protected close(code: number, reason: string): void {
		this.manager.emit("nodeDisconnect", this, { code, reason });
		if (code !== 1000 || reason !== "destroy") this.reconnect();
	}

	protected error(error: Error): void {
		if (!error) return;
		this.manager.emit("nodeError", this, error);
	}

	protected async message(d: Buffer | string): Promise<void> {
		if (Array.isArray(d)) d = Buffer.concat(d);
		else if (d instanceof ArrayBuffer) d = Buffer.from(d);

		const payload = JSON.parse(d.toString());

		if (!payload.op) return;
		this.manager.emit("nodeRaw", payload);

		let player: Player;

		switch (payload.op) {
			case "stats":
				delete payload.op;
				this.stats = { ...payload } as unknown as NodeStats;
				break;
			case "playerUpdate":
				player = this.manager.players.get(payload.guildId) as Player;
				if (player) {
					player.position = payload.state.position || 0;
					this.manager.emit("trackPos", player.guild, player.position);
				}
				break;
			case "event":
				this.handleEvent(payload);
				break;
			case "ready":
				(this.rest as Rest).setSessionId(payload.sessionId);
				this.sessionId = payload.sessionId;
				this.updateSessionId(); // Call to update session ID
				this.info = await this.fetchInfo();
				// Log if the session was resumed successfully
				if (payload.resumed) {
					console.log(consolePrefix.lavalink + `Lavalink Session resumed for ${this.options.identifier} successfully.`);

					// Load player states from the JSON file
					await this.manager.loadPlayerStates(this.options.identifier as string);
				}

				if (this.options.resumeStatus) {
					(this.rest as Rest).patch(`/v4/sessions/${this.sessionId}`, {
						resuming: this.options.resumeStatus,
						timeout: this.options.resumeTimeout,
					});
				}
				break;
			default:
				this.manager.emit("nodeError", this, new Error(`Unexpected payload op "${payload.op}" with data: ${payload.message}`));
				return;
		}
	}

	protected async handleEvent(payload: PlayerEvent & PlayerEvents): Promise<void> {
		if (!payload.guildId) return;

		const player = this.manager.players.get(payload.guildId);
		if (!player) return;

		const track = player.queue.current;
		const type = payload.type;

		let error: Error;
		switch (type) {
			case "TrackStartEvent":
				this.trackStart(player, track as Track, payload);
				break;

			case "TrackEndEvent":
				if (player?.nowPlayingMessage && player?.nowPlayingMessage.deletable) {
					await player?.nowPlayingMessage?.delete().catch(() => {});
				}

				this.trackEnd(player, track as Track, payload);
				break;

			case "TrackStuckEvent":
				this.trackStuck(player, track as Track, payload);
				break;

			case "TrackExceptionEvent":
				this.trackError(player, track as Track, payload);
				break;

			case "WebSocketClosedEvent":
				this.socketClosed(player, payload);
				break;

			case "SegmentsLoaded":
				this.sponsorBlockSegmentLoaded(player, player.queue.current as Track, payload);
				break;
			case "SegmentSkipped":
				this.sponsorBlockSegmentSkipped(player, player.queue.current as Track, payload);
				break;
			case "ChaptersLoaded":
				this.sponsorBlockChaptersLoaded(player, player.queue.current as Track, payload);
				break;
			case "ChapterStarted":
				this.sponsorBlockChapterStarted(player, player.queue.current as Track, payload);
				break;

			default:
				error = new Error(`Node#event unknown event '${type}'.`);
				this.manager.emit("nodeError", this, error);
				break;
		}
	}

	protected async trackStart(player: Player, track: Track, payload: TrackStartEvent): Promise<void> {
		const oldPlayer = player;
		player.playing = true;
		player.paused = false;
		const accentColor = '';
		const highResArtworkUrl = await fetch(`http://localhost:${expressConfig.EXPRESS_PORT}/v1/proxy/yt-thumbnail/${track.identifier}/highres?endpoint=true`, {
			headers: {
				'Authorization': `Pona! ${expressConfig.EXPRESS_SECRET_API_KEY}`,
			}
		});
		const parsed_highResArtwork = (await highResArtworkUrl.json()).endpoint;
		track.accentColor = accentColor;
		track.highResArtworkUrl = parsed_highResArtwork || '';
		this.manager.emit("trackStart", player, track, payload);
		this.manager.emit("playerStateUpdate", oldPlayer, player, "trackChange");
	}

	protected async trackEnd(player: Player, track: Track, payload: TrackEndEvent): Promise<void> {
		const { reason } = payload;
		const oldPlayer = player;

		if (["loadFailed", "cleanup"].includes(reason))
			this.handleFailedTrack(player, track, payload);
		else if (reason === "replaced") {
			this.manager.emit("trackEnd", player, track, payload);
			player.queue.previous = player.queue.current;
		}
		else if (track && (player.trackRepeat || player.queueRepeat)) 
			this.handleRepeatedTrack(player, track, payload);
		else if (player.queue.length) 
			this.playNextTrack(player, track, payload);
		else await this.queueEnd(player, track, payload);
		this.manager.emit("playerStateUpdate", oldPlayer, player, "trackChange");
	}

	public extractSpotifyTrackID(url: string): string | null {
		const regex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

	public extractSpotifyArtistID(url: string): string | null {
		const regex = /https:\/\/open\.spotify\.com\/artist\/([a-zA-Z0-9]+)/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

	private async handleAutoplay(player: Player, track: Track) {
		const previousTrack = player.queue.previous;
		if (!player.isAutoplay || !previousTrack) return;

		const hasSpotifyURL = ["spotify.com", "open.spotify.com"].some((url) => (previousTrack.uri as string).includes(url));
		if (hasSpotifyURL) {
			const spotifySuccess = await this.handleSpotifyAutoplay(player);
			if (spotifySuccess) return;
		}

		const hasYouTubeURL = ["youtube.com", "youtu.be"].some((url) => (previousTrack.uri as string).includes(url));
		let videoID = (previousTrack.uri as string).substring((previousTrack.uri as string).indexOf("=") + 1);
		if (!hasYouTubeURL) {
			const res = await player.search(`${previousTrack.author} - ${previousTrack.title}`, player.get("Internal_BotUser") as ClientUser);
			videoID = res.tracks[0].uri.substring(res.tracks[0].uri.indexOf("=") + 1);
		}

		let randomIndex: number;
		let searchURI: string;

		do {
			randomIndex = Math.floor(Math.random() * 23) + 2;
			searchURI = `https://www.youtube.com/watch?v=${videoID}&list=RD${videoID}&index=${randomIndex}`;
		} while (track.uri.includes(searchURI));

		const res = await player.search(searchURI, player.get("Internal_BotUser") as ClientUser);
		if (res.loadType === "empty" || res.loadType === "error") return;

		let tracks = res.tracks;
		if (res.loadType === "playlist") tracks = (res.playlist as PlaylistData).tracks;
		const foundTrack = tracks.sort(() => Math.random() - 0.5).find((shuffledTrack: any) => shuffledTrack.uri !== track.uri);

		if (!foundTrack) return;
		if (this.manager.options.replaceYouTubeCredentials) {
			foundTrack.author = foundTrack.author.replace("- Topic", "");
			foundTrack.title = foundTrack.title.replace("Topic -", "");
			if (foundTrack.title.includes("-")) {
				const [author, title] = foundTrack.title.split("-").map((str: string) => str.trim());
				foundTrack.author = author;
				foundTrack.title = title;
			}
		}

		player.queue.add(foundTrack);
		player.play();
	}

	private async handleSpotifyAutoplay(player: Player): Promise<boolean> {
		const previousTrack = player.queue.previous;
		const node = this.manager.useableNodes;
		const isSpotifyPluginEnabled = (node.info as LavalinkInfo).plugins.some((plugin: { name: string }) => plugin.name === "lavasrc-plugin");
		const isSpotifySourceManagerEnabled = (node.info as LavalinkInfo).sourceManagers.includes("spotify");
		if (!isSpotifySourceManagerEnabled || !isSpotifyPluginEnabled || !previousTrack) return false;

		const trackID = this.extractSpotifyTrackID(previousTrack.uri as string);
		const artistID = this.extractSpotifyArtistID(previousTrack.pluginInfo?.artistUrl as string);
		let identifier = [trackID && `seed_tracks=${trackID}`, artistID && `seed_artists=${artistID}`].filter(Boolean).join("&");
		if (identifier) identifier = `sprec:${identifier}`;
		if (!identifier) return false;

		const recommendedResult = (await (node.rest as Rest).get(`/v4/loadtracks?identifier=${encodeURIComponent(identifier)}`)) as LavalinkResponse;
		if (recommendedResult.loadType !== "playlist") return false;

		const playlistData = recommendedResult.data as PlaylistRawData;
		const recommendedTrack = playlistData.tracks[0];
		if (!recommendedTrack) return false;

		player.queue.add(TrackUtils.build(recommendedTrack, player.get("Internal_BotUser") as ClientUser));
		player.play();

		return true;
	}

	private handleFailedTrack(player: Player, track: Track, payload: TrackEndEvent): void {
		player.queue.previous = player.queue.current;
		player.queue.current = player.queue.shift() as Track | UnresolvedTrack;

		if (!player.queue.current) {
			this.queueEnd(player, track, payload);
			return;
		}

		this.manager.emit("trackEnd", player, track, payload);
		if (this.manager.options.autoPlay) player.play();
	}

	private handleRepeatedTrack(player: Player, track: Track, payload: TrackEndEvent): void {
		const { queue, trackRepeat, queueRepeat } = player;
		const { autoPlay } = this.manager.options;
		
		if ( !queue.current ) return;
		if (trackRepeat) queue.unshift(queue.current);
		if (queueRepeat) queue.add(queue.current);

		queue.previous = queue.current;
		queue.current = queue.shift() as Track | UnresolvedTrack;
		this.manager.emit("trackEnd", player, track, payload);
		if (payload.reason === "stopped" && !(queue.current = queue.shift() as Track | UnresolvedTrack)) {
			this.queueEnd(player, track, payload);
			return;
		}
		if (autoPlay) player.play();
	}

	private playNextTrack(player: Player, track: Track, payload: TrackEndEvent): void {
		player.queue.previous = player.queue.current;
		player.queue.current = player.queue.shift() as Track | UnresolvedTrack;

		this.manager.emit("trackEnd", player, track, payload);
		if (this.manager.options.autoPlay) player.play();
	}

	public async queueEnd(player: Player, track: Track, payload: TrackEndEvent): Promise<void> {
		player.queue.previous = player.queue.current;
		player.queue.current = null;

		if (!player.isAutoplay) {
			player.queue.previous = player.queue.current;
			player.queue.current = null;
			player.playing = false;
			this.manager.emit("queueEnd", player, track, payload);
			return;
		}

		await this.handleAutoplay(player, track);
	}

	protected trackStuck(player: Player, track: Track, payload: TrackStuckEvent): void {
		player.stop();
		this.manager.emit("trackStuck", player, track, payload);
	}

	protected trackError(player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent): void {
		player.stop();
		this.manager.emit("trackError", player, track, payload);
	}

	protected socketClosed(player: Player, payload: WebSocketClosedEvent): void {
		this.manager.emit("socketClosed", player, payload);
	}

	private sponsorBlockSegmentLoaded(player: Player, track: Track, payload: SponsorBlockSegmentsLoaded) {
		return this.manager.emit("segmentsLoaded", player, track, payload);
	}

	private sponsorBlockSegmentSkipped(player: Player, track: Track, payload: SponsorBlockSegmentSkipped) {
		return this.manager.emit("segmentSkipped", player, track, payload);
	}

	private sponsorBlockChaptersLoaded(player: Player, track: Track, payload: SponsorBlockChaptersLoaded) {
		return this.manager.emit("chaptersLoaded", player, track, payload);
	}

	private sponsorBlockChapterStarted(player: Player, track: Track, payload: SponsorBlockChapterStarted) {
		return this.manager.emit("chapterStarted", player, track, payload);
	}
	
	public async fetchInfo() {
		return (await (this.rest as Rest).get(`/v4/info`)) as LavalinkInfo;
	}

	public async getSponsorBlock(player: Player): Promise<SponsorBlockSegment[]> {
		if (!(this.info as LavalinkInfo).plugins.some((plugin: { name: string }) => plugin.name === "sponsorblock-plugin"))
			throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.options.identifier}`);

		return (await (this.rest as Rest).get(`/v4/sessions/${this.sessionId}/players/${player.guild}/sponsorblock/categories`)) as SponsorBlockSegment[];
	}

	public async setSponsorBlock(player: Player, segments: SponsorBlockSegment[] = ["sponsor", "selfpromo"]): Promise<void> {
		if (!(this.info as LavalinkInfo).plugins.some((plugin: { name: string }) => plugin.name === "sponsorblock-plugin"))
			throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.options.identifier}`);
		if (!segments.length) throw new RangeError("No Segments provided. Did you mean to use 'deleteSponsorBlock'?");
		if (segments.some((v) => !validSponsorBlocks.includes(v.toLowerCase())))
			throw new SyntaxError(`You provided a sponsorblock which isn't valid, valid ones are: ${validSponsorBlocks.map((v) => `'${v}'`).join(", ")}`);

		await (this.rest as Rest).put(`/v4/sessions/${this.sessionId}/players/${player.guild}/sponsorblock/categories`, JSON.stringify(segments.map((v) => v.toLowerCase())));
		return;
	}

	public async deleteSponsorBlock(player: Player): Promise<void> {
		if (!(this.info as LavalinkInfo).plugins.some((plugin: { name: string }) => plugin.name === "sponsorblock-plugin"))
			throw new RangeError(`there is no sponsorblock-plugin available in the lavalink node: ${this.options.identifier}`);

		await (this.rest as Rest).delete(`/v4/sessions/${this.sessionId}/players/${player.guild}/sponsorblock/categories`);
		return;
	}
}