module.exports = {
  port: process.env.PORT || 3000,
  logLevel: process.env.NODE_ENV === 'TEST' ? 'fatal' : (process.env.LOG_LEVEL || 'info'),
};
