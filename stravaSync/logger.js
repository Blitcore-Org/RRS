// logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    // Log in JSON format:
    winston.format.json()
    // Or log in a simpler format:
    // winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'cron.log' }),
    // Also log to the console (optional)
    new winston.transports.Console(),
  ],
});

export default logger;
