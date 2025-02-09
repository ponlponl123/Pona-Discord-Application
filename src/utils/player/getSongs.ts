import { lavalink } from '@/index'
import { GuildMember, User } from 'discord.js';
import { SearchPlatform, SearchResult } from '@interfaces/manager';
import { config as apiServerConf } from '@/config/express';
import PonaPlaylist from '@/lavalink/structures/playlist';
import { Track } from '@interfaces/player';
import axios from 'axios';
import os from 'os';

export interface trackResult {
    tracks: Track[];
    type: 'track' | 'playlist'
}

export default async function getSongs(search: string, searchEngine: SearchPlatform = 'youtube', author: GuildMember): Promise<string | trackResult> {
    let res: SearchResult;

    if ( search.startsWith('https://pona.ponlponl123.com/share/') ) {
        const playlistId = search.replace('https://pona.ponlponl123.com/share/', '');
        try {
            const res = await axios.get(`http://localhost:${apiServerConf.EXPRESS_PORT}/v1/playlist/track?url=${encodeURIComponent(playlistId)}`, {
                headers: {
                    Authorization: `Pona! ${apiServerConf.EXPRESS_SECRET_API_KEY || ''}`,
                    'User-Agent': `Pona! Internal Application (${os.hostname})`,
                    member: author.user.id
                }
            });
            if ( res.status === 404 ) return 'Pona!Share not_found';
            if ( res.status === 401 ) return 'Pona!Share unauthorized';
            if ( res.status !== 200 ) return 'Pona!Share bad_response';
            if ( res.data.tracks && typeof res.data.tracks === 'object' && (res.data.tracks as Array<string>).length > 0 ) {
                const tracks = res.data.tracks as PonaPlaylist[];
                let tracks_results: Track[] = [];
                tracks.forEach(async (track) => {
                    let searchResult: SearchResult;
                    if ( track.platform === 'youtube' || track.platform === 'youtube music' ) {
                        searchResult = await lavalink.manager.search({
                            // query: `https://youtu.be/${track.id}`,
                            query: `https://music.youtube.com/watch?v=${track.id}`,
                            source: 'youtube music'
                        }, (author.user as User));
                    } else {
                        searchResult = await lavalink.manager.search({
                            query: track.name,
                            source: track.platform
                        }, (author.user as User));
                    }
                    if (searchResult.loadType === 'empty') return;
                    tracks_results.push(searchResult.tracks[0]);
                })
                return {
                    tracks: tracks_results,
                    type: 'playlist'
                }
            }
            // there was no tracks include from pona api
            return 'Pona!Share no_tracks';
        } catch (err) {
            return 'Pona!Share service_unavailable';
        }
    }
    try {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        res = await lavalink.manager.search({
            query: search,
            source: searchEngine
        }, (author.user as User));
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === 'empty') throw res;
        if (res.loadType === 'playlist') {
            return {
                tracks: res.playlist?.tracks as Track[],
                type: 'playlist'
            };
            return 'Playlists are not supported with this command.';
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