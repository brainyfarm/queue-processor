// src/lib/queue/blacklist.js

import redisQueue from './redisQueue.js';

/**
 * Tracks a failure for a specific URL, adding it to the blacklist after reaching the failure threshold.
 * @param {string} url - The URL to track.
 */
export const trackFailure = async (url) => {
  await redisQueue.trackFailure(url);
};

/**
 * Checks if a specific URL is blacklisted.
 * @param {string} url - The URL to check.
 * @returns {boolean} - Returns true if the URL is blacklisted, otherwise false.
 */
export const isEndpointBlacklisted = async (url) => {
  return await redisQueue.isBlacklisted(url);
};

/**
 * Retrieves all blacklisted URLs.
 * @returns {Array} - Array of blacklisted URLs.
 */
export const getBlacklistedURLs = async () => {
  const metrics = await redisQueue.getMetrics();
  return metrics.blacklistedURLs;
};
