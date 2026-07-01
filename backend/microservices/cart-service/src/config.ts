export const cartConfig = {
  serviceName: 'cart-service',
  port: Number(process.env.CART_SERVICE_PORT ?? 4003),
  dbName: process.env.CART_DB_NAME ?? 'carts_db',
};
