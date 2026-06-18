export const productConfig = {
  serviceName: 'product-service',
  port: Number(process.env.PRODUCT_SERVICE_PORT ?? 4002),
  dbName: process.env.PRODUCT_DB_NAME ?? 'products_db',
};
