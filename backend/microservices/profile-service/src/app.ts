import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { Sequelize } from 'sequelize';
import { buildLogger, createSequelize, errorHandler, notFoundHandler, requestLogger, setupSwagger } from '../../shared';
import { profileConfig } from './config';
import { initProfileModel } from './models/profile.model';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { STATUS_CODES } from 'http';

import { profileRouter } from './routes/profile.routes';

export const logger = buildLogger(profileConfig.serviceName);

export interface AppContext {
    app: Express,
    sequelize: Sequelize
}


export async function createApp(): Promise<AppContext> {
    const sequelize = createSequelize(profileConfig.dbName, logger);
    initProfileModel(sequelize);
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('MySQL connected & models synced', { db: profileConfig.dbName });

    const service = new ProfileService();
    const controller = new ProfileController(service);

    const app = express();
    app.disable('x-powered-by');
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(requestLogger(logger));
    app.use(rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }))

    setupSwagger(app, {
        title: 'Profile Service API',
        description: 'Authentication and profile-profile endpoints',
        apis: [path.join(__dirname, 'docs')],
        serverUrl: `http://localhost:${profileConfig.port}`,
    });

    app.get('/', (_req: Request, res: Response) => {
        res.json({ message: 'Welcome to the Profile Service API' });
    });

    app.use('/profile', profileRouter(controller));

    app.use(notFoundHandler);
    app.use(errorHandler(logger));

    return { app, sequelize };
}