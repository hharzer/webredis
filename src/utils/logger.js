const winston = require('winston');
const package = require('../../package.json');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  defaultMeta: { app: package.name },
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;
