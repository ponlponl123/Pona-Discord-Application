/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires*/
import { Track as PlayerTrack, UnresolvedTrack as PlayerUnresolvedTrack } from "@/interfaces/player";
import * as Interface from '@interfaces/lavaUtils';
import { ClientUser, User } from "discord.js";
import { Manager } from "./manager";

const structures = {
	Player: require('./player').Player,
	Queue: require('./queue').Queue,
	Node: require('./node').Node,
}

interface Track extends PlayerTrack {
    [TRACK_SYMBOL]?: boolean;
}

interface UnresolvedTrack extends PlayerUnresolvedTrack {
    [UNRESOLVED_TRACK_SYMBOL]?: boolean;
}

const TRACK_SYMBOL = Symbol("track"),
	UNRESOLVED_TRACK_SYMBOL = Symbol("unresolved"),
	SIZES = ["0", "1", "2", "3", "default", "mqdefault", "hqdefault", "maxresdefault"];

const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export abstract class TrackUtils {
	static trackPartial: string[] | null = null;
	private static manager: Manager;

	public static init(manager: Manager): void {
		this.manager = manager;
	}

	static setTrackPartial(partial: string[]): void {
		if (!Array.isArray(partial) || !partial.every((str) => typeof str === "string")) throw new Error("Provided partial is not an array or not a string array.");

		const defaultProperties = [
			"encoded",
			"pluginInfo",
			"identifier",
			"isSeekable",
			"author",
			"length",
			"isrc",
			"isStream",
			"title",
			"uri",
			"artworkUrl",
			"sourceName",
		];

		this.trackPartial = Array.from(new Set([...defaultProperties, ...partial]));

		if (!this.trackPartial.includes("track")) this.trackPartial.unshift("track");
	}

	/**
	 * @param trackOrTracks
	 */
	static validate(trackOrTracks: unknown): boolean {
		if (typeof trackOrTracks === "undefined") throw new RangeError("Provided argument must be present.");

		if (Array.isArray(trackOrTracks) && trackOrTracks.length) {
			for (const track of trackOrTracks) {
				if (!(track[TRACK_SYMBOL] || track[UNRESOLVED_TRACK_SYMBOL])) return false;
			}
			return true;
		}

		return (
            (trackOrTracks as Track)[TRACK_SYMBOL] ||
            (trackOrTracks as UnresolvedTrack)[UNRESOLVED_TRACK_SYMBOL] || 
			false
        );
	}

	/**
	 * @param track
	 */
	static isUnresolvedTrack(track: unknown): boolean {
		if (typeof track === "undefined") throw new RangeError("Provided argument must be present.");
		if ( !track ) return false;
		return (track as UnresolvedTrack)[UNRESOLVED_TRACK_SYMBOL] === true;
	}

	/**
	 * @param track
	 */
	static isTrack(track: unknown): boolean {
		if (typeof track === "undefined") throw new RangeError("Provided argument must be present.");
		return (track as Track)[TRACK_SYMBOL] === true;
	}

	/**
	 * @param data
	 * @param requester
	 */
	static build<T = User | ClientUser>(data: Interface.TrackData, requester?: T): Track {
		if (typeof data === "undefined") throw new RangeError('Argument "data" must be present.');

		try {
			const track: Track = {
				track: data.encoded,
				timestamp: data.info.timestamp,
				uniqueId: data.info.uniqueId,
				title: data.info.title,
				cleanTitle: data.info.cleanTitle,
				identifier: data.info.identifier,
				author: data.info.author,
				duration: data.info.length,
				isrc: data.info?.isrc || '',
				isSeekable: data.info.isSeekable,
				isStream: data.info.isStream,
				uri: data.info.uri || '',
				artworkUrl: data.info?.artworkUrl || '',
				sourceName: data.info?.sourceName as Interface.TrackSourceName,
				thumbnail: (data.info.uri as string).includes("youtube") ? `https://img.youtube.com/vi/${data.info.identifier}/default.jpg` : null,
				displayThumbnail(size = "default"): string | '' {
					const finalSize = SIZES.find((s) => s === size) ?? "default";
					return this.uri.includes("youtube") ? `https://img.youtube.com/vi/${data.info.identifier}/${finalSize}.jpg` : '';
				},
				requester: requester as User | ClientUser,
				pluginInfo: data.pluginInfo,
				customData: {},
			};

			track.displayThumbnail = track.displayThumbnail.bind(track);

			if (this.trackPartial) {
				for (const key of Object.keys(this.trackPartial) as (keyof PlayerTrack)[]) {
					if (this.trackPartial.includes(key)) continue;
					delete track[key];
				}
			}

			Object.defineProperty(track, TRACK_SYMBOL, {
				configurable: true,
				value: true,
			});

			return track;
		} catch (error: any) {
			throw new RangeError(`Argument "data" is not a valid track: ${error.message}`);
		}
	}

	/**
	 * @param query
	 * @param requester
	 */
	static buildUnresolved<T = User | ClientUser>(query: string | Interface.UnresolvedQuery, requester?: T): UnresolvedTrack {
		if (typeof query === "undefined") throw new RangeError('Argument "query" must be present.');

		let unresolvedTrack: Partial<UnresolvedTrack> = {
			requester: requester as User | ClientUser,
			async resolve(): Promise<void> {
				const resolved = await TrackUtils.getClosestTrack(this as UnresolvedTrack);
				Object.getOwnPropertyNames(this).forEach((prop: string) => delete this[prop]);
				Object.assign(this, resolved);
			},
		};

		if (typeof query === "string") unresolvedTrack.title = query;
		else unresolvedTrack = { ...unresolvedTrack, ...query };

		Object.defineProperty(unresolvedTrack, UNRESOLVED_TRACK_SYMBOL, {
			configurable: true,
			value: true,
		});

		return unresolvedTrack as UnresolvedTrack;
	}

	static async getClosestTrack(unresolvedTrack: UnresolvedTrack): Promise<Track> {
		if (!TrackUtils.manager) throw new RangeError("Manager has not been initiated.");

		if (!TrackUtils.isUnresolvedTrack(unresolvedTrack)) throw new RangeError("Provided track is not a UnresolvedTrack.");

		const query = unresolvedTrack.uri ? unresolvedTrack.uri : [unresolvedTrack.author, unresolvedTrack.title].filter(Boolean).join(" - ");
		const res = await TrackUtils.manager.search(query, unresolvedTrack.requester);

		if (unresolvedTrack.author) {
			const channelNames = [unresolvedTrack.author, `${unresolvedTrack.author} - Topic`];

			const originalAudio = res.tracks.find((track) => {
				return (
					channelNames.some((name) => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.author)) ||
					new RegExp(`^${escapeRegExp(unresolvedTrack.title)}$`, "i").test(track.title)
				);
			});

			if (originalAudio) return originalAudio;
		}

		if (unresolvedTrack.duration) {
			const sameDuration = res.tracks.find((track) => track.duration >= (unresolvedTrack.duration as number) - 1500 && track.duration <= (unresolvedTrack.duration as number) + 1500);

			if (sameDuration) return sameDuration;
		}

		const finalTrack = res.tracks[0];
		finalTrack.customData = unresolvedTrack.customData as Record<string, unknown>;
		return finalTrack;
	}
}

export abstract class Structure {
	/**
	 * @param name
	 * @param extender
	 */
	public static extend<K extends keyof Interface.Extendable, T extends Interface.Extendable[K]>(name: K, extender: (target: Interface.Extendable[K]) => T): T {
		if (!structures[name]) throw new TypeError(`"${name} is not a valid structure`);
		const extended = extender(structures[name]);
		structures[name] = extended;
		return extended;
	}

	/**
	 * @param name
	 */
	public static get<K extends keyof Interface.Extendable>(name: K): Interface.Extendable[K] {
		const structure = structures[name];
		if (!structure) throw new TypeError('"structure" must be provided.');
		return structure;
	}
}

export class Plugin {
	public load(manager: Manager): void {}

	public unload(manager: Manager): void {}
}