"use strict";
/**
 * 🧠 A+ Logger — Unified structured logging system for ActualFork
 * ---------------------------------------------------------------
 * Provides contextual, colorized logs with timestamps.
 * Supports log levels, environment awareness, and child loggers.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createModuleLogger = createModuleLogger;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize } = winston_1.default.format;
// 🎨 Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});
// 🧩 Core logger instance
exports.logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston_1.default.transports.Console({
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});
// 🔧 Child logger factory (for per-module logs)
function createModuleLogger(moduleName) {
    return {
        info: (msg) => exports.logger.info(`[${moduleName}] ${msg}`),
        debug: (msg) => exports.logger.debug(`[${moduleName}] ${msg}`),
        warn: (msg) => exports.logger.warn(`[${moduleName}] ${msg}`),
        error: (msg) => exports.logger.error(`[${moduleName}] ${msg}`),
    };
}
//# sourceMappingURL=logger.js.map