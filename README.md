# Arman AI - Intelligent Task Automation Agent

An advanced AI agent for automating daily tasks, analyzing data, handling communications, and providing intelligent assistance for your digital life. Inspired by cutting-edge AI assistants like JARVIS.

## ✨ Features

✅ **Task Automation** - Automate repetitive daily tasks  
✅ **Data Analysis** - Analyze and interpret data with actionable insights  
✅ **Voice & Messaging** - Make calls and send messages via Twilio  
✅ **Question Answering** - Powered by OpenAI GPT models  
✅ **Explanations** - Get detailed explanations on any topic  
✅ **Planning & Scheduling** - Smart scheduling and task management  
✅ **Natural Language Processing** - Understand user intent and context  
✅ **Daily Task Execution** - Automated daily routines  
✅ **Conversation Memory** - Maintains context across conversations  

## 🏗️ Project Structure

```
arman-ai/
├── src/
│   ├── index.js                 # Main entry point
│   ├── core/
│   │   ├── agent.js             # Core AI agent
│   │   ├── nlp.js               # Natural Language Processing
│   │   └── scheduler.js         # Task scheduler
│   ├── modules/
│   │   ├── communication.js      # Calls, messages, emails
│   │   ├── dataAnalyzer.js       # Data analysis
│   │   ├── taskManager.js        # Task management
│   │   ├── knowledge.js          # Question answering
│   │   └── planner.js            # Planning & suggestions
│   ├── services/
│   │   ├── openai.js             # OpenAI integration
│   │   ├── twilio.js             # Twilio integration
│   │   └── database.js           # Database operations
│   ├── utils/
│   │   ├── logger.js             # Logging
│   │   ├── validators.js         # Input validation
│   │   └── helpers.js            # Helper functions
│   └── config/
│       └── config.js             # Configuration
├── tests/
│   └── agent.test.js             # Unit tests
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

## 🚀 Installation

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- API Keys: OpenAI and Twilio (optional)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/armankhan004700-dot/Arman.ai.git
   cd Arman.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the agent**
   ```bash
   npm start
   ```

5. **For development mode with auto-reload**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

Edit the `.env` file with:

- **OpenAI API Key** - Get from https://platform.openai.com/
- **Twilio Credentials** - Get from https://www.twilio.com/
- **Server Port** - Default: 3000
- **Database Settings** - Configure your database

## 📚 Usage Examples

### 1. Ask Arman a Question
```javascript
const ArmaniAgent = require('./src/core/agent');

const arman = new ArmaniAgent();
arman.ask("What is artificial intelligence?")
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### 2. Send a Message
```javascript
const communication = require('./src/modules/communication');

communication.sendMessage('+1234567890', 'Hello from Arman AI!')
  .then(() => console.log('Message sent'))
  .catch(err => console.error(err));
```

### 3. Schedule Daily Tasks
```javascript
const Scheduler = require('./src/core/scheduler');

const scheduler = new Scheduler();
scheduler.scheduleDailyTask('09:00', async () => {
  console.log('Good morning! Here are your tasks for today...');
});
```

### 4. Analyze Data
```javascript
const analyzer = require('./src/modules/dataAnalyzer');

const data = [10, 20, 30, 40, 50];
const analysis = analyzer.analyze(data);
console.log(analysis);
```

### 5. Get Daily Plan Suggestions
```javascript
const planner = require('./src/modules/planner');

planner.suggestDayPlan()
  .then(plan => console.log(plan))
  .catch(err => console.error(err));
```

## 📞 API Endpoints

### POST /api/ask
Ask Arman a question
```json
{
  "question": "What's the weather forecast?"
}
```

### POST /api/explain
Get detailed explanations
```json
{
  "topic": "Machine Learning",
  "depth": "medium"
}
```

### POST /api/schedule
Schedule a task
```json
{
  "task": "Send reminder email",
  "time": "09:00",
  "frequency": "daily"
}
```

### POST /api/send-message
Send SMS or message
```json
{
  "to": "+1234567890",
  "message": "Hello!"
}
```

### POST /api/analyze
Analyze data
```json
{
  "data": [1, 2, 3, 4, 5],
  "type": "statistical"
}
```

### GET /api/plan-day
Get daily plan suggestions

### GET /health
Check agent status

## 🧠 Core Capabilities

### 🤖 AI Agent
The main intelligence engine powered by OpenAI's GPT models with context awareness and multi-turn conversations.

### 💬 Communication
- Make and receive calls
- Send and receive SMS messages
- Email integration
- Voice message support

### 📊 Data Analysis
- Statistical analysis (mean, median, mode)
- Trend detection and pattern recognition
- Data visualization suggestions
- Predictive insights

### 📋 Task Management
- Create, update, and delete tasks
- Priority management
- Deadline tracking
- Automated reminders

### 🧠 Knowledge Base
- Q&A functionality
- Detailed explanations
- Learning from interactions
- Contextual responses

### 📅 Planning & Scheduling
- Daily routine planning
- Intelligent scheduling
- Time management suggestions
- Calendar integration ready

## 🏠 Daily Life Automation Examples

Arman can automate:

- 📱 **Morning Briefing** - Weather, news, reminders
- 📧 **Email Management** - Compose, send, filter emails
- ☎️ **Call Management** - Screen calls, forward messages
- 📝 **Meeting Scheduling** - Schedule and manage meetings
- 🛒 **Shopping List** - Create and manage shopping lists
- 💰 **Finance Tracking** - Budget and expense management
- 🏃 **Health Monitoring** - Fitness and wellness tracking
- 🍽️ **Meal Planning** - Plan meals and recipes
- 📚 **Learning** - Research and educational tasks
- 🔔 **Reminders & Notifications** - Smart reminders

## 🧪 Testing

Run tests:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

## 🗺️ Roadmap

- [ ] Voice interface with speech-to-text
- [ ] Text-to-speech capabilities
- [ ] Mobile app integration
- [ ] Calendar integration (Google, Outlook)
- [ ] Smart home automation
- [ ] Advanced NLP with memory
- [ ] Machine learning personalization
- [ ] Multi-language support
- [ ] Web dashboard
- [ ] Real-time notifications

## 📖 Documentation

- [Core Agent Documentation](./docs/agent.md)
- [NLP Module Guide](./docs/nlp.md)
- [API Reference](./docs/api.md)
- [Configuration Guide](./docs/config.md)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review examples in the repository

## 👨 Author

**Arman Khan**
- GitHub: [@armankhan004700-dot](https://github.com/armankhan004700-dot)

---

**Arman AI** - Your intelligent assistant for daily automation and smart task management. 🤖✨
