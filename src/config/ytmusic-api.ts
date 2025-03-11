import env from './env';
const { YTMUSIC_API_HOST, YTMUSIC_API_PORT } = env;

const toPort = Number(YTMUSIC_API_PORT);

if (!YTMUSIC_API_PORT || !toPort) {
  throw new Error("Missing environment variables");
}

export const config = {
  YTMUSIC_API_HOST,
  YTMUSIC_API_PORT
};