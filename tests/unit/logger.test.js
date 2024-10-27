import logger from '../../src/lib/logger/logger.js';

describe('Logger', () => {
  test('Logger info should log info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    logger.info('Info message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Info message'));
    consoleSpy.mockRestore();
  });

  test('Logger error should log error messages', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    logger.error('Error message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    consoleSpy.mockRestore();
  });
});
