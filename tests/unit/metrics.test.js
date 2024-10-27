import { incrementProcessedJobs, incrementFailedJobs, incrementRetries, getMetrics } from '../../src/lib/queue/metrics.js';
import redisClient from '../../src/lib/client/client.js';

jest.mock('../../src/lib/client/client.js');

describe('Metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('incrementProcessedJobs should increase processed jobs count', async () => {
    await incrementProcessedJobs();
    expect(redisClient.incr).toHaveBeenCalledWith('processedJobs');
  });

  test('incrementFailedJobs should increase failed jobs count', async () => {
    await incrementFailedJobs();
    expect(redisClient.incr).toHaveBeenCalledWith('failedJobs');
  });

  test('incrementRetries should increase retries count', async () => {
    await incrementRetries();
    expect(redisClient.incr).toHaveBeenCalledWith('retries');
  });

  test('getMetrics should retrieve all metrics correctly', async () => {
    redisClient.get.mockResolvedValue(5);
    redisClient.sCard.mockResolvedValue(2);
    const metrics = await getMetrics();
    expect(metrics.processedJobs).toBe(5);
    expect(metrics.failedJobs).toBe(5);
    expect(metrics.retries).toBe(5);
    expect(metrics.blacklistedEndpoints).toBe(2);
  });
});
