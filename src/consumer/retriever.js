import { getJob, completeJob } from '../lib/queue/queue.js';
import { processJob } from './processor.js';
import logger from '../lib/logger/logger.js';
import { CONCURRENCY_LIMIT } from '../lib/config/config.js';

let activeJobs = 0;

export const retrieveAndProcessJob = async () => {
  // if (activeJobs >= CONCURRENCY_LIMIT) return;

  const job = await getJob();
  if (job) {
    activeJobs++;
    logger.info(`Retrieved job: ${job.name} for event: ${job.event}`);
    
    try {
      await processJob(job);
      logger.info(`Job processed successfully: ${job.name}`);
    } catch (error) {
      logger.error(`Job processing failed for ${job.name}. Initiating retry.`);
      const delay = await handleRetry(job);
      
      if (delay !== null) {
        setTimeout(() => retrieveAndProcessJob(), delay);
      }
    } finally {
      activeJobs--;
      completeJob();
    }
  } else {
    logger.info('No job found in queue');
  }
};
