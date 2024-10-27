import redisClient from '../client/client.js';
import logger from '../logger/logger.js';
import { initializeMetric } from '../init.js';
import { getBlacklistedURLs } from './blacklist.js';
import { getDeadLetterQueueItems } from './dlq.js';
import { QUEUE_NAME } from '../constants/keys.constants.js';

export const initializeMetrics = async () => {
  await initializeMetric('processedJobs');
  await initializeMetric('failedJobs');
  await initializeMetric('retries');
};

export const incrementProcessedJobs = async () => {
  try {
    await redisClient.incr('processedJobs');
  } catch (error) {
    logger.error(`Error incrementing processed jobs: ${error.message}`);
  }
};

export const incrementFailedJobs = async () => {
  try {
    await redisClient.incr('failedJobs');
  } catch (error) {
    logger.error(`Error incrementing failed jobs: ${error.message}`);
  }
};

export const incrementRetries = async () => {
  try {
    await redisClient.incr('retries');
  } catch (error) {
    logger.error(`Error incrementing retries: ${error.message}`);
  }
};

export const getMetrics = async () => {
  try {
    const queueSize = await redisClient.zCard(QUEUE_NAME) || 0;
    const processedJobs = parseInt(await redisClient.get('processedJobs'), 10) || 0;
    const failedJobs = parseInt(await redisClient.get('failedJobs'), 10) || 0;
    const retries = parseInt(await redisClient.get('retries'), 10) || 0;
    const blacklistedEndpoints = await redisClient.sCard('blacklistedEndpoints') || 0;

    const blacklistedURLs = await getBlacklistedURLs();
    const deadLetterQueueItems = await getDeadLetterQueueItems();

    return {
      queueSize,
      processedJobs,
      failedJobs,
      retries,
      blacklistedEndpoints,
      blacklistedURLs,
      deadLetterQueueItems,
    };
  } catch (error) {
    logger.error(`Error fetching metrics: ${error.message}`);
    return null;
  }
};
