import dotenv from 'dotenv'

dotenv.config();

const { LAVALINK_SERVER, LAVALINK_PORT, LAVALINK_PASSWORD } = process.env;

const toPort = Number(LAVALINK_PORT);

if (!LAVALINK_PORT || !toPort) {
  throw new Error("Missing environment variables");
}

export const config = {
  host: LAVALINK_SERVER || "localhost",
  port: toPort || 2333,
  password: LAVALINK_PASSWORD || "youshallnotpass"
};