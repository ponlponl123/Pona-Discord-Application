import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database, ytmusic } from '@/index';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection || !ytmusic.client ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { id, type, query } = request.query;
    if ( !id || !type ) return response.status(400).json({ error: "Missing required parameters" });
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const queryId = String(id);

    switch ( type ) {
      case "album": {
        const searchResult = await ytmusic.client.getAlbum(queryId);
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
      }
      case "song": {
        const searchResult = await ytmusic.client.getSong(queryId);
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
      }
      case "video": {
        const searchResult = await ytmusic.client.getVideo(queryId);
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
        return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
      }
      case "artist": {
        if ( !query ) {
          const searchResult = await ytmusic.client.getArtist(queryId);
          if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
          return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
        }
        else
        {
          switch ( query ) {
            case "albums": {
              const searchResult = await ytmusic.client.getArtistAlbums(queryId);
              if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
              return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
            }
            case "songs": {
              const searchResult = await ytmusic.client.getArtistSongs(queryId);
              if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
              return response.status(HttpStatusCode.Ok).json({message: 'Ok', result: searchResult});
            }
            default: {
              return response.status(400).json({ error: 'Invalid query' });
            }
          }
        }
      }
      case "playlist": {
        const searchResult = await ytmusic.client.getPlaylist(queryId);
        if ( !searchResult ) return response.status(HttpStatusCode.NotFound).json({message: 'Not Found'});
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