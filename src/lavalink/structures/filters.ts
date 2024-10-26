import {
    Band,
    eqPrefix_bassBoost,
    eqPrefix_soft,
    eqPrefix_trebleBass,
    eqPrefix_tvStyle,
    eqPrefix_vaporwave
} from "@utils/lavalink/equalizers";
import { Player } from "./player";

interface timescaleOptions {
	speed?: number;
	pitch?: number;
	rate?: number;
}

interface vibratoOptions {
	frequency: number;
	depth: number;
}

interface rotationOptions {
	rotationHz: number;
}

interface karaokeOptions {
	level?: number;
	monoLevel?: number;
	filterBand?: number;
	filterWidth?: number;
}

interface distortionOptions {
	sinOffset?: number;
	sinScale?: number;
	cosOffset?: number;
	cosScale?: number;
	tanOffset?: number;
	tanScale?: number;
	offset?: number;
	scale?: number;
}

interface availableFilters {
	bassboost: boolean;
	distort: boolean;
	eightD: boolean;
	karaoke: boolean;
	nightcore: boolean;
	slowmo: boolean;
	soft: boolean;
	trebleBass: boolean;
	tv: boolean;
	vaporwave: boolean;
}

export class Filters {
	public distortion: distortionOptions | null;
	public equalizer: Band[];
	public karaoke: karaokeOptions | null;
	public player: Player;
	public rotation: rotationOptions | null;
	public timescale: timescaleOptions | null;
	public vibrato: vibratoOptions | null;
	public volume: number;

	private filterStatus: {
		[key: string]: boolean;
	};

	constructor(player: Player) {
		this.distortion = null;
		this.equalizer = [];
		this.karaoke = null;
		this.player = player;
		this.rotation = null;
		this.timescale = null;
		this.vibrato = null;
		this.volume = 1.0;
		this.filterStatus = {
			bassboost: false,
			distort: false,
			eightD: false,
			karaoke: false,
			nightcore: false,
			slowmo: false,
			soft: false,
			trebleBass: false,
			tv: false,
			vaporwave: false,
		};
	}

	private async update(): Promise<this> {
		const { distortion, equalizer, karaoke, rotation, timescale, vibrato, volume } = this;

		await this.player.node.rest.updatePlayer({
			data: {
				filters: {
					distortion,
					equalizer,
					karaoke,
					rotation,
					timescale,
					vibrato,
					volume,
				},
			},
			guildId: this.player.guild,
		});

		return this;
	}

	private apply<T extends keyof Filters>(filter: { property: T; value: Filters[T] }, update: boolean = true): this {
		this[filter.property] = filter.value as this[T];
		if (update) {
			this.update();
		}
		return this;
	}

	private setStatus(filter: keyof availableFilters, status: boolean): this {
		this.filterStatus[filter] = status;
		return this;
	}

	public setEqualizer(bands?: Band[]): this {
		return this.apply({ property: "equalizer", value: bands as Band[] });
	}

	public eightD(): this {
		return this.setRotation({ rotationHz: 0.2 }).setStatus("eightD", true);
	}

	public bassBoost(): this {
		return this.setEqualizer(eqPrefix_bassBoost).setStatus("bassboost", true);
	}

	public nightcore(): this {
		return this.setTimescale({
			speed: 1.1,
			pitch: 1.125,
			rate: 1.05,
		}).setStatus("nightcore", true);
	}

	public slowmo(): this {
		return this.setTimescale({
			speed: 0.7,
			pitch: 1.0,
			rate: 0.8,
		}).setStatus("slowmo", true);
	}

	public soft(): this {
		return this.setEqualizer(eqPrefix_soft).setStatus("soft", true);
	}

	public tv(): this {
		return this.setEqualizer(eqPrefix_tvStyle).setStatus("tv", true);
	}

	public trebleBass(): this {
		return this.setEqualizer(eqPrefix_trebleBass).setStatus("trebleBass", true);
	}

	public vaporwave(): this {
		return this.setEqualizer(eqPrefix_vaporwave).setTimescale({ pitch: 0.55 }).setStatus("vaporwave", true);
	}

	public distort(): this {
		return this.setDistortion({
			sinOffset: 0,
			sinScale: 0.2,
			cosOffset: 0,
			cosScale: 0.2,
			tanOffset: 0,
			tanScale: 0.2,
			offset: 0,
			scale: 1.2,
		}).setStatus("distort", true);
	}

	public setKaraoke(karaoke?: karaokeOptions): this {
		return this.apply({
			property: "karaoke",
			value: karaoke as karaokeOptions,
		}).setStatus("karaoke", true);
	}

	public setTimescale(timescale?: timescaleOptions): this {
		return this.apply({ property: "timescale", value: timescale as timescaleOptions });
	}

	public setVibrato(vibrato?: vibratoOptions): this {
		return this.apply({ property: "vibrato", value: vibrato as vibratoOptions });
	}

	public setRotation(rotation?: rotationOptions): this {
		return this.apply({ property: "rotation", value: rotation as rotationOptions });
	}

	public setDistortion(distortion?: distortionOptions): this {
		return this.apply({ property: "distortion", value: distortion as distortionOptions });
	}

	public async clear(): Promise<this> {
		this.filterStatus = {
			bassboost: false,
			distort: false,
			eightD: false,
			karaoke: false,
			nightcore: false,
			slowmo: false,
			soft: false,
			trebleBass: false,
			tv: false,
			vaporwave: false,
		};

		this.player.filters = new Filters(this.player);
		this.setEqualizer([]);
		this.setDistortion(undefined);
		this.setKaraoke(undefined);
		this.setRotation(undefined);
		this.setTimescale(undefined);
		this.setVibrato(undefined);

		await this.update();
		return this;
	}

	public getStatus(filter: keyof availableFilters): boolean {
		return this.filterStatus[filter];
	}
}