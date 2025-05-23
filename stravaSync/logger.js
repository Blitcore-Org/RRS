import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: '/tmp/cron.log',
      options: { flags: 'w' },
      maxsize: 5_000_000,
    }),
    new winston.transports.Console(),
  ],
});

export default logger;
