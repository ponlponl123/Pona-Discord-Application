import { Router } from "@/interfaces/router";
import * as v1_cluster from '@server/api/REST/v1/cluster';
import * as v1_guild from '@server/api/REST/v1/guild';
import * as v1_guilds from '@server/api/REST/v1/guilds';
import * as v1_player from '@server/api/REST/v1/player';
import * as v1_playlist from '@server/api/REST/v1/playlist';
import * as v1_queue from '@server/api/REST/v1/queue';
import * as v1_lavalink_handshake from '@server/api/REST/v1/lavalink/handshake';
import * as v1_music_fetch from '@server/api/REST/v1/music/fetch';
import * as v1_music_history from '@server/api/REST/v1/music/history';
import * as v1_music_lyrics from '@server/api/REST/v1/music/lyrics';
import * as v1_music_search from '@server/api/REST/v1/music/search';
import * as v1_proxy_ytThumbnail from '@server/api/REST/v1/proxy/yt-thumbnail';
import * as v1_socket_handshake from '@server/api/REST/v1/socket/handshake';

import * as v2_guilds from '@server/api/REST/v2/guilds';
import * as v2_music_fetch from '@server/api/REST/v2/music/fetch';

export interface RESTAPIRoute {
    name: string;
    version: string;
    controller: Router;
    classname?: string;
}

export const rest_routes: RESTAPIRoute[] = [
    { name: 'cluster', version: 'v1', controller: v1_cluster },
    { name: 'guild', version: 'v1', controller: v1_guild },
    { name: 'guilds', version: 'v1', controller: v1_guilds },
    { name: 'player', version: 'v1', controller: v1_player },
    { name: 'playlist', version: 'v1', controller: v1_playlist },
    { name: 'queue', version: 'v1', controller: v1_queue },
    { name: 'socket', version: 'v1', controller: v1_socket_handshake, classname: 'socket' },
    { name: 'lavalink', version: 'v1', controller: v1_lavalink_handshake, classname: 'lavalink' },
    { name: 'music', version: 'v1', controller: v1_music_fetch, classname: 'music' },
    { name: 'history', version: 'v1', controller: v1_music_history, classname: 'music' },
    { name: 'lyrics', version: 'v1', controller: v1_music_lyrics, classname: 'music' },
    { name: 'search', version: 'v1', controller: v1_music_search, classname: 'music' },
    { name: 'proxy', version: 'v1', controller: v1_proxy_ytThumbnail, classname: 'proxy' },

    { name: 'guilds', version: 'v2', controller: v2_guilds },
    { name: 'music', version: 'v2', controller: v2_music_fetch },
]

export default rest_routes;