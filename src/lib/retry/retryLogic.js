import redisQueue from '../queue/redisQueue.js';
import { BACKOFF_BASE, MAX_RETRIES, MAX_DELAY } from '../config/config.js';
import logger from '../logger/logger.js';

export const calculateBackoffDelay = (attempt) => {
  return Math.min(BACKOFF_BASE * Math.pow(2, attempt - 1), MAX_DELAY);
};

export const shouldRetry = async (url, attempt) => {
  const isBlacklisted = await redisQueue.isBlacklisted(url);
  if (isBlacklisted || attempt > MAX_RETRIES) {
    logger.warn(`Retry not allowed for ${url}. Endpoint is blacklisted or max retries reached.`);
    return false;
  }
  return true;
};

export const trackFailure = async (url) => {
  await redisQueue.trackFailure(url);
};
