let verboseMode = true;
export function setVerboseMode(verbose) {
    verboseMode = verbose;
}
export function isVerboseMode() {
    return verboseMode;
}
export const logger = {
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
