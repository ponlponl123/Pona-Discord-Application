import { Node } from '@lavalink/structures/node';
import { NodeOptions } from "./node";
import { Track, UnresolvedTrack } from "./player";
import {
    LoadType,
    TrackData,
    TrackEndEvent,
    TrackStartEvent,
    TrackStuckEvent,
    TrackExceptionEvent,
    WebSocketClosedEvent,
    SponsorBlockChaptersLoaded,
    SponsorBlockChapterStarted,
    SponsorBlockSegmentSkipped,
    SponsorBlockSegmentsLoaded
} from "./lavaUtils";
import { Player } from "@lavalink/structures/player";

export type SearchPlatform = "deezer" | "soundcloud" | "youtube music" | "youtube" | "spotify" | "jiosaavn" | "tidal" | "applemusic" | "bandcamp";
export type PlayerStateEventType =
	| "connectionChange"
	| "playerCreate"
	| "playerDestroy"
	| "channelChange"
	| "volumeChange"
	| "pauseChange"
	| "queueChange"
	| "trackChange"
	| "repeatChange"
	| "autoplayChange";

export interface Payload {
	op: number;
	d: {
		guild_id: string;
		channel_id: string | null;
		self_mute: boolean;
		self_deaf: boolean;
	};
}

export interface ManagerOptions {
	usePriority?: boolean;
	useNode?: "leastLoad" | "leastPlayers";
	nodes?: NodeOptions[];
	clientId?: string;
	clientName?: string;
	plugins?: Plugin[];
	autoPlay?: boolean;
	trackPartial?: string[];
	defaultSearchPlatform?: SearchPlatform;
	replaceYouTubeCredentials?: boolean;
	send(id: string, payload: Payload): void;
}

export interface SearchQuery {
	source?: SearchPlatform | string;
	query: string;
}

export interface LavalinkResponse {
	loadType: LoadType;
	data: TrackData[] | PlaylistRawData;
}

export interface SearchResult {
	loadType: LoadType;
	tracks: Track[];
	playlist?: PlaylistData;
}

export interface PlaylistRawData {
	info: {
		name: string;
	};
	pluginInfo: object;
	tracks: TrackData[];
}

export interface PlaylistData {
	name: string;
	duration: number;
	tracks: Track[];
}

export interface ManagerEvents {
	nodeCreate: [node: Node];
	nodeDestroy: [node: Node];
	nodeConnect: [node: Node];
	nodeReconnect: [node: Node];
	nodeDisconnect: [node: Node, reason: { code?: number; reason?: string }];
	nodeError: [node: Node, error: Error];
	nodeRaw: [payload: unknown];
	playerCreate: [player: Player];
	playerDestroy: [player: Player];
	playerStateUpdate: [oldPlayer: Player, newPlayer: Player, changeType: PlayerStateEventType];
	playerMove: [player: Player, initChannel: string, newChannel: string];
	playerDisconnect: [player: Player, oldChannel: string];
	queueEnd: [player: Player, track: Track | UnresolvedTrack, payload: TrackEndEvent];
	socketClosed: [player: Player, payload: WebSocketClosedEvent];
	trackStart: [player: Player, track: Track, payload: TrackStartEvent];
	trackEnd: [player: Player, track: Track, payload: TrackEndEvent];
	trackStuck: [player: Player, track: Track, payload: TrackStuckEvent];
	trackError: [player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent];
	segmentsLoaded: [player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentsLoaded];
	segmentSkipped: [player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentSkipped];
	chapterStarted: [player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChapterStarted];
	chaptersLoaded: [player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChaptersLoaded];
}