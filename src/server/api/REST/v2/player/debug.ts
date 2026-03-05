import { lavalink } from '@/index';
import Elysia, { t } from 'elysia';

export default new Elysia().get(
  '/debug',
  async ({ params }) => {
    const player = lavalink?.manager?.players.get(params['guildId']);
    return {
      debug:
        'This endpoint is for debugging purposes. It returns various information about the server and the player state.',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      guildId: params['guildId'],
      player:
        typeof player === 'object'
          ? (() => {
              const seen = new WeakSet();
              return JSON.parse(
                JSON.stringify(
                  player,
                  (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                      if (seen.has(value)) {
                        return '[Circular]';
                      }
                      seen.add(value);
                    }
                    return value;
                  },
                  2,
                ),
              );
            })()
          : null,
    };
  },
  {
    params: t.Object({
      guildId: t.String(),
    }),
  },
);
