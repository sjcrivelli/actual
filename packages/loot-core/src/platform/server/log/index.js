"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.setVerboseMode = setVerboseMode;
exports.isVerboseMode = isVerboseMode;
var verboseMode = true;
function setVerboseMode(verbose) {
    verboseMode = verbose;
}
function isVerboseMode() {
    return verboseMode;
}
exports.logger = {
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (verboseMode) {
            console.log.apply(console, args);
        }
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(console, args);
    },
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (verboseMode) {
            console.log.apply(console, args);
        }
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, args);
    },
    debug: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (verboseMode) {
            console.debug.apply(console, args);
        }
    },
    group: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (verboseMode) {
            console.group.apply(console, args);
        }
    },
    groupEnd: function () {
        if (verboseMode) {
            console.groupEnd();
        }
    },
};
