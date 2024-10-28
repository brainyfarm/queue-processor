import QueueInterface from "./queueInterface.js";
import { createClient } from "redis";
import {
  QUEUE_NAME,
  DEAD_LETTER_QUEUE_NAME,
  BLACKLISTED_ENDPOINTS,
  FAILURE_COUNT,
  FAILURE_COUNTS,
  PROCESSED_JOBS,
  RETRIES_COUNT,
} from "../constants/keys.constants.js";
import logger from "../logger/logger.js";
import { MAX_RETRIES } from "../config/config.js";

class RedisQueue extends QueueInterface {
  constructor() {
    super();
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST || "localhost"}:6379`,
    });
    this.client.on("error", (err) => logger.error("Redis Client Error", err));
    this.client.on("connect", () => logger.info("Redis Client Connected"));
    this.connect().catch((err) =>
      logger.error("Failed to connect to Redis:", err)
    );
  }

  async connect() {
    try {
      if (!this.client.isOpen) await this.client.connect();
    } catch (err) {
      logger.error("Failed to connect to Redis:", err);
    }
  }

  async addJob(job) {
    try {
      await this.client.lPush(QUEUE_NAME, JSON.stringify(job));
    } catch (err) {
      logger.error("Failed to add job to queue:", err);
    }
  }

  async getJob() {
    try {
      const job = await this.client.rPop(QUEUE_NAME);
      return job ? JSON.parse(job) : null;
    } catch (err) {
      logger.error("Failed to get job from queue:", err);
      return null;
    }
  }

  async completeJob() {
    try {
      await this.client.incr(PROCESSED_JOBS);
    } catch (err) {
      logger.error("Failed to increment processed jobs:", err);
    }
  }

  async incrementFailedJobs() {
    try {
      await this.client.incr(FAILURE_COUNT);
    } catch (err) {
      logger.error("Failed to increment failure count:", err);
    }
  }

  async incrementRetries() {
    try {
      await this.client.incr(RETRIES_COUNT);
    } catch (err) {
      logger.error("Failed to increment retries count:", err);
    }
  }

  async getMetrics() {
    try {
      const processedJobs = Number(await this.client.get(PROCESSED_JOBS)) || 0;
      const failures = Number(await this.client.get(FAILURE_COUNT)) || 0;
      const retries = Number(await this.client.get(RETRIES_COUNT)) || 0;
      const queueSize = await this.client.lLen(QUEUE_NAME);
      const deadLetterQueueItems = await this.client.lRange(
        DEAD_LETTER_QUEUE_NAME,
        0,
        -1
      );
      const blacklistedEndpointsCount = await this.client.sCard(
        BLACKLISTED_ENDPOINTS
      );
      const blacklistedURLs = await this.client.sMembers(BLACKLISTED_ENDPOINTS);

      return {
        processedJobs,
        failedJobs: failures,
        retries,
        queueSize,
        blacklistedEndpoints: blacklistedEndpointsCount,
        blacklistedURLs,
        deadLetterQueueItems: deadLetterQueueItems.map(JSON.parse),
      };
    } catch (err) {
      logger.error("Failed to retrieve metrics:", err);
      return null;
    }
  }

  async trackFailure(url) {
    try {
      const failures = await this.client.hIncrBy(FAILURE_COUNTS, url, 1);

      if (failures >= MAX_RETRIES) {
        await this.client.sAdd(BLACKLISTED_ENDPOINTS, url);
        await this.client.hDel(FAILURE_COUNTS, url);
      }
    } catch (err) {
      logger.error("Failed to track failure for URL:", err);
    }
  }

  async isBlacklisted(url) {
    try {
      return await this.client.sIsMember(BLACKLISTED_ENDPOINTS, url);
    } catch (err) {
      logger.error("Failed to check if URL is blacklisted:", err);
      return false;
    }
  }

  /**
   * Adds a job to the Dead Letter Queue (DLQ) only if it is not already there.
   * @param {Object} job - The job to add to DLQ.
   */
  async addToDeadLetterQueue(job) {
    const jobIdentifier = `${job.url}:${job.orderId}`;
    const alreadyInDLQ = await this.client.sIsMember(
      DEAD_LETTER_QUEUE_NAME,
      jobIdentifier
    );

    if (!alreadyInDLQ) {
      await this.client.sAdd(DEAD_LETTER_QUEUE_NAME, jobIdentifier);
      await this.client.lPush(DEAD_LETTER_QUEUE_NAME, JSON.stringify(job));
    }
  }

  async resetMetrics() {
    try {
      await this.client.del(
        QUEUE_NAME,
        DEAD_LETTER_QUEUE_NAME,
        FAILURE_COUNT,
        FAILURE_COUNTS,
        BLACKLISTED_ENDPOINTS,
        PROCESSED_JOBS,
        RETRIES_COUNT
      );
    } catch (err) {
      logger.error("Failed to reset metrics:", err);
    }
  }

  async disconnect() {
    if (this.client.isOpen) {
      try {
        await this.client.quit();
      } catch (err) {
        logger.error("Failed to disconnect Redis client:", err);
      }
    }
  }
}

export default new RedisQueue();
