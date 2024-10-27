import { getJob, completeJob } from '../lib/queue/queue.js';
import { CONCURRENCY_LIMIT } from '../lib/config/config.js';
import { processJob } from './processor.js';
import logger from '../lib/logger/logger.js';

let activeJobs = 0;

export const retrieveAndProcessJob = async () => {
  if (activeJobs >= CONCURRENCY_LIMIT) return;

  const job = await getJob();
  if (job) {
    activeJobs++;
    logger.info(`Retrieved job: ${job.name} for event: ${job.event}`);
    processJob(job)
      .catch((error) => logger.error(`Error processing job: ${error.message}`))
      .finally(() => {
        activeJobs--;
        completeJob();
      });
  } else {
    logger.info('No job found in queue');
  }
};
