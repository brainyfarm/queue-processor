import { isEndpointBlacklisted } from '../queue/blacklist.js';
import { BACKOFF_BASE, MAX_RETRIES, MAX_DELAY } from '../config/config.js';
import logger from '../logger/logger.js';

/**
 * Calculates the delay for the next retry attempt using exponential backoff.
 * Caps the delay at MAX_DELAY.
 * @param {number} attempt - The current retry attempt number.
 * @returns {number} - Calculated delay in milliseconds.
 */
export const calculateBackoffDelay = (attempt) => {
  const delay = BACKOFF_BASE * Math.pow(2, attempt - 1);
  return Math.min(delay, MAX_DELAY);
};

/**
 * Determines whether a job should retry based on its endpoint's status
 * and the retry attempt number.
 * @param {string} url - The URL of the webhook endpoint.
 * @param {number} attempt - The current retry attempt number.
 * @returns {boolean} - True if retry should proceed, false if retries are exhausted.
 */
export const shouldRetry = async (url, attempt) => {
  // Check if the endpoint is blacklisted or if max retries are reached
  const blacklisted = await isEndpointBlacklisted(url);
  if (blacklisted) {
    logger.warn(`Retry not allowed for blacklisted endpoint: ${url}`);
    return false;
  }
  if (attempt > MAX_RETRIES) {
    logger.info(`Max retries reached for URL: ${url}`);
    return false;
  }
  return true;
};
