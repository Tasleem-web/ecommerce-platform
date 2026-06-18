import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { Sequelize } from 'sequelize';
import {
  buildLogger,
  createSequelize,
  errorHandler,
  notFoundHandler,
  requestLogger,
  setupSwagger,
} from '../../shared';
import { userConfig } from './config';
import { initUserModel } from './models/user.model';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userRouter } from './routes/user.routes';

export const logger = buildLogger(userConfig.serviceName);

export interface AppContext {
  app: Express;
  sequelize: Sequelize;
}

export async function createApp(): Promise<AppContext> {
  const sequelize = createSequelize(userConfig.dbName, logger);
  initUserModel(sequelize);
  await sequelize.authenticate();
  await sequelize.sync();
  logger.info('MySQL connected & models synced', { db: userConfig.dbName });

  const service = new UserService();
  const controller = new UserController(service);

  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger(logger));
  app.use(rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));

  app.get('/health', async (_req: Request, res: Response) => {
    const result = {
      service: userConfig.serviceName,
      status: 'ok' as 'ok' | 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dependencies: {
        database: 'ok' as 'ok' | 'down',
      },
    };

    try {
      await sequelize.authenticate();
    } catch {
      result.dependencies.database = 'down';
      result.status = 'degraded';
    }

    res.status(result.status === 'ok' ? 200 : 503).json(result);
  });

  setupSwagger(app, {
    title: 'User Service API',
    description: 'Authentication and user-profile endpoints',
    apis: [path.join(__dirname, 'docs')],
    serverUrl: `http://localhost:${userConfig.port}`,
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Welcome to the User Service API' });
  });

  app.use('/users', userRouter(controller));

  app.use(notFoundHandler);
  app.use(errorHandler(logger));

  return { app, sequelize };
}
