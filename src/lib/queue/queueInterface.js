// src/lib/queue/queueInterface.js

/**
 * Abstract interface for a queue system. Each method must be implemented by any class
 * extending QueueInterface.
 */
export default class QueueInterface {
  
    /**
     * Adds a job to the queue.
     * @param {Object} job - The job to be added.
     * @param {number} priority - Priority level, where higher numbers have higher priority.
     */
    async addJob(job, priority) {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Retrieves the next job from the queue.
     * @returns {Object|null} - The job object if available, otherwise null.
     */
    async getJob() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Marks a job as completed and increments the processed job count.
     */
    async completeJob() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Increments the count for failed jobs.
     */
    async incrementFailedJobs() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Increments the count for retries.
     */
    async incrementRetries() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Retrieves all current metrics of the queue, including queue size, retries, and failures.
     * @returns {object} - The metrics object.
     */
    async getMetrics() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Tracks a failure for a specific URL, adding it to the blacklist if failure threshold is reached.
     * @param {string} url - URL to be tracked for failures.
     */
    async trackFailure(url) {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Checks if a specific URL is blacklisted.
     * @param {string} url - The URL to check.
     * @returns {boolean} - True if the URL is blacklisted, otherwise false.
     */
    async isBlacklisted(url) {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Adds a job to the Dead Letter Queue if it cannot be processed successfully.
     * @param {Object} job - The job to be moved to the DLQ.
     */
    async addToDeadLetterQueue(job) {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Resets all metrics and clears the queue, blacklisted URLs, and failure counts.
     */
    async resetMetrics() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Subscribes to an event in the queue.
     * @param {string} event - The event name.
     * @param {Function} listener - The listener function to execute on the event.
     */
    on(event, listener) {
      throw new Error('Method not implemented.');
    }
  }
  