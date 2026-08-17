const cron = require('node-cron');
const logger = require('../utils/logger');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class Scheduler {
  constructor() {
    this.tasks = new Map();
    this.jobs = new Map();
    logger.info('Scheduler initialized');
  }

  /**
   * Schedule a task
   * @param {string} taskName - Name of the task
   * @param {string} time - Time in HH:MM format or cron expression
   * @param {string} frequency - 'once', 'daily', 'weekly', 'monthly'
   * @param {function} callback - Function to execute
   * @returns {object} Task details
   */
  scheduleTask(taskName, time, frequency = 'once', callback = null) {
    try {
      const taskId = uuidv4();
      const cronExpression = this.convertToCron(time, frequency);
      
      logger.info(`Scheduling task: ${taskName} at ${time} (${frequency})`);

      const job = cron.schedule(cronExpression, () => {
        logger.info(`Executing task: ${taskName}`);
        if (callback) {
          callback();
        }
      });

      this.tasks.set(taskId, {
        id: taskId,
        name: taskName,
        time,
        frequency,
        cronExpression,
        createdAt: new Date(),
        status: 'active'
      });

      this.jobs.set(taskId, job);

      return {
        id: taskId,
        name: taskName,
        time,
        frequency,
        status: 'scheduled',
        nextRun: this.getNextRunTime(cronExpression)
      };
    } catch (error) {
      logger.error(`Error scheduling task: ${error.message}`);
      throw error;
    }
  }

  /**
   * Schedule a daily task at specific time
   * @param {string} time - Time in HH:MM format
   * @param {function} callback - Function to execute
   * @returns {string} Task ID
   */
  scheduleDailyTask(time, callback) {
    return this.scheduleTask(`Daily task at ${time}`, time, 'daily', callback);
  }

  /**
   * Convert time format to cron expression
   * @param {string} time - Time in HH:MM format
   * @param {string} frequency - Frequency type
   * @returns {string} Cron expression
   */
  convertToCron(time, frequency) {
    const [hours, minutes] = time.split(':').map(Number);
    
    switch (frequency) {
      case 'daily':
        return `${minutes} ${hours} * * *`;
      case 'weekly':
        return `${minutes} ${hours} * * 1`;
      case 'monthly':
        return `${minutes} ${hours} 1 * *`;
      case 'once':
      default:
        return `${minutes} ${hours} * * *`;
    }
  }

  /**
   * Get next run time for a cron expression
   * @param {string} cronExpression - Cron expression
   * @returns {Date} Next run time
   */
  getNextRunTime(cronExpression) {
    try {
      const interval = cron.parseExpression(cronExpression);
      return interval.next().toDate();
    } catch (error) {
      logger.error(`Error calculating next run time: ${error.message}`);
      return null;
    }
  }

  /**
   * Get all scheduled tasks
   * @returns {array} List of tasks
   */
  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  /**
   * Cancel a scheduled task
   * @param {string} taskId - Task ID
   * @returns {boolean} Success status
   */
  cancelTask(taskId) {
    try {
      const job = this.jobs.get(taskId);
      if (job) {
        job.stop();
        job.destroy();
        this.jobs.delete(taskId);
        
        const task = this.tasks.get(taskId);
        if (task) {
          task.status = 'cancelled';
        }
        
        logger.info(`Task cancelled: ${taskId}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error cancelling task: ${error.message}`);
      return false;
    }
  }

  /**
   * Cancel all tasks
   */
  cancelAllTasks() {
    for (const taskId of this.tasks.keys()) {
      this.cancelTask(taskId);
    }
    logger.info('All tasks cancelled');
  }

  /**
   * Get scheduler status
   * @returns {object} Status information
   */
  getStatus() {
    return {
      totalTasks: this.tasks.size,
      activeTasks: Array.from(this.tasks.values()).filter(t => t.status === 'active').length,
      tasks: this.getAllTasks()
    };
  }
}

module.exports = Scheduler;
