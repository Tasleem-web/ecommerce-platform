export const userConfig = {
  serviceName: 'user-service',
  port: Number(process.env.USER_SERVICE_PORT ?? 4001),
  dbName: process.env.USER_DB_NAME ?? 'users_db',
};
