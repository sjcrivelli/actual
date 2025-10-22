"use strict";
/**
 * 🧠 A+ Logger — Unified structured logging system for ActualFork
 * ---------------------------------------------------------------
 * Provides contextual, colorized logs with timestamps.
 * Supports log levels, environment awareness, and child loggers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createModuleLogger = createModuleLogger;
var winston_1 = require("winston");
var _a = winston_1.default.format, combine = _a.combine, timestamp = _a.timestamp, printf = _a.printf, colorize = _a.colorize;
// 🎨 Custom log format
var logFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp;
    return "[".concat(timestamp, "] ").concat(level, ": ").concat(message);
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
        info: function (msg) { return exports.logger.info("[".concat(moduleName, "] ").concat(msg)); },
        debug: function (msg) { return exports.logger.debug("[".concat(moduleName, "] ").concat(msg)); },
        warn: function (msg) { return exports.logger.warn("[".concat(moduleName, "] ").concat(msg)); },
        error: function (msg) { return exports.logger.error("[".concat(moduleName, "] ").concat(msg)); },
    };
}
