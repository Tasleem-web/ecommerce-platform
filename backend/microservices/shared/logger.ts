import { createLogger, format, transports, Logger } from 'winston';

export function buildLogger(service: string): Logger {
  return createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    defaultMeta: { service },
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message, service: svc, ...rest }) => {
            const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
            return `${String(timestamp)} [${String(svc)}] ${level}: ${String(message)}${meta}`;
          }),
        ),
      }),
    ],
  });
}
