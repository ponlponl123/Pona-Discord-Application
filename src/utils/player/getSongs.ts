import { lavalink } from '@/index'
import { GuildMember, User } from 'discord.js';
import { SearchResult } from '@interfaces/manager';
import { Track } from '@interfaces/player';

export interface trackResult {
    tracks: Track[];
    type: 'track' | 'playlist'
}

export default async function getSongs(search: string, author: GuildMember): Promise<string | trackResult> {
    let res: SearchResult;

    try {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        res = await lavalink.manager.search({
            query: search,
            source: 'youtube'
        }, (author.user as User));
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === 'empty') throw res;
        if (res.loadType === 'playlist') {
            return {
                tracks: res.playlist?.tracks as Track[],
                type: 'playlist'
            };
            throw { message: 'Playlists are not supported with this command.' };
        }
    } catch (err: any) {
        return `there was an error while searching: ${err.message}`;
    }

    if (res.loadType === 'error') {
        return 'there was no tracks found with that query.';
    }

    return {
        tracks: res.tracks,
        type: 'track'
    };
}