import dotenv from 'dotenv'

dotenv.config();

const {
  LAVALINK_SERVER, LAVALINK_PORT, LAVALINK_PASSWORD,
  LAVALINK_DEV_SERVER, LAVALINK_DEV_PORT, LAVALINK_DEV_PASSWORD
} = process.env;

var host: string = LAVALINK_DEV_SERVER || 'localhost';
var port: number = Number(LAVALINK_DEV_PORT) || 2333;
var password: string = LAVALINK_DEV_PASSWORD || 'youshallnotpass';

if ( process.argv.includes('--production') ) {
  host = LAVALINK_SERVER || '';
  port = Number(LAVALINK_PORT) || 0;
  password = LAVALINK_PASSWORD || '';

  if (!host ||!port ||!password) {
    throw new Error("---------------------- Critical missing break!!\n\nMissing lavalink environment variables for production\n\n----------------------");
  }
} else {
  console.log( " ---------------------- Connecting lavalink with development environment. ---------------------- " )
}

export const config = {
  host: host,
  port: port,
  password: password
};