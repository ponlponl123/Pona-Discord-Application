import { Player } from "@lavalink/structures/player";
import { ClientUser, Guild, TextBasedChannel, User, VoiceBasedChannel } from "discord.js";
import { Sizes, TrackSourceName } from "./lavaUtils";

export interface lavaPlayer {
    player: Player;
    voiceChannel: VoiceBasedChannel;
    textChannel: TextBasedChannel;
    guild: Guild;
}

export interface PlayerOptions {
	guild: string;
	textChannel: string;
	voiceChannel?: string;
	node?: string;
	volume?: number;
	selfMute?: boolean;
	selfDeafen?: boolean;
}

export interface Track {
	readonly track: string;
	readonly timestamp: number;
	readonly uniqueId: string;
	readonly artworkUrl: string;
	readonly sourceName: TrackSourceName;
	title: string;
	readonly identifier: string;
	author: string;
	readonly duration: number;
	readonly isrc: string;
	readonly isSeekable: boolean;
	readonly isStream: boolean;
	readonly uri: string;
	readonly thumbnail: string | null;
	readonly requester?: User | ClientUser;
	displayThumbnail(size?: Sizes): string;
	pluginInfo: TrackPluginInfo;
	customData: Record<string, unknown>;
}

export interface TrackPluginInfo {
	albumName?: string;
	albumUrl?: string;
	artistArtworkUrl?: string;
	artistUrl?: string;
	isPreview?: string;
	previewUrl?: string;
}

export interface UnresolvedTrack extends Partial<Track> {
	[key: string]: any;
	title: string;
	author?: string;
	duration?: number;
	resolve(): Promise<void>;
}

export interface PlayOptions {
	readonly startTime?: number;
	readonly endTime?: number;
	readonly noReplace?: boolean;
}

export interface EqualizerBand {
	band: number;
	gain: number;
}