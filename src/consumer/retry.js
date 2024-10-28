
import { processJob } from './processor.js';
import { calculateBackoffDelay, shouldRetry } from '../lib/retry/retryLogic.js';
import logger from '../lib/logger/logger.js';
import redisQueue from '../lib/queue/redisQueue.js';
/**
 * Handles retrying a failed job with exponential backoff.
 * If retries are exhausted or endpoint is blacklisted, moves job to the DLQ.
 * @param {Object} job - The job to retry.
 * @param {number} attempt - The current retry attempt count.
 * @returns {boolean} - Returns true if a retry is scheduled, false otherwise.
 */
export const handleRetry = async (job, attempt = 1) => {
  const retryAllowed = await shouldRetry(job.url, attempt);

  if (!retryAllowed) {
    logger.warn(`Max retries or blacklist reached for job: ${job.name}. Moving to Dead Letter Queue.`);
    await redisQueue.addToDeadLetterQueue(job);
    await redisQueue.incrementFailedJobs();
    return false;
  }

  await redisQueue.incrementRetries();
  await redisQueue.trackFailure(job.url);

  const delay = calculateBackoffDelay(attempt);
  logger.info(`Retry scheduled for job ${job.name} in ${delay} ms (Attempt ${attempt + 1})`);

  setTimeout(() => processJob(job, attempt + 1), delay);
  return true;
};
