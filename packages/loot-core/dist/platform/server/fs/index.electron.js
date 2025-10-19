"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModifiedTime = exports.removeDirRecursively = exports.removeDir = exports.removeFile = exports.writeFile = exports.readFile = exports.copyFile = exports.size = exports.mkdir = exports.exists = exports.listDir = exports.basename = exports.join = exports.demoBudgetPath = exports.migrationsPath = exports.bundledDatabasePath = exports.getDataDir = exports.init = exports._setDocumentDir = exports.getBudgetDir = exports.getDocumentDir = void 0;
// @ts-strict-ignore
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const promise_retry_1 = __importDefault(require("promise-retry"));
var shared_1 = require("./shared");
Object.defineProperty(exports, "getDocumentDir", { enumerable: true, get: function () { return shared_1.getDocumentDir; } });
Object.defineProperty(exports, "getBudgetDir", { enumerable: true, get: function () { return shared_1.getBudgetDir; } });
Object.defineProperty(exports, "_setDocumentDir", { enumerable: true, get: function () { return shared_1._setDocumentDir; } });
let rootPath = path.join(__dirname, '..', '..', '..', '..');
switch (path.basename(__filename)) {
    case 'bundle.api.js': // api bundle uses the electron bundle - account for its file structure
        rootPath = path.join(__dirname, '..');
        break;
    case 'bundle.desktop.js': // electron app
        rootPath = path.join(__dirname, '..', '..');
        break;
    default:
        break;
}
const init = () => {
    // Nothing to do
};
exports.init = init;
const getDataDir = () => {
    if (!process.env.ACTUAL_DATA_DIR) {
        throw new Error('ACTUAL_DATA_DIR env variable is required');
    }
    return process.env.ACTUAL_DATA_DIR;
};
exports.getDataDir = getDataDir;
exports.bundledDatabasePath = path.join(rootPath, 'default-db.sqlite');
exports.migrationsPath = path.join(rootPath, 'migrations');
exports.demoBudgetPath = path.join(rootPath, 'demo-budget');
exports.join = path.join;
const basename = filepath => path.basename(filepath);
exports.basename = basename;
const listDir = filepath => new Promise((resolve, reject) => {
    fs.readdir(filepath, (err, files) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(files);
        }
    });
});
exports.listDir = listDir;
const exists = filepath => new Promise(resolve => {
    fs.access(filepath, fs.constants.F_OK, err => {
        return resolve(!err);
    });
});
exports.exists = exists;
const mkdir = filepath => new Promise((resolve, reject) => {
    fs.mkdir(filepath, err => {
        if (err) {
            reject(err);
        }
        else {
            resolve(undefined);
        }
    });
});
exports.mkdir = mkdir;
const size = filepath => new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stats) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(stats.size);
        }
    });
});
exports.size = size;
const copyFile = (frompath, topath) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(frompath);
        const writeStream = fs.createWriteStream(topath);
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('open', () => readStream.pipe(writeStream));
        writeStream.once('close', () => resolve(true));
    });
};
exports.copyFile = copyFile;
const readFile = (filepath, encoding = 'utf8') => {
    if (encoding === 'binary') {
        // `binary` is not actually a valid encoding, you pass `null` into node if
        // you want a buffer
        encoding = null;
    }
    // `any` as cannot refine return with two function overrides
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, encoding, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.readFile = readFile;
const writeFile = async (filepath, contents) => {
    try {
        await (0, promise_retry_1.default)((retry, attempt) => {
            return new Promise((resolve, reject) => {
                // @ts-expect-error contents type needs refining
                fs.writeFile(filepath, contents, 'utf8', err => {
                    if (err) {
                        console.error(`Failed to write to ${filepath}. Attempted ${attempt} times. Something is locking the file - potentially a virus scanner or backup software.`);
                        reject(err);
                    }
                    else {
                        if (attempt > 1) {
                            console.info(`Successfully recovered from file lock. It took ${attempt} retries`);
                        }
                        resolve(undefined);
                    }
                });
            }).catch(retry);
        }, {
            retries: 20,
            minTimeout: 100,
            maxTimeout: 500,
            factor: 1.5,
        });
        return undefined;
    }
    catch (err) {
        console.error(`Unable to recover from file lock on file ${filepath}`);
        throw err;
    }
};
exports.writeFile = writeFile;
const removeFile = filepath => {
    return new Promise(function (resolve, reject) {
        fs.unlink(filepath, err => {
            return err ? reject(err) : resolve(undefined);
        });
    });
};
exports.removeFile = removeFile;
const removeDir = dirpath => {
    return new Promise(function (resolve, reject) {
        fs.rmdir(dirpath, err => {
            return err ? reject(err) : resolve(undefined);
        });
    });
};
exports.removeDir = removeDir;
const removeDirRecursively = async (dirpath) => {
    if (await (0, exports.exists)(dirpath)) {
        for (const file of await (0, exports.listDir)(dirpath)) {
            const fullpath = (0, exports.join)(dirpath, file);
            if (fs.statSync(fullpath).isDirectory()) {
                await (0, exports.removeDirRecursively)(fullpath);
            }
            else {
                await (0, exports.removeFile)(fullpath);
            }
        }
        await (0, exports.removeDir)(dirpath);
    }
};
exports.removeDirRecursively = removeDirRecursively;
const getModifiedTime = filepath => {
    return new Promise(function (resolve, reject) {
        fs.stat(filepath, (err, stats) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(new Date(stats.mtime));
            }
        });
    });
};
exports.getModifiedTime = getModifiedTime;
