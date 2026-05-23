import { container } from '@/core/container';
import { prefix as consolePrefix } from '@config/console';
import logger from '@/core/logger';

async function bootstrap() {
  try {
    await container.initialize();
    
    // Inject dependencies into Pona client
    container.pona.setLavalink(container.lavalink);

    logger.info(consolePrefix.system, 'Pona Backend is fully operational!');
  } catch (error) {
    logger.error(consolePrefix.system, 'Failed to bootstrap Pona Backend', error);
    process.exit(1);
  }
}

async function shutdown() {
  logger.info(consolePrefix.system, 'Shutting down...');
  
  try {
    if (container.redis) {
      await container.redis.redis.quit();
      logger.info(consolePrefix.redis, 'Redis connection closed.');
    }
  } catch (err) {
    logger.error(consolePrefix.redis, 'Error closing Redis', err);
  }

  try {
    const { prisma } = await import('./prisma');
    await prisma.$disconnect();
    logger.info(consolePrefix.database, 'Database connection closed.');
  } catch (err) {
    logger.error(consolePrefix.database, 'Error closing database', err);
  }

  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

bootstrap();

export { container };
