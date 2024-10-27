import { addJob, getJob, completeJob } from '../../src/lib/queue/queue.js';
import redisClient from '../../src/lib/client/client.js';

jest.mock('../../src/lib/client/client.js');

describe('Queue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addJob should add job to queue', async () => {
    await addJob({ name: 'test job', priority: 1 });
    expect(redisClient.zAdd).toHaveBeenCalledWith(expect.any(String), [{ score: 1, value: JSON.stringify({ name: 'test job', priority: 1 }) }]);
  });

  test('getJob should retrieve job from queue', async () => {
    redisClient.zPopMax.mockResolvedValue([{ value: JSON.stringify({ name: 'retrieved job' }) }]);
    const job = await getJob();
    expect(job).toEqual({ name: 'retrieved job' });
  });

  test('completeJob should decrement activeJobs and increment processed jobs', () => {
    completeJob();
    expect(redisClient.incr).toHaveBeenCalledWith('processedJobs');
  });
});
