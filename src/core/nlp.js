const natural = require('natural');
const logger = require('../utils/logger');

class NLP {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.intents = this.defineIntents();
    logger.info('NLP module initialized');
  }

  /**
   * Define intent patterns
   * @returns {object} Intent patterns
   */
  defineIntents() {
    return {
      question: {
        keywords: ['what', 'when', 'where', 'who', 'why', 'how', '?'],
        pattern: /^(what|when|where|who|why|how)\s|\?$/i
      },
      command: {
        keywords: ['send', 'schedule', 'remind', 'call', 'message', 'do', 'make'],
        pattern: /(send|schedule|remind|call|message|do|make|create|set)/i
      },
      explanation: {
        keywords: ['explain', 'describe', 'tell', 'show', 'teach', 'what is'],
        pattern: /(explain|describe|tell|show|teach|what\s+is)/i
      },
      analysis: {
        keywords: ['analyze', 'statistics', 'trend', 'data', 'number'],
        pattern: /(analyze|statistics|trend|data|number|calculate|sum|average)/i
      },
      planning: {
        keywords: ['plan', 'schedule', 'organize', 'arrange', 'prepare', 'suggest'],
        pattern: /(plan|schedule|organize|arrange|prepare|suggest)/i
      },
      greeting: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
        pattern: /(hello|hi|hey|good\s+(morning|evening|afternoon|day))/i
      }
    };
  }

  /**
   * Extract intent from text
   * @param {string} text - Input text
   * @returns {string} Detected intent
   */
  extractIntent(text) {
    const lowerText = text.toLowerCase();
    
    for (const [intentName, intentConfig] of Object.entries(this.intents)) {
      if (intentConfig.pattern.test(text)) {
        logger.info(`Intent detected: ${intentName}`);
        return intentName;
      }
    }
    
    return 'general';
  }

  /**
   * Extract entities from text
   * @param {string} text - Input text
   * @returns {object} Extracted entities
   */
  extractEntities(text) {
    const entities = {
      phoneNumbers: this.extractPhoneNumbers(text),
      emails: this.extractEmails(text),
      dates: this.extractDates(text),
      times: this.extractTimes(text),
      names: this.extractNames(text)
    };
    
    return entities;
  }

  /**
   * Extract phone numbers
   * @param {string} text - Input text
   * @returns {array} Phone numbers found
   */
  extractPhoneNumbers(text) {
    const phonePattern = /\b\d{10}\b|\+\d{1,3}\d{9,}|\(\d{3}\)\s?\d{3}-\d{4}/g;
    return text.match(phonePattern) || [];
  }

  /**
   * Extract email addresses
   * @param {string} text - Input text
   * @returns {array} Email addresses found
   */
  extractEmails(text) {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailPattern) || [];
  }

  /**
   * Extract dates
   * @param {string} text - Input text
   * @returns {array} Dates found
   */
  extractDates(text) {
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},?\s\d{4}\b/gi;
    return text.match(datePattern) || [];
  }

  /**
   * Extract times
   * @param {string} text - Input text
   * @returns {array} Times found
   */
  extractTimes(text) {
    const timePattern = /\b\d{1,2}:\d{2}\s?(AM|PM|am|pm)?\b/g;
    return text.match(timePattern) || [];
  }

  /**
   * Extract names (simple pattern)
   * @param {string} text - Input text
   * @returns {array} Potential names
   */
  extractNames(text) {
    const namePattern = /\b[A-Z][a-z]+\b/g;
    return text.match(namePattern) || [];
  }

  /**
   * Tokenize text
   * @param {string} text - Input text
   * @returns {array} Tokens
   */
  tokenize(text) {
    return this.tokenizer.tokenize(text.toLowerCase());
  }

  /**
   * Calculate text similarity (0-1)
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score
   */
  similarity(text1, text2) {
    const tokens1 = new Set(this.tokenize(text1));
    const tokens2 = new Set(this.tokenize(text2));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * Sentiment analysis
   * @param {string} text - Input text
   * @returns {object} Sentiment analysis result
   */
  analyzeSentiment(text) {
    const positive = ['good', 'great', 'excellent', 'wonderful', 'happy', 'love', 'awesome', 'perfect'];
    const negative = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'sad', 'angry'];
    
    const words = this.tokenize(text);
    const positiveCount = words.filter(w => positive.includes(w)).length;
    const negativeCount = words.filter(w => negative.includes(w)).length;
    
    const sentiment = positiveCount > negativeCount ? 'positive' : 
                     negativeCount > positiveCount ? 'negative' : 'neutral';
    
    return {
      sentiment,
      positiveCount,
      negativeCount,
      score: (positiveCount - negativeCount) / (words.length || 1)
    };
  }
}

module.exports = NLP;
