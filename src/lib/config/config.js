import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) dotenv.config();

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
export const BACKOFF_BASE = parseInt(process.env.BACKOFF_BASE, 10) || 1000;
export const MAX_RETRIES = parseInt(process.env.MAX_RETRIES, 10) || 5;
export const MAX_DELAY = parseInt(process.env.MAX_DELAY, 10) || 60000;
export const MAX_FAILURES_BEFORE_BLACKLIST = parseInt(process.env.MAX_FAILURES_BEFORE_BLACKLIST, 10) || 5;
export const CONCURRENCY_LIMIT = parseInt(process.env.CONCURRENCY_LIMIT, 10) || 5;
export const RETRY_INTERVAL = parseInt(process.env.RETRY_INTERVAL, 10) || 500;
export const PRODUCTION_INTERVAL = parseInt(process.env.PRODUCTION_INTERVAL, 10) || 1000;
export const DASHBOARD_PORT = parseInt(process.env.DASHBOARD_PORT, 10) || 8080;
export const DASHBOARD_API_KEY = process.env.DASHBOARD_API_KEY || 'default_api_key';
