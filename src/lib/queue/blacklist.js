import redisClient from '../client/client.js';
import logger from '../logger/logger.js';
import { MAX_FAILURES_BEFORE_BLACKLIST } from '../config/config.js';

export const trackFailure = async (url) => {
  try {
    const failures = await redisClient.incr(`failures:${url}`);
    if (failures >= MAX_FAILURES_BEFORE_BLACKLIST) {
      await redisClient.sAdd('blacklistedEndpoints', url);
      logger.warn(`Endpoint ${url} blacklisted after ${failures} failures.`);
    } else {
      logger.info(`Failure recorded for endpoint ${url}. Current failures: ${failures}`);
    }
  } catch (error) {
    logger.error(`Error tracking failure for ${url}: ${error.message}`);
  }
};

export const isEndpointBlacklisted = async (url) => {
  try {
    return await redisClient.sIsMember('blacklistedEndpoints', url);
  } catch (error) {
    logger.error(`Error checking blacklist for ${url}: ${error.message}`);
    return false;
  }
};

export const resetFailureCount = async (url) => {
  try {
    await redisClient.del(`failures:${url}`);
    logger.info(`Failure count reset for endpoint: ${url}`);
  } catch (error) {
    logger.error(`Error resetting failure count for ${url}: ${error.message}`);
  }
};

export const getBlacklistedURLs = async () => {
  try {
    return await redisClient.sMembers('blacklistedEndpoints');
  } catch (error) {
    logger.error(`Error fetching blacklisted URLs: ${error.message}`);
    return [];
  }
};
