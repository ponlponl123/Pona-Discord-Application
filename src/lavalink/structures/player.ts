import * as _ from "lodash";
import { Manager } from "./manager";
import { Node, SponsorBlockSegment } from "./node";
import { Structure, TrackUtils } from "./utils";
import { Filters } from "./filters";
import { Queue } from "./queue";

import { LavalinkInfo } from "@interfaces/node";
import * as Interface from '@interfaces/player';
import {
	LavalinkResponse,
	PlaylistData,
	PlaylistRawData,
	SearchQuery,
	SearchResult
} from '@interfaces/manager';
import { State, VoiceState } from '@interfaces/lavaUtils';

import setVoiceChannelStatus from "@utils/setVoiceChannelStatus";
import playerCheck from "@utils/lavalink/playerCheck";
import { ClientUser, Message, User } from "discord.js";

export class Player {
	public readonly queue!: Queue;
	public filters!: Filters;
	public trackRepeat = false;
	public queueRepeat = false;
	public dynamicRepeat = false;
	public position = 0;
	public length = 0;
	public playing = false;
	public paused = false;
	public volume: number = 100;
	public node!: Node;
	public guild: string = '';
	public voiceChannel: string | null = null;
	public textChannel: string | null = null;
	public nowPlayingMessage?: Message;
	public state: State = "DISCONNECTED";
	public bands = new Array<number>(15).fill(0.0);
	public voiceState!: VoiceState;
	public manager: Manager;
	public isAutoplay: boolean = false;
	private static _manager: Manager;
	private readonly data: Record<string, unknown> = {};
	private dynamicLoopInterval!: NodeJS.Timeout;

	public set(key: string, value: unknown): void {
		this.data[key] = value;
	}

	public get<T>(key: string): T {
		return this.data[key] as T;
	}

	public static init(manager: Manager): void {
		this._manager = manager;
	}

	constructor(public options: Interface.PlayerOptions) {
		this.manager = Structure.get("Player")._manager;
		if (!this.manager) throw new RangeError("Manager has not been initiated.");
		if (this.manager.players.has(options.guild)) return this.manager.players.get(options.guild) as Player;

		playerCheck(options);
		this.guild = options.guild;
		this.voiceState = Object.assign({
			op: "voiceUpdate",
			guild_id: options.guild,
		});

		if (options.voiceChannel) this.voiceChannel = options.voiceChannel;
		if (options.textChannel) this.textChannel = options.textChannel;

		const node = this.manager.nodes.get(options.node as string);
		this.node = node || this.manager.useableNodes;
		if (!this.node) throw new RangeError("No available nodes.");

		this.queue = new Queue(this.guild, this.manager);
		this.manager.players.set(options.guild, this);
		this.manager.emit("playerCreate", this);
		this.setVolume(options.volume ?? 100);
		this.filters = new Filters(this);
	}

	public search<T = User | ClientUser>(query: string | SearchQuery, requester?: T): Promise<SearchResult> {
		return this.manager.search(query, requester);
	}

	public connect(): this {
		if (!this.voiceChannel) throw new RangeError("No voice channel has been set.");
		this.state = "CONNECTING";
		const oldPlayer = { ...this };
		this.manager.options.send(this.guild, {
			op: 4,
			d: {
				guild_id: this.guild,
				channel_id: this.voiceChannel,
				self_mute: this.options.selfMute || false,
				self_deaf: this.options.selfDeafen || false,
			},
		});
		this.state = "CONNECTED";
		this.manager.emit("playerStateUpdate", oldPlayer, this, "connectionChange");
		return this;
	}

	public async disconnect(): Promise<this> {
		if (this.voiceChannel === null) return this;
		this.state = "DISCONNECTING";
		const oldPlayer = { ...this };
		this.pause(true);
		this.manager.options.send(this.guild, {
			op: 4,
			d: {
				guild_id: this.guild,
				channel_id: null,
				self_mute: false,
				self_deaf: false,
			},
		});
		await setVoiceChannelStatus(this.voiceChannel);
		this.voiceChannel = null;
		this.state = "DISCONNECTED";
		this.manager.emit("playerStateUpdate", oldPlayer, this, "connectionChange");
		return this;
	}

