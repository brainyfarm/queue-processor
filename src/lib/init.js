// src/lib/init.js

import redisQueue from './queue/redisQueue.js';
import logger from './logger/logger.js';

/**
 * Initializes queue metrics and prepares the queue for operation.
 */
export const initializeQueue = async () => {
  try {
    await redisQueue.resetMetrics();
    logger.info('Queue metrics have been successfully initialized.');
  } catch (error) {
    logger.error(`Error initializing queue metrics: ${error.message}`);
  }
};
