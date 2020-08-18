const logger = require('./logger');

module.exports = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} - ${req.path} ${res.statusCode} ${duration}ms`, {
      duration,
      status: res.statusCode,
      path: req.path,
    });
  });

  next();
};
