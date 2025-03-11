import env, {argv} from './env';

const {
  LAVALINK_SERVER, LAVALINK_PORT, LAVALINK_PASSWORD
} = env;

var host: string = LAVALINK_SERVER || 'localhost';
var port: number = Number(LAVALINK_PORT) || 2333;
var password: string = LAVALINK_PASSWORD || 'youshallnotpass';

if ( argv.includes('--production') || argv.includes('-launch') || env.NODE_ENV === 'production' ) {
  if (!host ||!port ||!password) {
    throw new Error("---------------------- Critical missing break!!\n\nMissing lavalink environment variables for production\n\n----------------------");
  }
  console.log( " ---------------------- Connecting lavalink with production environment. ---------------------- " )
} else {
  console.log( " ---------------------- Connecting lavalink with development environment. ---------------------- " )
}

export const config = {
  host: host,
  port: port,
  password: password
};