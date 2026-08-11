import { ClientType, Innertube, Log } from "youtubei.js";

Log.setLevel(Log.Level.ERROR);

export class PonaYTMusicAPI {
    public client!: Innertube;
    private clientPromise: Promise<Innertube>;
    private _ready: boolean = false;

    constructor() {
        this.clientPromise = Innertube.create({ client_type: ClientType.ANDROID_MUSIC, device_category: "mobile" });
        this.init();
    }

    private async init() {
        this.client = await this.clientPromise;
        this.client.session.context.client.clientName = "ANDROID_MUSIC";
        this.client.session.context.client.clientVersion = "9.31.56";
        this.client.session.context.client.osName = "Android";
        this.client.session.context.client.osVersion = "10";
        this.client.session.context.client.platform = "MOBILE";
        this.client.session.context.client.userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36";
        this.client.session.context.client.deviceModel = "Pixel 5";
        this.client.session.context.client.deviceMake = "Google";

        this._ready = true;
        console.log(`[YTMusic] Innertube client initialized (${this.client.session.client_name} ${this.client.session.client_version})`);
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