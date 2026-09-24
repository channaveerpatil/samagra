import { appConfig, type LogLevel } from '@/config/appConfig';

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[appConfig.logging.minLevel];
}

function write(level: LogLevel, message: string, context?: unknown): void {
  if (!shouldLog(level)) return;

  const payload = context === undefined ? [message] : [message, context];

  switch (level) {
    case 'debug':
      console.debug(...payload);
      break;
    case 'info':
      console.info(...payload);
      break;
    case 'warn':
      console.warn(...payload);
      break;
    case 'error':
      console.error(...payload);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: unknown) => write('debug', message, context),
  info: (message: string, context?: unknown) => write('info', message, context),
  warn: (message: string, context?: unknown) => write('warn', message, context),
  error: (message: string, context?: unknown) => write('error', message, context),
};
