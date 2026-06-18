import { userConfig } from './config';
import { createApp, logger } from './app';

async function main() {
  const { app, sequelize } = await createApp();
  const server = app.listen(userConfig.port, () => {
    logger.info(`${userConfig.serviceName} listening on :${userConfig.port}`);
    logger.info(`Swagger UI -> http://localhost:${userConfig.port}/docs`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down`);
    server.close();
    await sequelize.close();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
  const e = err as Error;
  logger.error('Fatal startup error', {
    name: e?.name,
    message: e?.message,
    stack: e?.stack,
    raw: e,
  });
  process.exit(1);
});
