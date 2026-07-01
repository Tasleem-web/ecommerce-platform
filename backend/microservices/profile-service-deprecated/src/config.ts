export const profileConfig = {
    serviceName: 'profile-service',
    port: +(process.env.PROFILE_SERVICE_PORT ?? 4004),
    dbName: process.env.PROFILE_DB_NAME ?? 'profile_db'
}