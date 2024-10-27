import { calculateBackoffDelay, shouldRetry } from '../../src/lib/retry/retryLogic.js';
import { isEndpointBlacklisted } from '../../src/lib/queue/blacklist.js';

jest.mock('../../src/lib/queue/blacklist.js');

describe('Retry Logic', () => {
  test('calculateBackoffDelay should return correct delay based on attempt', () => {
    const delay = calculateBackoffDelay(3);
    expect(delay).toBeLessThanOrEqual(60000);
  });

  test('shouldRetry returns true if retry is allowed', async () => {
    isEndpointBlacklisted.mockResolvedValue(false);
    const retryAllowed = await shouldRetry('http://test-url.com', 1);
    expect(retryAllowed).toBe(true);
  });

  test('shouldRetry returns false if endpoint is blacklisted', async () => {
    isEndpointBlacklisted.mockResolvedValue(true);
    const retryAllowed = await shouldRetry('http://test-url.com', 1);
    expect(retryAllowed).toBe(false);
  });
});
