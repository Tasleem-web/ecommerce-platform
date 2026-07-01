import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { Sequelize } from 'sequelize';
import {
  buildLogger,
  createKafkaClient,
  createSequelize,
  errorHandler,
  notFoundHandler,
  requestLogger,
  setupSwagger,
} from '../../shared';
import { sharedConfig } from '../../shared/config';
import { cartConfig } from './config';
import { initCartModel } from './models/cart.model';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { cartRouter } from './routes/cart.route';

export const logger = buildLogger(cartConfig.serviceName);

export interface AppContext {
  app: Express;
  sequelize: Sequelize;
}

export async function createApp(): Promise<AppContext> {
  const kafkaClient = createKafkaClient({
    clientId: sharedConfig.kafka.clientId,
    brokers: sharedConfig.kafka.brokers.split(','),
    topicPrefix: sharedConfig.kafka.topicPrefix,
    groupId: sharedConfig.kafka.groupId,
  });

  const sequelize = createSequelize(cartConfig.dbName, logger);
  initCartModel(sequelize);
  await sequelize.authenticate();
  await sequelize.sync();
  logger.info('MySQL connected & models synced', { db: cartConfig.dbName });

  const service = new CartService(kafkaClient);
  const controller = new CartController(service);

  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger(logger));
  app.use(rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false }));

  app.get('/health', async (_req: Request, res: Response) => {
    const result = {
      service: cartConfig.serviceName,
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
    title: 'Cart Service API',
    description: 'Cart management endpoints (JWT issued by user-service)',
    apis: [path.join(__dirname, 'docs')],
    serverUrl: `http://localhost:${cartConfig.port}`,
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Cart Service API' });
  });

  app.use('/carts', cartRouter(controller));

  app.use(notFoundHandler);
  app.use(errorHandler(logger));

  return { app, sequelize };
}
