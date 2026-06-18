import { Sequelize } from 'sequelize';
import { Logger } from 'winston';
import { sharedConfig } from './config';

/**
 * Creates a Sequelize instance for a given database (database-per-service pattern).
 * Each microservice calls this with its own `database` name.
 */
export function createSequelize(database: string, logger: Logger): Sequelize {
  const { host, port, user, password } = sharedConfig.mysql;
  return new Sequelize({
    dialect: 'mysql',
    host,
    port,
    username: user,
    password,
    database,
    logging: (sql: string) => logger.debug(sql),
    pool: { max: 10, min: 0, idle: 10_000 },
    define: { underscored: true, timestamps: true },
  });
}
