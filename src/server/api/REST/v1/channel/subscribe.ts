import express from 'express';
import { HttpStatusCode } from 'axios';
import { database, redisClient } from '@/index';
import { fetchUserByOAuthAccessToken } from '@/utils/oauth';
import { getChannel, IsValidChannel } from '@/utils/ytmusic-api/getChannel';

export const path = "/:options?";

export async function GET(request: express.Request, response: express.Response) {
  try {
    if (!database || !database.connection)
      return response.status(HttpStatusCode.ServiceUnavailable).json({ error: 'Service Unavailable' });
    const { authorization } = request.headers;
    const { c, limit } = request.query;
    const { options } = request.params;
    if (!authorization) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    const tokenType = authorization.split(' ')[0];
    const tokenKey = authorization.split(' ')[1];
    const channelId = String(c);
    const user = await fetchUserByOAuthAccessToken(tokenType, tokenKey);
    if (!user) 
      return response.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    if ( !options )
    {
      if ( !channelId || !(await IsValidChannel(channelId)) )
        return response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid channelId' });
      if ( redisClient?.redis )
      {
        const value = await redisClient.redis_ReadOnly.hget(`user:${user.id}:subscribe`,channelId);
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
    }
    else
    {
      switch (options) {
        case "s":
          if ( limit && !Number(limit) ) return response.status(HttpStatusCode.BadRequest).json({error: 'limit parameter must be a number and not greater than 100'});
          let q_limit = Number(limit) || 14;
          if ( redisClient?.redis )
          {
            const value = await redisClient.redis_ReadOnly.get(`user:${user.id}:subscribe_cache`);
            if ( value )
              return response.status(HttpStatusCode.Ok).json({ message: 'Ok', result: JSON.parse(value) });
          }
          const channels = await database.connection.query(
            `SELECT target, cache, cache_lastupdated FROM subscribe_artist WHERE uid=? LIMIT ?`,
            [user.id, q_limit]
          );
          if ( channels && channels.length > 0 )
          {
            let subscribed_channels: { artistId: string; info: any }[] = [];
            for (const channel of channels) {
              if ( redisClient?.redis )
                redisClient.redis.multi().hset(`user:${user.id}:subscribe`,channel.target,1).expire(`user:${user.id}:subscribe`,86400);
              if ( !channel.cache || channel.cache_lastupdated < new Date().getTime() - 86400000 )
              {
                const fetchChannel = await getChannel(channel.target);
                if ( fetchChannel )
                {
                  database.connection?.query(
                    `UPDATE subscribe_artist SET cache=?, cache_lastupdated=? WHERE uid=? AND target=?`,
                    [JSON.stringify(fetchChannel.result), new Date().toISOString().slice(0, 19).replace('T', ' '), user.id, channel.target]
                  );
                  subscribed_channels.push({
                    artistId: channel.target,
                    info: fetchChannel.result
                  });
                  continue;
                }
              }
              subscribed_channels.push({
                artistId: channel.target,
                info: JSON.parse(channel?.cache)
              });
            }
            if ( redisClient?.redis )
              redisClient.redis.setex(`user:${user.id}:subscribe_cache`,30,JSON.stringify(subscribed_channels))
            return response.status(HttpStatusCode.Ok).json({ message: 'Ok', result: subscribed_channels });
          }
          return response.status(HttpStatusCode.NotFound).json({ error: 'Not Found' });
        default:
          return response.status(HttpStatusCode.MethodNotAllowed).json({ error: 'Method Not Allowed' });
      }
    }
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