
import { handleRetry } from './retry.js';
import logger from '../lib/logger/logger.js';

/**
 * Processes an individual job, attempting to send the webhook and handling retries if it fails.
 * @param {Object} job - The job to process.
 * @param {number} attempt - The current attempt count for this job.
 */
export const processJob = async (job, attempt = 1) => {
  logger.info(`Processing job: ${job.name} for event: ${job.event}`);
  
  try {
    await sendWebhook(job);
    logger.info(`Job processed successfully: ${job.name} for event: ${job.event}`);
  } catch (error) {
    logger.error(`Job processing failed for ${job.name}. Error: ${error.message}`);
    await handleRetry(job, attempt);
  }
};

/**
 * Simulates sending a webhook to the specified URL.
 * @param {Object} job - The job containing webhook URL and details.
 * @throws {Error} - Throws error for URLs designated as failures.
 */
const sendWebhook = async (job) => {
  logger.info(`Sending webhook for ${job.name} at ${job.url}`);

  // Simulate a failure for specific URLs to trigger retry logic
  if (job.url.includes('fail')) {
    throw new Error(`Failed to send webhook to ${job.url}`);
  }

  // Simulated success response
  return `Webhook sent successfully to ${job.url}`;
};
