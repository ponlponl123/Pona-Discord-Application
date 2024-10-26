export interface playOptions {
	guildId: string;
	data: {
		encodedTrack?: string;
		identifier?: string;
		startTime?: number;
		endTime?: number;
		volume?: number;
		position?: number;
		paused?: boolean;
		filters?: object;
		voice?: {
			token: string;
			sessionId: string;
			endpoint: string;
		};
		noReplace?: boolean;
	};
}