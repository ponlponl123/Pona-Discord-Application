import { config } from 'dotenv';
import path from 'node:path';

if (process.env.NODE_ENV === 'development') {
  const envPath = path.resolve(
    __dirname,
    '..',
    '..',
    `.env.${process.env.NODE_ENV}`,
  );
  config({ path: envPath });
}

export const env = process.env;
export const argv = process.argv;
export default env;
