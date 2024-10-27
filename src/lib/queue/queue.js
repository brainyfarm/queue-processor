import redisClient from '../client/client.js';
import logger from '../logger/logger.js';
import { CONCURRENCY_LIMIT } from '../config/config.js';
import { incrementProcessedJobs } from './metrics.js';
import { QUEUE_NAME } from '../constants/keys.constants.js';

let activeJobs = 0;

export const addJob = async (job, priority = 0) => {
  try {
    await redisClient.zAdd(QUEUE_NAME, [{ score: priority, value: JSON.stringify(job) }]);
    logger.info(`Job added to queue: ${job.name} with priority ${priority}`);
  } catch (error) {
    logger.error(`Error adding job to queue: ${error.message}`);
  }
};

export const getJob = async () => {
  if (activeJobs >= CONCURRENCY_LIMIT) {
    logger.info(`Concurrency limit reached (${CONCURRENCY_LIMIT}). Job retrieval paused.`);
    return null;
  }
  try {
    const jobData = await redisClient.zPopMax(QUEUE_NAME);
    if (jobData) {
      activeJobs++;
      const job = JSON.parse(jobData.value);
      return job;
    }
    logger.info('No jobs available in queue');
    return null;
  } catch (error) {
    logger.error(`Error retrieving job from queue: ${error.message}`);
    return null;
  }
};

export const completeJob = () => {
  if (activeJobs > 0) {
    activeJobs--;
    incrementProcessedJobs();
    logger.info(`Job completed. Active jobs count: ${activeJobs}`);
  }
};
