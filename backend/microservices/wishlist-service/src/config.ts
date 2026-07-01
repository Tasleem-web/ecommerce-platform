export const wishlistConfig = {
  serviceName: 'wishlist-service',
  port: Number(process.env.WISHLIST_SERVICE_PORT ?? 4004),
  dbName: process.env.WISHLIST_DB_NAME ?? 'wishlists_db',
};
