import blob from './blob';
import Elysia from 'elysia';
import guilds from './guilds';
import music_fetch from './music/fetch';
import debug from './player/debug';

export const player = new Elysia({ prefix: '/:guildId/player' });
export const music = new Elysia({ prefix: '/music' }).use(music_fetch);

if (process.env.NODE_ENV === 'development') {
  player.use(debug);
}

const routes = new Elysia({ prefix: '/v2' })
  .use(guilds)
  .use(music)
  .use(player)
  .use(blob);

export default routes;
