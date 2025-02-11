import { Player } from "@lavalink/structures/player";
import { ClientUser, Guild, TextBasedChannel, User, VoiceBasedChannel } from "discord.js";
import { Sizes, TrackSourceName } from "./lavaUtils";
import { Queue } from "@/lavalink";
import { Band } from "@/utils/lavalink/equalizers";

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

export interface TimestampLyrics {
    seconds: number;
    lyrics: string;
}

export type NonTimestampLyrics = string;

export interface Lyric {
    isTimestamp: boolean;
    lyrics: TimestampLyrics[] | NonTimestampLyrics[];
}

export interface Track {
	readonly track: string;
	readonly timestamp: number;
	readonly uniqueId: string;
	readonly artworkUrl: string;
	highResArtworkUrl?: string;
	readonly sourceName: TrackSourceName;
	title: string;
	cleanTitle: string;
	readonly identifier: string;
	author: string;
	cleanAuthor: string;
	readonly duration: number;
	readonly isrc: string;
	readonly isSeekable: boolean;
	readonly isStream: boolean;
	readonly uri: string;
	readonly thumbnail: string | null;
	lyrics?: Lyric;
	readonly requester?: User | ClientUser;
	accentColor?: string;
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

export interface HTTP_PonaRepeatState {
	track: boolean;
	queue: boolean;
	dynamic: boolean;
}

export interface HTTP_PonaCommonState {
	position: number;
	length: number;
	repeat: HTTP_PonaRepeatState;
	volume: number;
	equalizer: Band[];
	paused: boolean;
	playing: boolean;
	isAutoplay: boolean;
	voiceChannel: string;
}

export interface HTTP_PonaCommonStateWithTracks {
	pona: HTTP_PonaCommonState;
	current: Track | UnresolvedTrack | null;
	queue: Queue;
}