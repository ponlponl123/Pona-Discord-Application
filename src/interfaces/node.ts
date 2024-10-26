export interface NodeOptions {
	host: string;
	port?: number;
	password?: string;
	secure?: boolean;
	identifier?: string;
	retryAmount?: number;
	retryDelay?: number;
	resumeStatus?: boolean;
	resumeTimeout?: number;
	requestTimeout?: number;
	priority?: number;
}

export interface MemoryStats {
	free: number;
	used: number;
	allocated: number;
	reservable: number;
}

export interface CPUStats {
	cores: number;
	systemLoad: number;
	lavalinkLoad: number;
}

export interface FrameStats {
	sent?: number;
	nulled?: number;
	deficit?: number;
}

export interface NodeStats {
	players: number;
	playingPlayers: number;
	uptime: number;
	memory: MemoryStats;
	cpu: CPUStats;
	frameStats: FrameStats;
}

export interface LavalinkInfo {
	version: {
        semver: string;
        major: number;
        minor: number;
        patch: number;
        preRelease: string
    };
	buildTime: number;
	git: {
        branch: string;
        commit: string;
        commitTime: number
    };
	jvm: string;
	lavaplayer: string;
	sourceManagers: string[];
	filters: string[];
	plugins: {
        name: string;
        version: string
    }[];
}