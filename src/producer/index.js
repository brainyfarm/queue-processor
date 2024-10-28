import logger from '../lib/logger/logger.js';

import { startProduction } from './producer.js';

logger.info('Starting job production...');
startProduction();
