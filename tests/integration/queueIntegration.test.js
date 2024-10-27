import { addJob, getJob, completeJob } from '../../src/lib/queue/queue.js';

describe('Queue Integration', () => {
  test('Integration test to add and get a job', async () => {
    await addJob({ name: 'integration job', priority: 1 });
    const job = await getJob();
    expect(job.name).toBe('integration job');
  });

  test('Complete job should increment processed jobs count', () => {
    completeJob();
    expect(redisClient.incr).toHaveBeenCalledWith('processedJobs');
  });
});
