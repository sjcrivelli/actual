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
exports.randomBytes = randomBytes;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createKey = createKey;
exports.importKey = importKey;
// @ts-strict-ignore
var ENCRYPTION_ALGORITHM = 'aes-256-gcm';
function browserAlgorithmName(name) {
    switch (name) {
        case 'aes-256-gcm':
            return 'AES-GCM';
        default:
            throw new Error('unsupported crypto algorithm: ' + name);
    }
}
function randomBytes(n) {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(n)));
}
function encrypt(masterKey, value) {
    return __awaiter(this, void 0, void 0, function () {
        var iv, encryptedArrayBuffer, encrypted, authTag, strippedEncrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    iv = crypto.getRandomValues(new Uint8Array(12));
                    return [4 /*yield*/, crypto.subtle.encrypt({
                            name: browserAlgorithmName(ENCRYPTION_ALGORITHM),
                            iv: iv,
                            tagLength: 128,
                        }, masterKey.getValue().raw, value)];
                case 1:
                    encryptedArrayBuffer = _a.sent();
                    encrypted = Buffer.from(encryptedArrayBuffer);
                    authTag = encrypted.slice(-16);
                    strippedEncrypted = encrypted.slice(0, -16);
                    return [2 /*return*/, {
                            value: strippedEncrypted,
                            meta: {
                                keyId: masterKey.getId(),
                                algorithm: ENCRYPTION_ALGORITHM,
                                iv: Buffer.from(iv).toString('base64'),
                                authTag: authTag.toString('base64'),
                            },
                        }];
            }
        });
    });
}
function decrypt(masterKey, encrypted, meta) {
    return __awaiter(this, void 0, void 0, function () {
        var algorithm, iv, authTag, decrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    algorithm = meta.algorithm, iv = meta.iv, authTag = meta.authTag;
                    return [4 /*yield*/, crypto.subtle.decrypt({
                            name: browserAlgorithmName(algorithm),
                            iv: Buffer.from(iv, 'base64'),
                            tagLength: 128,
                        }, masterKey.getValue().raw, Buffer.concat([encrypted, Buffer.from(authTag, 'base64')]))];
                case 1:
                    decrypted = _a.sent();
                    return [2 /*return*/, Buffer.from(decrypted)];
            }
        });
    });
}
function createKey(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var passwordBuffer, saltBuffer, passwordKey, derivedKey, exported;
        var secret = _b.secret, salt = _b.salt;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    passwordBuffer = Buffer.from(secret);
                    saltBuffer = Buffer.from(salt);
                    return [4 /*yield*/, crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey'])];
                case 1:
                    passwordKey = _c.sent();
                    return [4 /*yield*/, crypto.subtle.deriveKey({
                            name: 'PBKDF2',
                            hash: 'SHA-512',
                            salt: saltBuffer,
                            iterations: 10000,
                        }, passwordKey, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])];
                case 2:
                    derivedKey = _c.sent();
                    return [4 /*yield*/, crypto.subtle.exportKey('raw', derivedKey)];
                case 3:
                    exported = _c.sent();
                    return [2 /*return*/, {
                            raw: derivedKey,
                            base64: Buffer.from(exported).toString('base64'),
                        }];
            }
        });
    });
}
function importKey(str) {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto.subtle.importKey('raw', Buffer.from(str, 'base64'), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])];
                case 1:
                    key = _a.sent();
                    return [2 /*return*/, {
                            raw: key,
                            base64: str,
                        }];
            }
        });
    });
}
