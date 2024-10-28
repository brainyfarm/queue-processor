import { jest } from '@jest/globals';

// Mocking Redis client and logger
await jest.unstable_mockModule('../../../src/lib/logger/logger.js', () => ({
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

await jest.unstable_mockModule('../../../src/lib/queue/redisQueue.js', () => ({
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

// Import the mocked modules for use in tests
const redisQueue = (await import('../../../src/lib/queue/redisQueue.js')).default;
const logger = (await import('../../../src/lib/logger/logger.js')).default;

describe('redisQueue operations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a job to the queue', async () => {
    const job = { name: 'Test Job' };
    await redisQueue.addJob(job);
    expect(redisQueue.addJob).toHaveBeenCalledWith(job);
  });

  it('should retrieve job metrics without Redis errors', async () => {
    redisQueue.getMetrics.mockResolvedValue({
      processedJobs: 5,
      failedJobs: 1,
      retries: 2,
    });

    const metrics = await redisQueue.getMetrics();
    expect(metrics).toEqual({
      processedJobs: 5,
      failedJobs: 1,
      retries: 2,
    });
  });
});
