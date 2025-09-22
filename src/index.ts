import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';
import { initializeSocket } from './modules/socket/socket.initialize';

// import { seedPlans } from './modules/plans';

let server: any;

mongoose.connect(config.mongoose.url).then(() => {
  server = app.listen(config.port, () => {
    logger.info(`Listening to Port ${config.port}`);
  });
  
  // Increase server timeouts for long-running operations like Puppeteer
  server.timeout = 600000; // 10 minutes
  server.keepAliveTimeout = 610000; // 10 minutes + 10 seconds
  server.headersTimeout = 620000; // 10 minutes + 20 seconds
  initializeSocket(server);
  logger.info('Connected to MongoDB database');
  logger.info('Server timeouts configured for long-running operations');
});


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
