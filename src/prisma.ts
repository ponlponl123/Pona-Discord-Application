import { PrismaClient } from './generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { config as databaseConf } from './config/database';

const adapter = new PrismaMariaDb({
  host: databaseConf.host,
  port: databaseConf.port,
  user: databaseConf.user,
  ...(databaseConf.password ? { password: databaseConf.password } : {}),
  database: databaseConf.database,
  ...(databaseConf.ssl ? { ssl: databaseConf.ssl } : {}),
});

export const prisma = new PrismaClient({ adapter });

export default prisma;
