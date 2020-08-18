module.exports = {
  port: process.env.PORT || 3000,
  // turn off logging for tests
  logLevel: process.env.NODE_ENV === 'TEST' ? 'fatal' : (process.env.LOG_LEVEL || 'info'),
  redisHost: process.env.REDIS_HOST || 'localhost'
};
