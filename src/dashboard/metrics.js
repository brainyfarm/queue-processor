import { getMetrics as fetchQueueMetrics } from '../lib/queue/metrics.js';

export const getMetrics = async () => {
  try {
    return await fetchQueueMetrics();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }
};
