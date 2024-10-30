const {
  DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID
} = process.env;

if (
  !DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID
) {
  throw new Error(`Missing environment variables`);
}

let token: string = DISCORD_TOKEN || '';
let clientId: string = DISCORD_CLIENT_ID || '';
let guildId: string = DISCORD_GUILD_ID || '';

if ( process.env.NODE_ENV === 'production' ) {
  if (!token ||!clientId ||!guildId) {
    throw new Error("---------------------- Critical missing break!!\n\nMissing discord environment variables for production\n\n----------------------");
  }
  console.log( " ---------------------- Starting discord application with production environment. ---------------------- " )
} else {
  console.log( " ---------------------- Starting discord application with development environment. ---------------------- " )
}

export const config = {
  DISCORD_TOKEN: token,
  DISCORD_CLIENT_ID: clientId,
  DISCORD_GUILD_ID: guildId
};