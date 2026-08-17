const logger = require('../utils/logger');

class DataAnalyzer {
  /**
   * Analyze data
   * @param {array} data - Data array
   * @param {string} type - Analysis type
   * @returns {object} Analysis result
   */
  analyze(data, type = 'statistical') {
    try {
      logger.info(`Analyzing data: ${type}`);

      if (type === 'statistical') {
        return this.statisticalAnalysis(data);
      }

      return { error: 'Unknown analysis type' };
    } catch (error) {
      logger.error(`Error analyzing data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Statistical analysis
   * @param {array} data - Data array
   * @returns {object} Statistical results
   */
  statisticalAnalysis(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return {
      count: data.length,
      sum,
      mean: mean.toFixed(2),
      median,
      min,
      max,
      variance: variance.toFixed(2),
      standardDeviation: stdDev.toFixed(2),
      range: max - min
    };
  }
}

module.exports = new DataAnalyzer();
