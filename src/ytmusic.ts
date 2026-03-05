import { Innertube } from "youtubei.js";

export class PonaYTMusicAPI {
    public client!: Innertube;
    private clientPromise: Promise<Innertube>;
    private _ready: boolean = false;

    constructor() {
        this.clientPromise = Innertube.create();
        this.init();
    }

    private async init() {
        this.client = await this.clientPromise;
        this._ready = true;
        console.log('[YTMusic] Innertube client initialized');
    }

    /**
     * Wait for the client to be ready (useful at startup)
     */
    public async waitReady(): Promise<Innertube> {
        if (this._ready) return this.client;
        return this.clientPromise;
    }

    public get ready(): boolean {
        return this._ready;
    }
}