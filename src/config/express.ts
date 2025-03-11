import env from './env';
const { HTTP_PORT, EXPRESS_SECRET_API_KEY } = env;

const toPort = Number(HTTP_PORT);

if (!HTTP_PORT || !toPort) {
  throw new Error("Missing environment variables");
}

export const config = {
  EXPRESS_PORT: toPort,
  EXPRESS_SECRET_API_KEY
};