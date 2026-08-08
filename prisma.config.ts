import { config } from './src/config/database';

// Prisma 7 configuration file (used by Prisma CLI for db push / migrations)
module.exports = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url:
      config.url ||
      `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
  },
};
