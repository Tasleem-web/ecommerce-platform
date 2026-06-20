
import { createApp, logger } from './app';
import { profileConfig } from './config';

async function main() {
    const { app, sequelize } = await createApp();
    const server = app.listen(profileConfig.port, () => {
        logger.info(`${profileConfig.serviceName} listening on http://localhost:${profileConfig.port}`);
        logger.info(`Swagger UI -> http://localhost:${profileConfig.port}/docs`);
    });

    const shutdown = async (signal: string) => {
        logger.info(`Recieved ${signal}, shutting down`);
        server.close();
        await sequelize.close();
        process.exit(0);
    }

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
    const e = err as Error;
    logger.error('Fatal startup error', {
        name: e.name,
        message: e.message,
        stack: e.stack,
        raw: e,
    });
    process.exit(0);
});