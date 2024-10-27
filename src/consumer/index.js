import { retrieveAndProcessJob } from './retriever.js';
import { RETRY_INTERVAL } from '../lib/config/config.js';
import logger from '../lib/logger/logger.js';

logger.info('Consumer started with concurrency and retry management.');

const startConsuming = () => {
  setInterval(retrieveAndProcessJob, RETRY_INTERVAL);
};

startConsuming();