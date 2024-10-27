import { handleRetry } from './retry.js';
import { incrementProcessedJobs, incrementFailedJobs } from '../lib/queue/metrics.js';
import logger from '../lib/logger/logger.js';

export const processJob = async (job) => {
  try {
    await sendWebhook(job);
    await incrementProcessedJobs(); 
    logger.info(`Job processed successfully: ${job.name} for event: ${job.event}`);
  } catch (error) {
    logger.error(`Job processing failed for ${job.name}. Error: ${error.message}`);
    await incrementFailedJobs();
    await handleRetry(job);
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