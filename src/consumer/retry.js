import { processJob } from './processor.js';
import { calculateBackoffDelay, shouldRetry } from '../lib/retry/retryLogic.js';
import { addToDeadLetterQueue } from '../lib/queue/dlq.js'
import { incrementRetries } from '../lib/queue/metrics.js'
import { trackFailure } from '../lib/queue/blacklist.js'
import logger from '../lib/logger/logger.js';

export const handleRetry = async (job, attempt = 1) => {
  const retryAllowed = await shouldRetry(job.url, attempt);

  if (!retryAllowed) {
    logger.warn(`Max retries reached or endpoint blacklisted for job: ${job.name}. Moving to Dead Letter Queue.`);
    await addToDeadLetterQueue(job);
    return;
  }

  await incrementRetries();
  await trackFailure(job.url);

  const delay = calculateBackoffDelay(attempt);
  logger.info(`Retrying job ${job.name} in ${delay} ms (Attempt ${attempt + 1})`);

  setTimeout(() => processJob(job, attempt + 1), delay);
};
