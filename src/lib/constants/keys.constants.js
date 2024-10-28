export const QUEUE_NAME = process.env.QUEUE_NAME || 'webhookQueue';
export const DEAD_LETTER_QUEUE_NAME = 'deadLetterQueue';
export const BLACKLISTED_ENDPOINTS = 'blacklistedEndpoints';
export const PROCESSED_JOBS = 'processedJobsCount';
export const FAILURE_COUNT = 'failedJobsCount';
export const FAILURE_COUNTS = 'failureCounts';
export const RETRIES_COUNT = 'retriesCount';
