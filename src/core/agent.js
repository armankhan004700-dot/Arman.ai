const OpenAIService = require('../services/openai');
const NLP = require('./nlp');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class ArmaniAgent {
  constructor() {
    this.name = process.env.AGENT_NAME || 'Arman';
    this.openai = new OpenAIService();
    this.nlp = new NLP();
    this.conversationHistory = [];
    this.agentId = uuidv4();
    this.systemPrompt = this.buildSystemPrompt();
    logger.info(`${this.name} Agent initialized with ID: ${this.agentId}`);
  }

  buildSystemPrompt() {
    return `You are ${this.name}, an advanced, intelligent AI assistant designed for personal automation and daily task management.
    
    Your personality:
    - Professional yet friendly and approachable
    - Highly knowledgeable and analytical
    - Proactive and solution-oriented
    - Always respectful and helpful
    
    Your core capabilities:
    - Answer questions on virtually any topic with accuracy and clarity
    - Explain complex concepts in simple, understandable terms
    - Analyze data and provide meaningful insights
    - Help with planning, scheduling, and time management
    - Assist with communication and personal tasks
    - Provide recommendations and suggestions
    - Maintain context in conversations for better understanding
    - Learn from interactions to improve responses
    
    Guidelines for responses:
    - Be concise but thorough
    - Break down complex topics into digestible parts
    - Provide actionable advice when analyzing or planning
    - Always prioritize the user's needs and preferences
    - Ask clarifying questions when needed
    - Be honest about limitations
    - Maintain a professional yet personable tone`;
  }

  /**
   * Ask Arman a question
   * @param {string} question - The question to ask
   * @param {object} context - Optional context for better responses
   * @returns {Promise<string>} The answer from Arman
   */
  async ask(question, context = {}) {
    try {
      logger.info(`Question: ${question}`);
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: question,
        timestamp: new Date()
      });

      // Process with NLP to extract intent
      const intent = this.nlp.extractIntent(question);
      logger.info(`Extracted intent: ${intent}`);

      // Get response from OpenAI
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...this.conversationHistory.map(h => ({
          role: h.role,
          content: h.content
        }))
      ];

      const response = await this.openai.chat(messages);
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      return response;
    } catch (error) {
      logger.error(`Error in ask: ${error.message}`);
      throw error;
    }
  }

  /**
   * Explain a topic in detail
   * @param {string} topic - The topic to explain
   * @param {string} depth - Depth of explanation: 'simple', 'medium', 'detailed'
   * @returns {Promise<string>} The explanation
   */
  async explain(topic, depth = 'medium') {
    try {
      logger.info(`Explaining: ${topic} (depth: ${depth})`);
      
      const depthInstructions = {
        simple: 'Explain in very simple terms, suitable for beginners. Use analogies and everyday examples.',
        medium: 'Provide a balanced explanation with clear examples and key concepts.',
        detailed: 'Provide a comprehensive, in-depth explanation with technical details, examples, and implications.'
      };

      const prompt = `${depthInstructions[depth] || depthInstructions.medium}\n\nTopic: ${topic}`;
      
      const messages = [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: prompt }
      ];

      const explanation = await this.openai.chat(messages);
      return explanation;
    } catch (error) {
      logger.error(`Error in explain: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process voice command
   * @param {string} command - Voice command transcription
   * @returns {Promise<object>} Processing result
   */
  async processVoiceCommand(command) {
    try {
      logger.info(`Processing voice command: ${command}`);
      
      const intent = this.nlp.extractIntent(command);
      const entities = this.nlp.extractEntities(command);

      const response = await this.ask(command);
      
      return {
        command,
        intent,
        entities,
        response,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Error processing voice command: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get conversation history
   * @param {number} limit - Number of recent messages to retrieve
   * @returns {array} Conversation history
   */
  getConversationHistory(limit = 10) {
    return this.conversationHistory.slice(-limit);
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory() {
    this.conversationHistory = [];
    logger.info('Conversation history cleared');
  }

  /**
   * Get agent status
   * @returns {object} Agent status information
   */
  getStatus() {
    return {
      name: this.name,
      id: this.agentId,
      status: 'online',
      conversationCount: this.conversationHistory.length,
      uptime: new Date(),
      capabilities: [
        'question-answering',
        'explanation',
        'data-analysis',
        'task-scheduling',
        'communication',
        'planning',
        'voice-commands'
      ]
    };
  }
}

module.exports = ArmaniAgent;
