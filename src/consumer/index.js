import { retrieveAndProcessJob } from './retriever.js';
import { RETRY_INTERVAL } from '../lib/config/config.js';
import logger from '../lib/logger/logger.js';

logger.info('Consumer started successfully.');

const startConsuming = () => {
  setInterval(retrieveAndProcessJob, RETRY_INTERVAL);
};

startConsuming();