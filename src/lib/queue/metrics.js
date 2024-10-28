import redisQueue from './redisQueue.js';

export const initializeMetrics = async () => {
  await redisQueue.resetMetrics();
};

export const incrementProcessedJobs = async () => {
  await redisQueue.completeJob();
};

export const incrementFailedJobs = async () => {
  await redisQueue.incrementFailedJobs();
};

export const incrementRetries = async () => {
  await redisQueue.incrementRetries();
};

export const getMetrics = async () => {
  return await redisQueue.getMetrics();
};
