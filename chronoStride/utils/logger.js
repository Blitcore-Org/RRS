import winston from 'winston';

const logPath = process.env.LOG_PATH || '/tmp/cron.log';
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: logPath, options: { flags: 'w' }, maxsize: 5_000_000 }),
    new winston.transports.Console()
  ],
});

export default logger;