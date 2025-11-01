import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { database, redisClient, discordClient as self } from '@/index';
import JSONBig from 'json-bigint';

export interface memberInChannelHistory {
  from: string;
  to: string;
  channels: {
    id: string;
    name?: string;
    members: string[];
  }[];
}

export default new Elysia()
  .get('/guild/:guildid', async ({ params, set }) => {
    const { guildid } = params;

    if (typeof guildid !== 'string') {
      set.status = HttpStatusCode.BadRequest;
      return { message: 'guildId is not a string' };
    }

    const guild = self.client.guilds.cache.get(guildid);

    if (!guild) {
      set.status = HttpStatusCode.NotFound;
      return { message: 'Not Found' };
    }

    set.status = HttpStatusCode.Ok;
    return {
      message: 'OK',
      guild: guild,
    };
  })
  .get('/guild/:guildid/:query/private', async ({ params, set }) => {
    try {
      const { guildid, query } = params;

      if (typeof guildid !== 'string') {
        set.status = HttpStatusCode.BadRequest;
        return { message: 'guildId is not a string' };
      }

      const guild = self.client.guilds.cache.get(guildid);

      if (!guild) {
        set.status = HttpStatusCode.NotFound;
        return { message: 'Not Found' };
      }

      switch (query) {
        case 'stats': {
          if (redisClient?.redis) {
            const active = await redisClient.redis.get(
              `guild:${guildid}:stats:active`,
            );
            const history = await redisClient.redis.get(
              `guild:${guildid}:stats:history`,
            );
            if (active && history) {
              set.status = HttpStatusCode.Ok;
              return {
                message: 'Ok',
                active: JSONBig.parse(active),
                history: JSONBig.parse(history),
              };
            }
          }
          if (!database.pool) {
            set.status = HttpStatusCode.ServiceUnavailable;
            return { message: 'Service Unavailable' };
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
              start_time;`;
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
            ORDER BY \`from\`;`;

          const rows = await database.pool.query(sql_query, [guildid]);
          const rows2 = await database.pool.query(sql_query2, [guildid]);

          (rows2 as memberInChannelHistory[]).map((timeline) => {
            timeline.channels.map((channel) => {
              channel.name = guild.channels.cache.get(channel.id)?.name;
            });
          });
          redisClient?.redis.setex(
            `guild:${guildid}:stats:active`,
            300,
            JSONBig.stringify(rows),
          );
          redisClient?.redis.setex(
            `guild:${guildid}:stats:history`,
            300,
            JSONBig.stringify(rows2),
          );
          set.status = HttpStatusCode.Ok;
          return {
            message: 'OK',
            active: rows,
            history: rows2,
          };
        }
        default: {
          if (!query) {
            set.status = HttpStatusCode.Ok;
            return {
              message: 'OK',
              guild: guild,
            };
          }
          set.status = HttpStatusCode.MethodNotAllowed;
          return {
            message: 'Method Not Allowed',
          };
        }
      }
    } catch {
      set.status = HttpStatusCode.InternalServerError;
      return { error: 'Internal Server Error' };
    }
  });