	public destroy(disconnect = true): void {
		const oldPlayer = { ...this };
		this.state = "DESTROYING";
		if (disconnect) this.disconnect();
		this.node.rest.destroyPlayer(this.guild);
		this.manager.emit("playerDestroy", this);
		this.manager.players.delete(this.guild);
		this.manager.emit("playerStateUpdate", oldPlayer, this, "playerDestroy");
	}

	public setVoiceChannel(channel: string): this {
		if (typeof channel !== "string") throw new TypeError("Channel must be a non-empty string.");
		const oldPlayer = { ...this };
		this.voiceChannel = channel;
		this.connect();
		this.manager.emit("playerStateUpdate", oldPlayer, this, "channelChange");
		return this;
	}

	public setTextChannel(channel: string): this {
		if (typeof channel !== "string") throw new TypeError("Channel must be a non-empty string.");
		const oldPlayer = { ...this };
		this.textChannel = channel;
		this.manager.emit("playerStateUpdate", oldPlayer, this, "channelChange");
		return this;
	}

	public setNowPlayingMessage<T = Message>(message: T): Message {
		if (!message) throw new TypeError("You must provide the message of the now playing message.");
		this.nowPlayingMessage = message as unknown as Message;
		return this.nowPlayingMessage;
	}

	public async play(): Promise<void>;
	public async play(track: Interface.Track | Interface.UnresolvedTrack): Promise<void>;
	public async play(options: Interface.PlayOptions): Promise<void>;
	public async play(track: Interface.Track | Interface.UnresolvedTrack, options: Interface.PlayOptions): Promise<void>;
	public async play(optionsOrTrack?: Interface.PlayOptions | Interface.Track | Interface.UnresolvedTrack, playOptions?: Interface.PlayOptions): Promise<void> {
		if (typeof optionsOrTrack !== "undefined" && TrackUtils.validate(optionsOrTrack)) {
			if (this.queue.current) this.queue.previous = this.queue.current;
			this.queue.current = optionsOrTrack as Interface.Track;
		}
		if (!this.queue.current) throw new RangeError("No current track.");
		const finalOptions = playOptions
			? playOptions
			: ["startTime", "endTime", "noReplace"].every((v) => Object.keys(optionsOrTrack || {}).includes(v))
			? (optionsOrTrack as Interface.PlayOptions)
			: {};
		if (TrackUtils.isUnresolvedTrack(this.queue.current)) {
			try {
				this.queue.current = await TrackUtils.getClosestTrack(this.queue.current as Interface.UnresolvedTrack);
			} catch (error) {
				this.manager.emit("trackError", this, this.queue.current, error);
				if (this.queue[0]) return this.play(this.queue[0]);
				return;
			}
		}
		await this.node.rest.updatePlayer({
			guildId: this.guild,
			data: {
				encodedTrack: this.queue.current?.track,
				...finalOptions,
			},
		});
		Object.assign(this, { position: 0, playing: true });
	}

	public setAutoplay(autoplayState: boolean, botUser: object) {
		if (typeof autoplayState !== "boolean") throw new TypeError("autoplayState must be a boolean.");
		if (typeof botUser !== "object") throw new TypeError("botUser must be a user-object.");
		const oldPlayer = { ...this };
		this.isAutoplay = autoplayState;
		this.set("Internal_BotUser", botUser);
		this.manager.emit("playerStateUpdate", oldPlayer, this, "autoplayChange");
		return this;
	}

