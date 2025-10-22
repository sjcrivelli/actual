"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModifiedTime = exports.removeDirRecursively = exports.removeDir = exports.removeFile = exports.writeFile = exports.readFile = exports.copyFile = exports.size = exports.mkdir = exports.exists = exports.listDir = exports.basename = exports.join = exports.demoBudgetPath = exports.migrationsPath = exports.bundledDatabasePath = exports.getDataDir = exports.init = exports._setDocumentDir = exports.getBudgetDir = exports.getDocumentDir = void 0;
// @ts-strict-ignore
var fs = require("fs");
var path = require("path");
var promise_retry_1 = require("promise-retry");
var shared_1 = require("./shared");
Object.defineProperty(exports, "getDocumentDir", { enumerable: true, get: function () { return shared_1.getDocumentDir; } });
Object.defineProperty(exports, "getBudgetDir", { enumerable: true, get: function () { return shared_1.getBudgetDir; } });
Object.defineProperty(exports, "_setDocumentDir", { enumerable: true, get: function () { return shared_1._setDocumentDir; } });
var rootPath = path.join(__dirname, '..', '..', '..', '..');
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
var init = function () {
    // Nothing to do
};
exports.init = init;
var getDataDir = function () {
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
var basename = function (filepath) { return path.basename(filepath); };
exports.basename = basename;
var listDir = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.readdir(filepath, function (err, files) {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
};
exports.listDir = listDir;
var exists = function (filepath) {
    return new Promise(function (resolve) {
        fs.access(filepath, fs.constants.F_OK, function (err) {
            return resolve(!err);
        });
    });
};
exports.exists = exists;
var mkdir = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(filepath, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(undefined);
            }
        });
    });
};
exports.mkdir = mkdir;
var size = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filepath, function (err, stats) {
            if (err) {
                reject(err);
            }
            else {
                resolve(stats.size);
            }
        });
    });
};
exports.size = size;
var copyFile = function (frompath, topath) {
    return new Promise(function (resolve, reject) {
        var readStream = fs.createReadStream(frompath);
        var writeStream = fs.createWriteStream(topath);
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('open', function () { return readStream.pipe(writeStream); });
        writeStream.once('close', function () { return resolve(true); });
    });
};
exports.copyFile = copyFile;
var readFile = function (filepath, encoding) {
    if (encoding === void 0) { encoding = 'utf8'; }
    if (encoding === 'binary') {
        // `binary` is not actually a valid encoding, you pass `null` into node if
        // you want a buffer
        encoding = null;
    }
    // `any` as cannot refine return with two function overrides
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise(function (resolve, reject) {
        fs.readFile(filepath, encoding, function (err, data) {
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
var writeFile = function (filepath, contents) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, promise_retry_1.default)(function (retry, attempt) {
                        return new Promise(function (resolve, reject) {
                            // @ts-expect-error contents type needs refining
                            fs.writeFile(filepath, contents, 'utf8', function (err) {
                                if (err) {
                                    console.error("Failed to write to ".concat(filepath, ". Attempted ").concat(attempt, " times. Something is locking the file - potentially a virus scanner or backup software."));
                                    reject(err);
                                }
                                else {
                                    if (attempt > 1) {
                                        console.info("Successfully recovered from file lock. It took ".concat(attempt, " retries"));
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
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, undefined];
            case 2:
                err_1 = _a.sent();
                console.error("Unable to recover from file lock on file ".concat(filepath));
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.writeFile = writeFile;
var removeFile = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.unlink(filepath, function (err) {
            return err ? reject(err) : resolve(undefined);
        });
    });
};
exports.removeFile = removeFile;
var removeDir = function (dirpath) {
    return new Promise(function (resolve, reject) {
        fs.rmdir(dirpath, function (err) {
            return err ? reject(err) : resolve(undefined);
        });
    });
};
exports.removeDir = removeDir;
var removeDirRecursively = function (dirpath) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, file, fullpath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, exports.exists)(dirpath)];
            case 1:
                if (!_b.sent()) return [3 /*break*/, 10];
                _i = 0;
                return [4 /*yield*/, (0, exports.listDir)(dirpath)];
            case 2:
                _a = _b.sent();
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                file = _a[_i];
                fullpath = (0, exports.join)(dirpath, file);
                if (!fs.statSync(fullpath).isDirectory()) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, exports.removeDirRecursively)(fullpath)];
            case 4:
                _b.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, (0, exports.removeFile)(fullpath)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8: return [4 /*yield*/, (0, exports.removeDir)(dirpath)];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.removeDirRecursively = removeDirRecursively;
var getModifiedTime = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filepath, function (err, stats) {
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
