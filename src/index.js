const server = require('./server');
const config = require('./config');
const logger = require('./utils/logger');

server.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`, {
    port: config.port,
  });
});