	public async getRecommended<T = User | ClientUser>(track: Interface.Track, requester?: T) {
		const node = this.manager.useableNodes;
		if (!node) throw new Error("No available nodes.");

		const hasSpotifyURL = ["spotify.com", "open.spotify.com"].some((url) => track.uri.includes(url));
		const hasYouTubeURL = ["youtube.com", "youtu.be"].some((url) => track.uri.includes(url));

		if (hasSpotifyURL) {
			const res = await node.rest.get(`/v4/info`);
			const info = res as LavalinkInfo;
			const isSpotifyPluginEnabled = info.plugins.some((plugin: { name: string }) => plugin.name === "lavasrc-plugin");
			const isSpotifySourceManagerEnabled = info.sourceManagers.includes("spotify");
			if (isSpotifyPluginEnabled && isSpotifySourceManagerEnabled) {
				const trackID = node.extractSpotifyTrackID(track.uri);
				const artistID = node.extractSpotifyArtistID(track.pluginInfo.artistUrl as string);
				let identifier = "";
				if (trackID && artistID) {
					identifier = `sprec:seed_artists=${artistID}&seed_tracks=${trackID}`;
				} else if (trackID) {
					identifier = `sprec:seed_tracks=${trackID}`;
				} else if (artistID) {
					identifier = `sprec:seed_artists=${artistID}`;
				}
				if (identifier) {
					const recommendedResult = (await node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent(identifier)}`)) as LavalinkResponse;
					if (recommendedResult.loadType === "playlist") {
						const playlistData = recommendedResult.data as PlaylistRawData;
						const recommendedTracks = playlistData.tracks;
						if (recommendedTracks) {
							const tracks = recommendedTracks.map((track) => TrackUtils.build(track, requester));
							return tracks;
						}
					}
				}
			}
		}
		let videoID = track.uri.substring(track.uri.indexOf("=") + 1);
		if (!hasYouTubeURL) {
			const res = await this.manager.search(`${track.author} - ${track.title}`);
			videoID = res.tracks[0].uri.substring(res.tracks[0].uri.indexOf("=") + 1);
		}
		const searchURI = `https://www.youtube.com/watch?v=${videoID}&list=RD${videoID}`;
		const res = await this.manager.search(searchURI);
		if (res.loadType === "empty" || res.loadType === "error") return;
		let tracks = res.tracks;
		if (res.loadType === "playlist") tracks = (res.playlist as PlaylistData).tracks;
		const filteredTracks = tracks.filter((track) => track.uri !== `https://www.youtube.com/watch?v=${videoID}`);
		if (this.manager.options.replaceYouTubeCredentials) {
			for (const track of filteredTracks) {
				track.author = track.author.replace("- Topic", "");
				track.title = track.title.replace("Topic -", "");
				if (track.title.includes("-")) {
					const [author, title] = track.title.split("-").map((str: string) => str.trim());
					track.author = author;
					track.title = title;
				}
			}
		}
		return filteredTracks;
	}

	public setVolume(volume: number): this {
		if (isNaN(volume)) throw new TypeError("Volume must be a number.");
		const oldPlayer = { ...this };
		this.node.rest.updatePlayer({
			guildId: this.options.guild,
			data: {
				volume,
			},
		})
		this.volume = volume;
		this.manager.emit("playerStateUpdate", oldPlayer, this, "volumeChange");
		return this;
	}

	public async setSponsorBlock(segments: SponsorBlockSegment[] = ["sponsor", "selfpromo"]) {
		return this.node.setSponsorBlock(this, segments);
	}

	public async getSponsorBlock() {
		return this.node.getSponsorBlock(this);
	}

	public async deleteSponsorBlock() {
		return this.node.deleteSponsorBlock(this);
	}

	public setTrackRepeat(repeat: boolean): this {
		if (typeof repeat !== "boolean") throw new TypeError('Repeat can only be "true" or "false".');
		const oldPlayer = { ...this };
		if (repeat) {
			this.trackRepeat = true;
			this.queueRepeat = false;
			this.dynamicRepeat = false;
		} else {
			this.trackRepeat = false;
			this.queueRepeat = false;
			this.dynamicRepeat = false;
		}
		this.manager.emit("playerStateUpdate", oldPlayer, this, "repeatChange");
		return this;
	}

	public setQueueRepeat(repeat: boolean): this {
		if (typeof repeat !== "boolean") throw new TypeError('Repeat can only be "true" or "false".');
		const oldPlayer = { ...this };
		if (repeat) {
			this.trackRepeat = false;
			this.queueRepeat = true;
			this.dynamicRepeat = false;
		} else {
			this.trackRepeat = false;
			this.queueRepeat = false;
			this.dynamicRepeat = false;
		}
		this.manager.emit("playerStateUpdate", oldPlayer, this, "repeatChange");
		return this;
	}

	public setDynamicRepeat(repeat: boolean, ms: number): this {
		if (typeof repeat !== "boolean") {
			throw new TypeError('Repeat can only be "true" or "false".');
		}
		if (this.queue.size <= 1) {
			throw new RangeError("The queue size must be greater than 1.");
		}
		const oldPlayer = { ...this };
		if (repeat) {
			this.trackRepeat = false;
			this.queueRepeat = false;
			this.dynamicRepeat = true;

			this.dynamicLoopInterval = setInterval(() => {
				if (!this.dynamicRepeat) return;
				const shuffled = _.shuffle(this.queue);
				this.queue.clear();
				shuffled.forEach((track) => {
					this.queue.add(track);
				});
			}, ms);
		} else {
			clearInterval(this.dynamicLoopInterval);
			this.trackRepeat = false;
			this.queueRepeat = false;
			this.dynamicRepeat = false;
		}
		this.manager.emit("playerStateUpdate", oldPlayer, this, "repeatChange");
		return this;
	}

	public restart(): void {
		if (!this.queue.current?.track) {
			if (this.queue.length) this.play();
			return;
		}
		this.node.rest.updatePlayer({
			guildId: this.guild,
			data: {
				position: 0,
				encodedTrack: this.queue.current?.track,
			},
		});
	}

	public stop(amount?: number): this {
		const oldPlayer = { ...this };
		if (typeof amount === "number" && amount > 1) {
			if (amount > this.queue.length) throw new RangeError("Cannot skip more than the queue length.");
			this.queue.splice(0, amount - 1);
		}
		this.node.rest.updatePlayer({
			guildId: this.guild,
			data: {
				encodedTrack: null,
			},
		});
		this.manager.emit("playerStateUpdate", oldPlayer, this, "trackChange");
		return this;
	}

	public skipto(index: number): this {
		const oldPlayer = { ...this };
		if (index > this.queue.length) throw new RangeError("Cannot skip more than the queue length.");
		if (!this.queue.current) throw new ReferenceError("Cannot get current track.");
		const spliceQueue = this.queue.splice(0, index);
		spliceQueue.map(track => {
			this.queue.add(track);
		})
		this.seek(this.queue.current.duration as number);
		this.manager.emit("playerStateUpdate", oldPlayer, this, "trackChange");
		return this;
	}

	public pause(pause: boolean): this {
		if (typeof pause !== "boolean") throw new RangeError('Pause can only be "true" or "false".');
		if (this.paused === pause || !this.queue.totalSize) return this;
		const oldPlayer = { ...this };
		this.playing = !pause;
		this.paused = pause;
		this.node.rest.updatePlayer({
			guildId: this.guild,
			data: {
				paused: pause,
			},
		})
		this.manager.emit("playerStateUpdate", oldPlayer, this, "pauseChange");
		return this;
	}

	public previous(): this {
		const oldPlayer = { ...this };
		this.queue.unshift(this.queue.previous as Interface.Track | Interface.UnresolvedTrack);
		this.stop();
		this.manager.emit("playerStateUpdate", oldPlayer, this, "trackChange");
		return this;
	}

	public seek(position: number): this | undefined {
		if (!this.queue.current) return undefined;
		position = Number(position);
		if (isNaN(position)) throw new RangeError("Position must be a number.");
		const oldPlayer = { ...this };
		if (position < 0 || position > (this.queue.current.duration as number))
			position = Math.max(Math.min(position, (this.queue.current.duration as number)), 0);
		this.position = position;
		this.node.rest.updatePlayer({
			guildId: this.guild,
			data: {
				position: position,
			},
		})
		this.manager.emit("playerStateUpdate", oldPlayer, this, "trackChange");
		return this;
	}
}