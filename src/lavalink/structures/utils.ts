/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires*/
import { Track as PlayerTrack, UnresolvedTrack as PlayerUnresolvedTrack } from "@/interfaces/player";
import * as Interface from '@interfaces/lavaUtils';
import { ClientUser, User } from "discord.js";
import { Manager } from "./manager";
import { Buffer } from "buffer";
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { parseYouTubeTitle } from "@/utils/parser";
import randomString from "@/utils/randomString";
import { ytmusic } from "@/index";

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
				artist: data.info.artist,
				cleanAuthor: data.info.cleanAuthor,
				duration: data.info.length,
				isrc: data.info?.isrc || '',
				isSeekable: data.info.isSeekable,
				isStream: data.info.isStream,
				uri: data.info.uri || '',
				artworkUrl: data.info?.artworkUrl || '',
				videoInfo: data.info?.videoInfo || undefined,
				accentColor: data.info?.accentColor || '',
				lyrics: data.info?.lyrics || undefined,
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
	// public load(manager: Manager): void {}
	public load(_manager: Manager): void {}

	// public unload(manager: Manager): void {}
	public unload(_manager: Manager): void {}
}

export async function constructTrack<T = User | ClientUser>(track: Interface.TrackData, requester?: T, version: (1 | 2) = 1): Promise<Track> {
	if (
		!track.info.uniqueId ||
		!track.info.timestamp
	)
	{
		const parsed = parseYouTubeTitle(track.info.title, track.info.author);
		track.info.timestamp = new Date().getTime();
		track.info.uniqueId = randomString(32);
		track.info.cleanTitle = parsed.cleanTitle;
		track.info.cleanAuthor = parsed.cleanAuthor;
		switch ( version )
		{
			case 1:
				const searchResult = await ytmusic.client.getVideo(track.info.identifier);
				if ( !searchResult ) break;
				track.info.artist = [{
					id: searchResult.artist.artistId || '',
					name: searchResult.artist.name
				}]
				break;
			case 2:
				const fetchVideoDetail = await YTMusicAPI('GET', `song/${track.info.identifier}`);
				if ( fetchVideoDetail && fetchVideoDetail.status === 200 )
				{
					track.info.artist = [{
						id: (fetchVideoDetail?.data?.result?.videoDetails?.channelId as unknown) as string,
						name: (fetchVideoDetail?.data?.result?.videoDetails?.author as unknown) as string
					}]
				}
				break;
			default:
				break;
		}
	}
	return TrackUtils.build(track, requester);
}

export class LavalinkTrackEncoder {
    static encodeTrack(track: {
        title: string;
        author: string;
        length: number;
        identifier: string;
        uri: string;
        source: string;
        isStream: boolean;
        position?: number;
    }): string {
        const buffers: Uint8Array[] = [];
        
        // 1. Version (4 bits) + Flags (4 bits)
        const version = 3; // Lavalink v3/v4 compatible
        const flags = track.isStream ? 0b0001 : 0;
        const versionByte = new Uint8Array([(version << 4) | flags]);
        buffers.push(versionByte);

        // 2. Strings with UTF-8 and BIG-ENDIAN length
        const writeString = (str: string) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const lengthBuffer = new Uint8Array(2);
            new DataView(lengthBuffer.buffer).setUint16(0, data.length, false); // Big-endian
            return Uint8Array.from([...lengthBuffer, ...data]);
        };

        buffers.push(
            writeString(track.title),
            writeString(track.author),
            writeString(track.identifier),
            writeString(track.uri),
            writeString(track.source)
        );

        // 3. Numbers as BIG-ENDIAN
        const writeLong = (value: number) => {
            const buffer = new Uint8Array(8);
            new DataView(buffer.buffer).setBigUint64(0, BigInt(value), false);
            return buffer;
        };

        buffers.push(
            writeLong(track.length),
            writeLong(track.position || 0)
        );

        // 4. Combine and encode
        const combined = buffers.reduce(
            (acc, buf) => Uint8Array.from([...acc, ...buf]),
            new Uint8Array(0)
        );

        return Buffer.from(combined).toString('base64');
    }
}