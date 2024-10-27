import redisClient from './client/client.js';
import logger from './logger/logger.js';

export const initializeMetric = async (key, value = '0') => {
  try {
    const exists = await redisClient.exists(key);
    if (!exists) {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error(`Error initializing metric ${key}: ${error.message}`);
  }
};

export const initializeDLQ = async () => {
  try {
    const dlqType = await redisClient.type('deadLetterQueue');
    if (dlqType !== 'list' && dlqType !== 'none') {
      await redisClient.del('deadLetterQueue');
    }
  } catch (error) {
    logger.error(`Error initializing Dead Letter Queue: ${error.message}`);
  }
};
