import path from 'node:path';

// Bun handles .env files automatically. 
// If you need to load a specific file based on NODE_ENV, you can still use Bun.loadEnv or similar, 
// but for standard .env and .env.development it's automatic.

export const env = process.env;
export const argv = process.argv;
export default env;
