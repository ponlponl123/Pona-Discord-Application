import express from 'express';
import { HttpStatusCode } from 'axios';
import { database, redisClient } from '@/index';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { IsValidChannel } from '@/utils/ytmusic-api/getChannel';

export async function GET(request: express.Request, response: express.Response) {
  try {
    if (!database || !database.connection)
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    const { authorization } = request.headers;
    const { c } = request.query;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const channelId = String(c);
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !channelId || !(await IsValidChannel(channelId)) )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid channelId' });
    if ( redisClient?.redis )
    {
      const value = await redisClient.redis.hget(`user:${user.id}:subscribe`,channelId);
      if ( value && Number(value) )
        return response.status(HttpStatusCode.Ok).json({message: value==='1'?'Subscribed':'Unsubscribed', state: Number(value)});
    }
    const value = await database.connection.query(
      `SELECT uid, target FROM subscribe_artist WHERE uid=? AND target=?`,
      [user.id, channelId]
    );
    if ( value && value.length > 0 )
    {
      if ( redisClient?.redis )
        redisClient.redis.hset(`user:${user.id}:subscribe`,channelId,1),redisClient.redis.expire(`user:${user.id}:subscribe`,86400);
      return response.status(HttpStatusCode.Ok).json({ message: 'Subscribed', state: 1 });
    }
    if ( redisClient?.redis )
      redisClient.redis.hset(`user:${user.id}:subscribe`,channelId,0),redisClient.redis.expire(`user:${user.id}:subscribe`,86400);
    return response.status(HttpStatusCode.Ok).json({ message: 'Unsubscribed', state: 0 });
  } catch (error) {
    if ( process.env.NODE_ENV === 'development' ) return response.status(HttpStatusCode.InternalServerError).json({ error: String(error) });
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}

export async function POST(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection )
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    const { authorization } = request.headers;
    const { c } = request.query;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const channelId = String(c);
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !channelId || !(await IsValidChannel(channelId)) )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid channelId' });
    if ( redisClient?.redis )
      redisClient.redis.hset(`user:${user.id}:subscribe`,channelId,1),redisClient.redis.expire(`user:${user.id}:subscribe`,86400);
    database.connection.query(
      `INSERT IGNORE INTO subscribe_artist (uid, target) VALUES (?, ?)`,
      [user.id, channelId]
    );
    return response.status(HttpStatusCode.Ok).json({ message: 'Ok' });
  } catch (error) {
    if ( process.env.NODE_ENV === 'development' ) return response.status(HttpStatusCode.InternalServerError).json({ error: String(error) });
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(request: express.Request, response: express.Response) {
  try {
    if ( !database || !database.connection )
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    const { authorization } = request.headers;
    const { c } = request.query;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const channelId = String(c);
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !channelId || !(await IsValidChannel(channelId)) )
      return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid channelId' });
    if ( redisClient?.redis )
      redisClient.redis.hset(`user:${user.id}:subscribe`,channelId,0),redisClient.redis.expire(`user:${user.id}:subscribe`,86400);
    database.connection.query(
      `DELETE FROM subscribe_artist WHERE uid=? AND target=?`,
      [user.id, channelId]
    );
    return response.status(HttpStatusCode.Ok).json({ message: 'Ok' });
  } catch (error) {
    if ( process.env.NODE_ENV === 'development' ) return response.status(HttpStatusCode.InternalServerError).json({ error: String(error) });
    return response.status(HttpStatusCode.InternalServerError).json({ error: 'Internal Server Error' });
  }
}