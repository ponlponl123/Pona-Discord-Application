import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { database, ytmusic } from '@/index';

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
            const { t, a } = request.query; // Title and Artist
            if ( !t || !a ) return response.status(400).json({ error: "Missing required parameters" });
            let api_request = `search/${encodeURIComponent(`${queryId}: ${t.toString()} - ${a.toString()}`)}`;
            api_request += '?limit=1';
            if ( type === 'song' )
                api_request += '&filter=songs';
            else if ( type === 'video' )
                api_request += '&filter=videos';
            else return response.status(HttpStatusCode.MethodNotAllowed).json({error: 'Method Not Allowed'});
            const searchResult = await YTMusicAPI('GET', api_request.toString());
            if ( !searchResult || searchResult.data.result.length === 0 ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
            const result = searchResult.data.result[0];
            if (
                (
                    result.resultType === 'song'
                    // && result.album.name === t.toString()
                    // && (result.artists as Array<ArtistBasic>).some(artist => artist.name === a)
                ) ||
                (
                    result.resultType === 'video'
                    // && (result.title as String).includes(t.toString())
                    // && (result.artists as Array<ArtistBasic>).some(artist => artist.name === a)
                )
            ) {
                return response.status(HttpStatusCode.Ok).json({message: 'Ok', result});
            }
            return response.status(HttpStatusCode.NotFound).json({message: 'Not Found', result});
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