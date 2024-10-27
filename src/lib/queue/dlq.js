import redisClient from '../client/client.js';
import logger from '../logger/logger.js';
import { initializeDLQ } from '../init.js';
import { DEAD_LETTER_QUEUE_NAME } from '../constants/keys.constants.js';


export const addToDeadLetterQueue = async (job) => {
  try {
    await initializeDLQ();
    const dlqItems = await getDeadLetterQueueItems();
    if (dlqItems.some(item => JSON.stringify(item) === JSON.stringify(job))) {
      logger.warn(`Job ${job.name} already exists in Dead Letter Queue. Skipping.`);
      return;
    }
    await redisClient.rPush(DEAD_LETTER_QUEUE_NAME, JSON.stringify(job));
    logger.warn(`Job moved to Dead Letter Queue: ${job.name}`);
  } catch (error) {
    logger.error(`Error adding job to Dead Letter Queue: ${error.message}`);
  }
};

export const getDeadLetterQueueItems = async () => {
  try {
    const dlqItems = await redisClient.lRange(DEAD_LETTER_QUEUE_NAME, 0, -1);
    return dlqItems.map(item => JSON.parse(item));
  } catch (error) {
    logger.error(`Error fetching Dead Letter Queue items: ${error.message}`);
    return [];
  }
};
