import { HttpStatusCode } from 'axios';
import { database, discordClient as self } from '@/index';
import { Router } from '@/interfaces/router';

export const path = '/:guildId?/:query?';

export interface memberInChannelHistory {
  from: string;
  to: string;
  channels: {
    id: string;
    name?: string;
    members: string[];
  }[]
}

export const GET_PRIVATE: Router['GET_PRIVATE'] = async (request, response) => {
  try {
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
              AND time >= NOW() - INTERVAL 7 DAY
              ) AS subquery
            WHERE
              active = 1
            AND
              end_time IS NOT NULL
            ORDER BY
              start_time;`
          const sql_query2 = `WITH filtered_data AS (
              SELECT 
                memberid, 
                channelid, 
                UNIX_TIMESTAMP(date) AS timestamp,
                DATE_FORMAT(date, '%Y-%m-%d %H:00:00') as truncated_date
              FROM pona_voicestate_history
              WHERE 
                guildid = ?
                AND type = 'memberJoined'
            ),
            unique_members AS (
              SELECT DISTINCT 
                memberid, 
                channelid, 
                truncated_date,
                UNIX_TIMESTAMP(truncated_date) AS truncated_timestamp
              FROM filtered_data
            ),
            intervals AS (
              SELECT 
                UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL d DAY)) + (h * 10800) AS start_timestamp,
                UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL d DAY)) + ((h + 1) * 10800) - 60 AS end_timestamp,
                DATE_FORMAT(ADDTIME('00:00:00', SEC_TO_TIME(h * 10800)), '%H:%i') AS from_time,
                DATE_FORMAT(ADDTIME('00:00:00', SEC_TO_TIME((h + 1) * 10800 - 60)), '%H:%i') AS to_time
              FROM (
                SELECT 0 AS d UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
                SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
              ) AS days,
              (SELECT 0 AS h UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
                SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) AS hours
            ),
            interval_agg AS (
              SELECT
                i.from_time AS \`from\`,
                i.to_time AS \`to\`,
                channelid,
                memberid
              FROM intervals i
              LEFT JOIN unique_members u
              ON u.truncated_timestamp >= i.start_timestamp 
                AND u.truncated_timestamp <= i.end_timestamp
            ),
            deduplicated_members AS (
              SELECT
                \`from\`,
                \`to\`,
                channelid,
                JSON_ARRAYAGG(memberid) AS members
              FROM (
                SELECT DISTINCT \`from\`, \`to\`, channelid, memberid
                FROM interval_agg
                WHERE channelid IS NOT NULL AND memberid IS NOT NULL -- กรอง NULL
              ) deduplicated
              GROUP BY \`from\`, \`to\`, channelid
            )
            SELECT 
              \`from\`,
              \`to\`,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', channelid,
                  'members', members
                )
              ) as channels
            FROM deduplicated_members
            GROUP BY \`from\`, \`to\`
            ORDER BY \`from\`;`

          const [rows] = await database.connection.query(sql_query, [guildId]);
          const [rows2] = await database.connection.query(sql_query2, [guildId]);

          (rows2 as memberInChannelHistory[]).map(timeline => {
            timeline.channels.map(channel => {
              channel.name = guild.channels.cache.get(channel.id)?.name;
            })
          })
          
          return response.status(HttpStatusCode.Ok).json({
            message: 'OK',
            active: rows,
            history: rows2,
          });
        }
      default: 
        {
          if ( !query ) 
            return response.status(HttpStatusCode.Ok).json({
              message: 'OK',
              guild: guild
            });
          return response.status(HttpStatusCode.MethodNotAllowed).json({
            message: 'Method Not Allowed'
          });
        }
    }
  } catch {
    return response.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}