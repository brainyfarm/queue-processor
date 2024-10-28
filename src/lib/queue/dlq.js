// src/lib/queue/dlq.js

import redisQueue from './redisQueue.js';
import logger from '../logger/logger.js';

/**
 * Adds a job to the Dead Letter Queue (DLQ) when retries are exhausted or the endpoint is blacklisted.
 * @param {Object} job - The job to add to the DLQ.
 */
export const addToDeadLetterQueue = async (job) => {
  try {
    await redisQueue.addToDeadLetterQueue(job);
    logger.warn(`Job moved to Dead Letter Queue: ${job.name}`);
  } catch (error) {
    logger.error(`Error adding job to Dead Letter Queue: ${error.message}`);
  }
};

/**
 * Retrieves all jobs currently in the Dead Letter Queue.
 * @returns {Array} - Array of jobs in the DLQ.
 */
export const getDeadLetterQueueItems = async () => {
  try {
    return redisQueue.deadLetterQueue;
  } catch (error) {
    logger.error(`Error fetching Dead Letter Queue items: ${error.message}`);
    return [];
  }
};
