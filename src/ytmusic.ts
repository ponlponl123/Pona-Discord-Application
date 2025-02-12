import YTMusic from "ytmusic-api";

export class PonaYTMusicAPI {
    public readonly client;
    
    constructor() {
        this.client = new YTMusic();
        this.init();
    }

    private async init () {
        await this.client.initialize();
    }
}