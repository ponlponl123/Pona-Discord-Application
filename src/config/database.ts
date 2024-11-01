import { env, argv } from "process";

const {
  DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, DATABASE_NAME
} = env;

var host: string = DATABASE_HOST || 'localhost';
var port: number = Number(DATABASE_PORT) || 3306;
var user: string = DATABASE_USER || 'me';
var password: string = DATABASE_PASS || 'secret';
var database: string = DATABASE_NAME || 'my_db';

if ( argv.includes('--production') || argv.includes('-launch') || env.NODE_ENV === 'production' ) {
  if (!host ||!port || !user ||!password || !database) {
    throw new Error("---------------------- Critical missing break!!\n\nMissing Database environment variables for production\n\n----------------------");
  }
  console.log( " ---------------------- Connecting Database with production environment. ---------------------- " )
} else {
  console.log( " ---------------------- Connecting Database with development environment. ---------------------- " )
}

export const config = {
  host: host,
  port: port,
  user: user,
  password: password,
  database: database
};