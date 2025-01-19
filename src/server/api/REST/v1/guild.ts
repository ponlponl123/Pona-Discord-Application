import express from 'express';
import { HttpStatusCode } from 'axios';
import { database, discordClient as self } from '@/index';

export const path = '/:guildId?/:query?';

export async function GET_PRIVATE(request: express.Request, response: express.Response) {
  const { guildId, query } = request.params;

  if ( typeof guildId !== 'string' ) return response.status(HttpStatusCode.BadRequest).json({
    message: 'guildId is not a string',
  });

  const guild = self.client.guilds.cache.get(guildId);

  if ( !guild ) return response.status(HttpStatusCode.NotFound).json({
    message: 'Not Found',
  });

  switch ( query ) {
    case 'stats':
      {
        if ( !database.connection ) {
          return response.status(HttpStatusCode.ServiceUnavailable).json({
            message: 'Service Unavailable'
          });
        }
        const sql_query = `SELECT
            start_time,
            end_time
          FROM
            (SELECT
              time AS start_time,
              LEAD(time) OVER (ORDER BY time) AS end_time,
              active
            FROM pona_flipflop_state WHERE guildid = ?
            ) AS subquery
          WHERE
            active = 1
          AND
            end_time IS NOT NULL
          ORDER BY
            start_time;`
        const [rows] = await database.connection.query(sql_query, [guildId]);
        return response.status(HttpStatusCode.Ok).json({
          message: 'OK',
          active: rows,
        });
      }
    default: 
      return response.status(HttpStatusCode.Ok).json({
        message: 'OK',
        guild: guild
      });
  }
}