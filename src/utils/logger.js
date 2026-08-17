const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatLog(level, message) {
    return `[${this.getTimestamp()}] [${level}] ${message}`;
  }

  writeLog(level, message) {
    const formattedMessage = this.formatLog(level, message);
    console.log(formattedMessage);
    
    const logFile = path.join(this.logDir, `arman-${new Date().toISOString().split('T')[0]}.log`);
    try {
      fs.appendFileSync(logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message) {
    this.writeLog('INFO', message);
  }

  error(message) {
    this.writeLog('ERROR', message);
  }

  warn(message) {
    this.writeLog('WARN', message);
  }

  debug(message) {
    if (process.env.DEBUG) {
      this.writeLog('DEBUG', message);
    }
  }
}

module.exports = new Logger();
