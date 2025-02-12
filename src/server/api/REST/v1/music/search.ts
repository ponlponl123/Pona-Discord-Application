import express from 'express';
import { HttpStatusCode } from 'axios';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { database } from '@/index';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection ) return response.status(HttpStatusCode.ServiceUnavailable).json({error: 'Service Unavailable'});
    const { authorization } = request.headers;
    const { search, isSuggestion } = request.params;
    if ( !authorization ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if ( !user ) return response.status(HttpStatusCode.Unauthorized).json({error: 'Unauthorized'});
    if ( isSuggestion === "true" ) {
  
    } else {
  
    }
  } catch {
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}