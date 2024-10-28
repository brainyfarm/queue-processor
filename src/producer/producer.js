import { addJob } from '../lib/queue/queue.js';
import { webhookJobs } from './data.js';
import { PRODUCTION_INTERVAL } from '../lib/config/config.js';
import logger from '../lib/logger/logger.js';

/**
 * Starts producing jobs by adding them to the queue at a fixed interval.
 */
export const startProduction = () => {
  let index = 0;

  setInterval(async () => {
    const job = webhookJobs[index];
    try {
      await addJob(job);
      logger.info(`Produced job: ${job.name} for event: ${job.event}`);
      index = (index + 1) % webhookJobs.length;
    } catch (error) {
      logger.error(`Failed to produce job: ${job.name}. Error: ${error.message}`);
    }
  }, PRODUCTION_INTERVAL);
};
