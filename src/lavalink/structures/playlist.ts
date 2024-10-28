import { SearchPlatform } from "@/interfaces/manager";

export default interface PonaPlaylist {
    id: string;
    name: string;
    author: string;
    added_date: Date;
    platform: SearchPlatform;
}