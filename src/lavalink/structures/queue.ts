import { ClientUser, User } from "discord.js";
import { Track, UnresolvedTrack } from "@/interfaces/player";
import { TrackUtils } from "./utils";
import { Manager } from "./manager";

export class Queue extends Array<Track | UnresolvedTrack> {
	public current: Track | UnresolvedTrack | null = null;
	public previous: Track | UnresolvedTrack | null = null;
	public manager: Manager;

	public get duration(): number {
		const current = this.current?.duration ?? 0;
		return this.reduce((acc, cur) => acc + (cur.duration || 0), current);
	}
	public get totalSize(): number {
		return this.length + (this.current ? 1 : 0);
	}
	public get size(): number {
		return this.length;
	}
	
	guild: string;

	constructor(guild: string, manager: Manager) {
		super();
		this.manager = manager;
		this.guild = guild;
	}

	public add(track: (Track | UnresolvedTrack) | (Track | UnresolvedTrack)[], offset?: number): void {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		if (!TrackUtils.validate(track)) throw new RangeError('Track must be a "Track" or "Track[]".');

		const addTrack = (t: Track | UnresolvedTrack) => {
			if (!this.some(existingTrack => existingTrack.uniqueId === t.uniqueId)) {
				this.push(t);
			}
		};

		if (!this.current) {
			if (Array.isArray(track)) {
				this.current = track.shift() || null;
				track.forEach(addTrack);
			} else {
				this.current = track;
			}
		} else {
			if (typeof offset !== "undefined" && typeof offset === "number") {
				if (isNaN(offset)) throw new RangeError("Offset must be a number.");
				if (offset < 0 || offset > this.length) throw new RangeError(`Offset must be between 0 and ${this.length}.`);
				if (Array.isArray(track)) track.forEach(t => this.splice(offset, 0, t));
				else this.splice(offset, 0, track);
			} else {
				if (Array.isArray(track)) track.forEach(addTrack);
				else addTrack(track);
			}
		}
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
	}

	public move(from: number, to: number): void {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		if (isNaN(Number(from)) || isNaN(Number(to))) throw new RangeError(`Missing "from" or "to" parameter.`);
		if (from < 1 || to < 1 || from > this.length || to > this.length) throw new RangeError("Invalid start or end values.");
		const movedTrack = this.splice(from - 1, 1)[0];
		this.splice(to - 1, 0, movedTrack);
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
	}

	public remove(position?: number): (Track | UnresolvedTrack)[];
	public remove(start: number, end: number): (Track | UnresolvedTrack)[];
	public remove(startOrPosition = 0, end?: number): (Track | UnresolvedTrack)[] | undefined {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		if (typeof end !== "undefined") {
			if (isNaN(Number(startOrPosition)) || isNaN(Number(end))) throw new RangeError(`Missing "start" or "end" parameter.`);
			if (startOrPosition >= end || startOrPosition >= this.length) throw new RangeError("Invalid start or end values.");
			this.splice(startOrPosition, end - startOrPosition);
			this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
			return;
		}
		this.splice(startOrPosition, 1);
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
		return;
	}

	public clear(): void {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		this.splice(0);
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
	}

	public shuffle(): void {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
	}

	public userBlockShuffle() {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		const userTracks = new Map<string, Array<Track | UnresolvedTrack>>();
		this.forEach((track) => {
			const user = (track.requester as User || ClientUser).id;
			if (!userTracks.has(user)) userTracks.set(user, []);
			const target = userTracks.get(user);
			if ( target ) target.push(track);
		});
		const shuffledQueue: Array<Track | UnresolvedTrack> = [];
		while (shuffledQueue.length < this.length) {
			userTracks.forEach((tracks) => {
				const track = tracks.shift();
				if (track) shuffledQueue.push(track);
			});
		}
		this.splice(0);
		this.add(shuffledQueue);
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
	}

	public roundRobinShuffle() {
		const oldPlayer = { ...this.manager.players.get(this.guild) };
		const userTracks = new Map<string, Array<Track | UnresolvedTrack>>();
		this.forEach((track) => {
			const user = (track.requester as User || ClientUser).id;
			if (!userTracks.has(user)) userTracks.set(user, []);
			const target = userTracks.get(user);
			if ( target ) target.push(track);
		})
		userTracks.forEach((tracks) => {
			for (let i = tracks.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[tracks[i], tracks[j]] = [tracks[j], tracks[i]];
			}
		})
		const shuffledQueue: Array<Track | UnresolvedTrack> = [];
		const users = Array.from(userTracks.keys());
		const userQueues = users.map((user) => userTracks.get(user)!);
		const userCount = users.length;
		while (userQueues.some((queue) => queue.length > 0)) {
			for (let i = 0; i < userCount; i++) {
				const queue = userQueues[i];
				if (queue.length > 0) shuffledQueue.push(queue.shift()!);
			}
		}
		this.splice(0);
		this.add(shuffledQueue);
		this.manager.emit("playerStateUpdate", oldPlayer, this.manager.players.get(this.guild), "queueChange");
	}
}