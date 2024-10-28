import dotenv from 'dotenv'

dotenv.config();

const {
  DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID,
  DISCORD_TESTBASE_TOKEN, DISCORD_TESTBASE_CLIENT_ID, DISCORD_TESTBASE_GUILD_ID
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error("Missing environment variables");
}

let token: string = DISCORD_TESTBASE_TOKEN || '';
let clientId: string = DISCORD_TESTBASE_CLIENT_ID || '';
let guildId: string = DISCORD_TESTBASE_GUILD_ID || '';

if ( process.argv.includes('--production') ) {
  token = DISCORD_TOKEN || '';
  clientId = DISCORD_CLIENT_ID || '';
  guildId = DISCORD_GUILD_ID || '';

  if (!token ||!clientId ||!guildId) {
    throw new Error("---------------------- Critical missing break!!\n\nMissing discord environment variables for production\n\n----------------------");
  }
} else {
  console.log( " ---------------------- Starting discord application with development environment. ---------------------- " )
}

export const config = {
  DISCORD_TOKEN: token,
  DISCORD_CLIENT_ID: clientId,
  DISCORD_GUILD_ID: guildId
};