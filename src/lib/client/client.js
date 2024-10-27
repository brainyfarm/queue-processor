import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '../config/config.js';
import logger from '../logger/logger.js';

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  password: REDIS_PASSWORD,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
  },
});

redisClient.on('connect', () => logger.info('Connected to Redis server.'));
redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err.message}`));
redisClient.on('reconnecting', (delay) => logger.info(`Reconnecting to Redis in ${delay} ms`));
redisClient.on('end', () => logger.info('Redis connection closed.'));

await redisClient.connect().catch((err) => {
  logger.error(`Initial Redis connection failed: ${err.message}`);
});

export default redisClient;
