import Elysia from 'elysia';
import guilds from './guilds';
import music_fetch from './music/fetch';

export const music = new Elysia({ prefix: '/music' }).use(music_fetch);

export default new Elysia({ prefix: '/v2' }).use(guilds).use(music);
