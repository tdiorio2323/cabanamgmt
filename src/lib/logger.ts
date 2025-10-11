/**
 * Production-safe logging utility
 * Only logs in development, silent in production
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info';

function log(level: LogLevel, ...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console[level](...args);
  }

  // In production, you could send to an error tracking service like Sentry
  // if (process.env.NODE_ENV === 'production' && level === 'error') {
  //   Sentry.captureException(args[0]);
  // }
}

export const logger = {
  log: (...args: unknown[]) => log('log', ...args),
  error: (...args: unknown[]) => log('error', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  info: (...args: unknown[]) => log('info', ...args),
};
