import { createApp, logger } from './app';
import { cartConfig } from './config';

async function main() {
  const { app, sequelize } = await createApp();
  const server = app.listen(cartConfig.port, () => {
    logger.info(`${cartConfig.serviceName} listening on :${cartConfig.port}`);
    logger.info(`Swagger UI -> http://localhost:${cartConfig.port}/docs`);
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
