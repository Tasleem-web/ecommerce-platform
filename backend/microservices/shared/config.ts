import 'dotenv/config';

/**
 * Shared configuration loader for microservices.
 * Each service may extend this with its own `port` / `dbName`.
 */
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

export type NodeEnv = (typeof NodeEnvs)[keyof typeof NodeEnvs];

export interface SharedConfig {
  nodeEnv: NodeEnv;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  kafka: {
    brokers: string;
    clientId: string;
    topicPrefix: string;
    groupId: string;
  };
  mysql: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}

export const sharedConfig: SharedConfig = {
  nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnvs.DEV,
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
  mysql: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS ?? 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID ?? 'ecommerce-user-service',
    topicPrefix: process.env.KAFKA_TOPIC_PREFIX ?? 'ecommerce',
    groupId: process.env.KAFKA_GROUP_ID ?? 'ecommerce-user-service-group',
  },
};
