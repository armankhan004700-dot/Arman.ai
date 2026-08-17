const { Configuration, OpenAIApi } = require('openai');
const logger = require('../utils/logger');

class OpenAIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.warn('OpenAI API key not configured');
    }
    
    this.client = new OpenAIApi(new Configuration({ apiKey }));
    this.model = 'gpt-3.5-turbo';
  }

  /**
   * Send chat request to OpenAI
   * @param {array} messages - Messages array
   * @param {number} temperature - Response temperature (0-1)
   * @returns {Promise<string>} Response from OpenAI
   */
  async chat(messages, temperature = 0.7) {
    try {
      const response = await this.client.createChatCompletion({
        model: this.model,
        messages,
        temperature,
        max_tokens: 2000
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error(`OpenAI API error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate text completion
   * @param {string} prompt - The prompt
   * @returns {Promise<string>} Completion response
   */
  async complete(prompt) {
    try {
      const response = await this.client.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text.trim();
    } catch (error) {
      logger.error(`OpenAI completion error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = OpenAIService;
