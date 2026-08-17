require('dotenv').config();
const express = require('express');
const ArmaniAgent = require('./core/agent');
const Scheduler = require('./core/scheduler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Arman Agent
const arman = new ArmaniAgent();
const scheduler = new Scheduler();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Arman AI is online', 
    agent: arman.getStatus(),
    timestamp: new Date() 
  });
});

// Ask Arman a question
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    logger.info(`Question received: ${question}`);
    const answer = await arman.ask(question);
    
    res.json({ 
      question, 
      answer,
      timestamp: new Date() 
    });
  } catch (error) {
    logger.error(`Error in /api/ask: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Explain a topic
app.post('/api/explain', async (req, res) => {
  try {
    const { topic, depth = 'medium' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    logger.info(`Explanation requested for: ${topic}`);
    const explanation = await arman.explain(topic, depth);
    
    res.json({ 
      topic, 
      explanation,
      depth,
      timestamp: new Date() 
    });
  } catch (error) {
    logger.error(`Error in /api/explain: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Schedule a task
app.post('/api/schedule', async (req, res) => {
  try {
    const { task, time, frequency = 'once' } = req.body;
    if (!task || !time) {
      return res.status(400).json({ error: 'Task and time are required' });
    }
    
    logger.info(`Task scheduled: ${task} at ${time}`);
    const scheduledTask = scheduler.scheduleTask(task, time, frequency);
    
    res.json({ 
      success: true,
      task: scheduledTask,
      timestamp: new Date() 
    });
  } catch (error) {
    logger.error(`Error in /api/schedule: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Send message
app.post('/api/send-message', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }
    
    logger.info(`Message scheduled to: ${to}`);
    const communication = require('./modules/communication');
    const result = await communication.sendMessage(to, message);
    
    res.json({ 
      success: true,
      result,
      timestamp: new Date() 
    });
  } catch (error) {
    logger.error(`Error in /api/send-message: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Analyze data
app.post('/api/analyze', async (req, res) => {
  try {
    const { data, type = 'statistical' } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }
    
    logger.info(`Data analysis requested: ${type}`);
    const analyzer = require('./modules/dataAnalyzer');
    const analysis = analyzer.analyze(data, type);
    
    res.json({ 
      analysis,
      type,
      timestamp: new Date() 
    });
  } catch (error) {
    logger.error(`Error in /api/analyze: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get daily plan
app.get('/api/plan-day', async (req, res) => {
  try {
    logger.info('Daily plan requested');
    const planner = require('./modules/planner');
    const plan = await planner.suggestDayPlan();
    
    res.json({ 
      plan,
      timestamp: new Date() 
    });
  } catch (error) {
    logger.error(`Error in /api/plan-day: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🤖 Arman AI Agent is online on port ${PORT}`);
  logger.info(`💡 Status: Ready to assist`);
  console.log(`\n╭─────────────────────────────────────────────────────────────╮`);
  console.log(`│   Arman AI - Intelligent Agent                           │`);
  console.log(`│   Listening on: http://localhost:${PORT}                   │`);
  console.log(`╰─────────────────────────────────────────────────────────────╯\n`);
});

module.exports = app;
