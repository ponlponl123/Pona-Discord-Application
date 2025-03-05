import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { database, ytmusic } from '@/index';
import { URL } from 'url';

export const path = '/:fetch?';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection || !ytmusic.client ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { fetch } = request.params;
    const { id, type } = request.query;
    if ( !id || !fetch ) return response.status(400).json({ error: "Missing required parameters" });
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const queryId = String(id);

    switch ( fetch ) {
        case "av": {
            const request = new URL(`search/${encodeURIComponent(queryId)}`);
            request.searchParams.append('limit', '1');
            if ( type === 'song' )
                request.searchParams.append('filter', 'songs');
            else if ( type === 'video' )
                request.searchParams.append('filter', 'videos');
            else return response.status(HttpStatusCode.MethodNotAllowed).json({error: 'Method Not Allowed'});
            const searchResult = await YTMusicAPI('GET', request.toString());
            if ( !searchResult || searchResult.data.result.length === 0 ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result[0]});
        }
        case "album": {
            const searchResult = await YTMusicAPI('GET', `album/${encodeURIComponent(queryId)}`);
            if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult.data.result});
        }
        case "artist": {
            const searchResult = await ytmusic.client.getArtist(queryId);
            if ( !searchResult ) response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
        }
        case "playlist": {
            const searchResult = await ytmusic.client.getPlaylist(queryId);
            if ( !searchResult ) response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            const videos = await ytmusic.client.getPlaylistVideos(queryId);
            return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: {...searchResult, videos}});
        }
        default: {
            return response.status(400).json({ error: 'Invalid type' });
        }
    }
  } catch (err) {
    if ( process.env.NODE_ENV === "development" ) return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error', debug: err});
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}