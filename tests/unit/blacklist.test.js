import { trackFailure, isEndpointBlacklisted, resetFailureCount } from '../../src/lib/queue/blacklist.js';
import redisClient from '../../src/lib/client/client.js';

jest.mock('../../src/lib/client/client.js');

describe('Blacklist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('trackFailure should increment failure count for endpoint', async () => {
    redisClient.incr.mockResolvedValue(3);
    await trackFailure('http://test-url.com');
    expect(redisClient.incr).toHaveBeenCalledWith('failures:http://test-url.com');
  });

  test('isEndpointBlacklisted should return true if endpoint is blacklisted', async () => {
    redisClient.sIsMember.mockResolvedValue(true);
    const blacklisted = await isEndpointBlacklisted('http://test-url.com');
    expect(blacklisted).toBe(true);
  });

  test('resetFailureCount should reset failure count for endpoint', async () => {
    await resetFailureCount('http://test-url.com');
    expect(redisClient.del).toHaveBeenCalledWith('failures:http://test-url.com');
  });
});
