// src/producer/data.js

/**
 * Array of webhook jobs with details for testing.
 * Jobs are structured to include both successful and failing URLs to test retry logic.
 */
export const webhookJobs = [
  { url: 'https://webhook-test.info1100.workers.dev/success1', orderId: 1, name: 'Olimpia Krasteva', event: 'Spooky Summit' },
  { url: 'https://webhook-test.info1100.workers.dev/fail1', orderId: 2, name: 'Kumaran Powell', event: 'Serene Sands' },
  { url: 'https://webhook-test.info1100.workers.dev/success2', orderId: 3, name: 'Viraja Qurbonova', event: 'Glow Gallery' },
  { url: 'https://webhook-test.info1100.workers.dev/success1', orderId: 4, name: 'Kwesi Martinek', event: 'Spooky Summit' },
  { url: 'https://webhook-test.info1100.workers.dev/fail1', orderId: 5, name: 'Suada Katz', event: 'Serene Sands' },
  { url: 'https://webhook-test.info1100.workers.dev/retry1', orderId: 6, name: 'Neha Lebeau', event: 'Fall Foliage Farm' },
  { url: 'https://webhook-test.info1100.workers.dev/success2', orderId: 7, name: 'Ammiel Neri', event: 'Glow Gallery' },
  { url: 'https://webhook-test.info1100.workers.dev/fail2', orderId: 8, name: 'Cecilija Poindexter', event: 'Prism Pavilion' },
  { url: 'https://webhook-test.info1100.workers.dev/retry1', orderId: 9, name: 'Arcadia Reynell', event: 'Fall Foliage Farm' },
  { url: 'https://webhook-test.info1100.workers.dev/success1', orderId: 10, name: 'Zoriana Donovan', event: 'Spooky Summit' },
];
