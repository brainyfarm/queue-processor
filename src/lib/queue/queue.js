// src/lib/queue/queue.js

import redisQueue from './redisQueue.js';
import logger from '../logger/logger.js';
import { CONCURRENCY_LIMIT } from '../config/config.js';

export const state = {
  activeJobs: 0,
};

/**
 * Adds a job to the queue with optional priority.
 * @param {Object} job - The job to add.
 * @param {number} priority - Priority level, with higher values processed first.
 */
export const addJob = async (job, priority = 0) => {
  try {
    await redisQueue.addJob(job, priority);
    logger.info(`Job added to queue: ${job.name} with priority ${priority}`);
  } catch (error) {
    logger.error(`Error adding job to queue: ${error.message}`);
  }
};

/**
 * Retrieves the next job if concurrency limit has not been reached.
 * @returns {Object|null} - The next job, or null if the concurrency limit is reached.
 */
export const getJob = async () => {
  if (state.activeJobs >= CONCURRENCY_LIMIT) {
    logger.info(`Concurrency limit (${CONCURRENCY_LIMIT}) reached. Skipping job retrieval.`);
    return null;
  }

  try {
    const job = await redisQueue.getJob();

    if (job) {
      state.activeJobs++;
      logger.info(`Job retrieved: ${job.name}`);
      return job;
    }
    logger.info('No jobs available in queue');
    return null;
  } catch (error) {
    logger.error(`Error retrieving job: ${error.message}`);
    return null;
  }
};

/**
 * Marks a job as completed, updating metrics based on success or failure.
 * @param {boolean} isFailed - True if job failed, false otherwise.
 */
export const completeJob = async (isFailed = false) => {
  if (state.activeJobs > 0) {
    state.activeJobs--;
    if (isFailed) {
      await redisQueue.incrementFailedJobs();
    } else {
      await redisQueue.completeJob();
    }
    logger.info(`Job ${isFailed ? 'failed' : 'completed'}. Active jobs count: ${state.activeJobs}`);
  }
};

/**
 * Resets the queue metrics and active job count.
 */
export const resetQueueMetrics = async () => {
  state.activeJobs = 0;
  await redisQueue.resetMetrics();
  logger.info('Queue metrics and state have been reset.');
};
