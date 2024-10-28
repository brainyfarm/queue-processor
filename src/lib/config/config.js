import dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env')) dotenv.config();

export const BACKOFF_BASE = parseInt(process.env.BACKOFF_BASE, 10) || 1000; // initial backoff delay in ms
export const MAX_RETRIES = parseInt(process.env.MAX_RETRIES, 10) || 5; // maximum retry attempts per job
export const MAX_DELAY = parseInt(process.env.MAX_DELAY, 10) || 60000; // max delay in ms for exponential backoff
export const CONCURRENCY_LIMIT = parseInt(process.env.CONCURRENCY_LIMIT, 10) || 5; // max concurrent jobs
export const RETRY_INTERVAL = parseInt(process.env.RETRY_INTERVAL, 10) || 500; // retry interval in ms
export const PRODUCTION_INTERVAL = parseInt(process.env.PRODUCTION_INTERVAL, 10) || 5000; // production job interval in ms
export const DASHBOARD_PORT = parseInt(process.env.DASHBOARD_PORT, 10) || 8080; // dashboard port

// Dashboard API key requirement for production
export const DASHBOARD_API_KEY = process.env.DASHBOARD_API_KEY;
if (process.env.NODE_ENV === 'production' && !DASHBOARD_API_KEY) {
  throw new Error('DASHBOARD_API_KEY must be set in production');
}
