"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.setVerboseMode = setVerboseMode;
exports.isVerboseMode = isVerboseMode;
let verboseMode = true;
function setVerboseMode(verbose) {
    verboseMode = verbose;
}
function isVerboseMode() {
    return verboseMode;
}
exports.logger = {
    info: (...args) => {
        if (verboseMode) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        console.warn(...args);
    },
    log: (...args) => {
        if (verboseMode) {
            console.log(...args);
        }
    },
    error: (...args) => {
        console.error(...args);
    },
    debug: (...args) => {
        if (verboseMode) {
            console.debug(...args);
        }
    },
    group: (...args) => {
        if (verboseMode) {
            console.group(...args);
        }
    },
    groupEnd: () => {
        if (verboseMode) {
            console.groupEnd();
        }
    },
};
//# sourceMappingURL=index.js.map