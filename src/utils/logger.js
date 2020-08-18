const winston = require('winston');
const packageJSON = require('../../package.json');
const config = require('../config');

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  defaultMeta: { app: packageJSON.name },
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;
