import { jest } from '@jest/globals';
import path from 'path';

const loggerPath = path.resolve(process.cwd(), 'src/lib/logger/logger.js');
const redisQueuePath = path.resolve(process.cwd(), 'src/lib/queue/redisQueue.js');

// Global mock for logger
await jest.unstable_mockModule(loggerPath, () => ({
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Global mock for Redis Queue
await jest.unstable_mockModule(redisQueuePath, () => ({
  default: {
    addJob: jest.fn(),
    getJob: jest.fn(),
    completeJob: jest.fn(),
    incrementFailedJobs: jest.fn(),
    incrementRetries: jest.fn(),
    getMetrics: jest.fn(),
    trackFailure: jest.fn(),
    isBlacklisted: jest.fn(),
    addToDeadLetterQueue: jest.fn(),
    resetMetrics: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

// Import the globally mocked modules for test files to access
export const logger = (await import(loggerPath)).default;
export const redisQueue = (await import(redisQueuePath)).default;
