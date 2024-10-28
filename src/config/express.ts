import dotenv from 'dotenv'

dotenv.config();

const { EXPRESS_PORT, EXPRESS_SECRET_API_KEY } = process.env;

const toPort = Number(EXPRESS_PORT);

if (!EXPRESS_PORT || !toPort) {
  throw new Error("Missing environment variables");
}


export const config = {
  EXPRESS_PORT: toPort,
  EXPRESS_SECRET_API_KEY
};