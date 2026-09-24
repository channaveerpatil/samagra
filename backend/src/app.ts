import express, { type Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';
import { attachUser } from './middleware/auth';
import { config } from './config/env';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(requestLogger);
  app.use(attachUser);

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
