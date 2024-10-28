import { retrieveAndProcessJob } from '../../../src/consumer/retriever.js';
import { redisQueue } from '../../../jest.setup.js';
import { logger } from '../../../jest.setup.js';

describe('retrieveAndProcessJob', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve and process a job successfully', async () => {
    const mockJob = { name: 'Test Job', event: 'Test Event' };
    redisQueue.getJob.mockResolvedValue(mockJob);
    redisQueue.completeJob.mockResolvedValueOnce();

    await retrieveAndProcessJob();

    expect(redisQueue.getJob).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved job'));
    expect(redisQueue.completeJob).toHaveBeenCalled();
  });

  it('should log when no job is found in queue', async () => {
    redisQueue.getJob.mockResolvedValueOnce(null);

    await retrieveAndProcessJob();

    expect(logger.info).toHaveBeenCalledWith('No job found in queue');
  });
});
