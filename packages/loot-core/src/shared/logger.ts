/**
 * 🧠 A+ Logger — Unified structured logging system for ActualFork
 * ---------------------------------------------------------------
 * Provides contextual, colorized logs with timestamps.
 * Supports log levels, environment awareness, and child loggers.
 */

import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// 🎨 Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// 🧩 Core logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

// 🔧 Child logger factory (for per-module logs)
export function createModuleLogger(moduleName: string) {
  return {
    info: (msg: string) => logger.info(`[${moduleName}] ${msg}`),
    debug: (msg: string) => logger.debug(`[${moduleName}] ${msg}`),
    warn: (msg: string) => logger.warn(`[${moduleName}] ${msg}`),
    error: (msg: string) => logger.error(`[${moduleName}] ${msg}`),
  };
}
