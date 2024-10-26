import { lavalink } from '@/index'
import { GuildMember, User } from 'discord.js';
import { SearchResult } from '@interfaces/manager';
import { Track } from '@interfaces/player';

export default async function getSongs(search: string, author: GuildMember): Promise<string | Track[]> {
    let res: SearchResult;

    try {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        res = await lavalink.manager.search(search, (author.user as User));
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === 'empty') throw res;
        if (res.loadType === 'playlist') {
            throw { message: 'Playlists are not supported with this command.' };
        }
    } catch (err: any) {
        return `there was an error while searching: ${err.message}`;
    }

    if (res.loadType === 'error') {
        return 'there was no tracks found with that query.';
    }

    return res.tracks;
}