import { Player } from '@lavalink/structures/player';
import { Queue } from '@lavalink/structures/queue'
import { Node } from '@lavalink/structures/node';
import { NodeStats } from "./node";

export type LoadType = "track" | "playlist" | "search" | "empty" | "error";
export type State = "CONNECTED" | "CONNECTING" | "DISCONNECTED" | "DISCONNECTING" | "DESTROYING";
export type Sizes = "0" | "1" | "2" | "3" | "default" | "mqdefault" | "hqdefault" | "maxresdefault";
export type SponsorBlockSegmentEventType = "SegmentSkipped" | "SegmentsLoaded" | "ChapterStarted" | "ChaptersLoaded";
export type SponsorBlockSegmentEvents = SponsorBlockSegmentSkipped | SponsorBlockSegmentsLoaded | SponsorBlockChapterStarted | SponsorBlockChaptersLoaded;
export type PlayerEvents = TrackStartEvent | TrackEndEvent | TrackStuckEvent | TrackExceptionEvent | WebSocketClosedEvent | SponsorBlockSegmentEvents;
export type PlayerEventType =
	| "TrackStartEvent"
	| "TrackEndEvent"
	| "TrackExceptionEvent"
	| "TrackStuckEvent"
	| "WebSocketClosedEvent"
	| "SegmentSkipped"
	| "SegmentsLoaded"
	| "ChaptersLoaded"
	| "ChapterStarted";
export type TrackEndReason = "finished" | "loadFailed" | "stopped" | "replaced" | "cleanup";
export type TrackSourceName = "deezer" | "spotify" | "soundcloud" | "youtube";
export type Severity = "common" | "suspicious" | "fault";

export interface UnresolvedQuery {
	title: string;
	author?: string;
	duration?: number;
}

export interface TrackData {
	encoded: string;
	info: TrackDataInfo;
	pluginInfo: Record<string, string>;
}

export interface TrackDataInfo {
	identifier: string;
	isSeekable: boolean;
	author: string;
	timestamp: number;
	uniqueId: string;
	length: number;
	isrc?: string;
	isStream: boolean;
	title: string;
	uri?: string;
	artworkUrl?: string;
	sourceName?: TrackSourceName;
}

export interface Extendable {
	Player: typeof Player;
	Queue: typeof Queue;
	Node: typeof Node;
}

export interface VoiceState {
	op: "voiceUpdate";
	guildId: string;
	event: VoiceServer;
	sessionId?: string;
}

export interface VoiceServer {
	token: string;
	guild_id: string;
	endpoint: string;
}

export interface VoiceState {
	guild_id: string;
	user_id: string;
	session_id: string;
	channel_id: string;
}

export interface VoicePacket {
	t?: "VOICE_SERVER_UPDATE" | "VOICE_STATE_UPDATE";
	d: VoiceState | VoiceServer;
}

export interface NodeMessage extends NodeStats {
	type: PlayerEventType;
	op: "stats" | "playerUpdate" | "event";
	guildId: string;
}

export interface PlayerEvent {
	op: "event";
	type: PlayerEventType;
	guildId: string;
}

export interface Exception {
	message: string;
	severity: Severity;
	cause: string;
}

export interface TrackStartEvent extends PlayerEvent {
	type: "TrackStartEvent";
	track: TrackData;
}

export interface TrackEndEvent extends PlayerEvent {
	type: "TrackEndEvent";
	track: TrackData;
	reason: TrackEndReason;
}

export interface TrackExceptionEvent extends PlayerEvent {
	exception?: Exception;
	guildId: string;
	type: "TrackExceptionEvent";
}

export interface TrackStuckEvent extends PlayerEvent {
	type: "TrackStuckEvent";
	thresholdMs: number;
}

export interface WebSocketClosedEvent extends PlayerEvent {
	type: "WebSocketClosedEvent";
	code: number;
	reason: string;
	byRemote: boolean;
}

export interface SponsorBlockSegmentsLoaded extends PlayerEvent {
	type: "SegmentsLoaded";
	segments: {
		category: string;
		start: number;
		end: number;
	}[];
}
export interface SponsorBlockSegmentSkipped extends PlayerEvent {
	type: "SegmentSkipped";
	segment: {
		category: string;
		start: number;
		end: number;
	};
}

export interface SponsorBlockChapterStarted extends PlayerEvent {
	type: "ChapterStarted";
	chapter: {
		name: string;
		start: number;
		end: number;
		duration: number;
	};
}

export interface SponsorBlockChaptersLoaded extends PlayerEvent {
	type: "ChaptersLoaded";
	chapters: {
		name: string;
		start: number;
		end: number;
		duration: number;
	}[];
}

export interface PlayerUpdate {
	op: "playerUpdate";
	guildId: string;
	state: {
		time: number;
		position: number;
		connected: boolean;
		ping: number;
	};
}