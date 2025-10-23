"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = randomBytes;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createKey = createKey;
exports.importKey = importKey;
// @ts-strict-ignore
const crypto_1 = __importDefault(require("crypto"));
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
function randomBytes(n) {
    return crypto_1.default.randomBytes(n);
}
function encrypt(masterKey, value) {
    const masterKeyBuffer = masterKey.getValue().raw;
    // let iv = createKeyBuffer({ numBytes: 12, secret: masterKeyBuffer });
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv(ENCRYPTION_ALGORITHM, masterKeyBuffer, iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        value: encrypted,
        meta: {
            keyId: masterKey.getId(),
            algorithm: ENCRYPTION_ALGORITHM,
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
        },
    };
}
function decrypt(masterKey, encrypted, meta) {
    const masterKeyBuffer = masterKey.getValue().raw;
    const { algorithm, iv: originalIv, authTag: originalAuthTag } = meta;
    const iv = Buffer.from(originalIv, 'base64');
    const authTag = Buffer.from(originalAuthTag, 'base64');
    const decipher = crypto_1.default.createDecipheriv(algorithm, masterKeyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}
function createKey({ secret, salt }) {
    const buffer = createKeyBuffer({ secret, salt });
    return {
        raw: buffer,
        base64: buffer.toString('base64'),
    };
}
function importKey(str) {
    return {
        raw: Buffer.from(str, 'base64'),
        base64: str,
    };
}
/**
 * Generates a Buffer of a desired byte length to be used as either an encryption key or an initialization vector.
 *
 * @private
 */
function createKeyBuffer({ numBytes, secret, salt, }) {
    return crypto_1.default.pbkdf2Sync(secret || crypto_1.default.randomBytes(128).toString('base64'), salt || crypto_1.default.randomBytes(32).toString('base64'), 10000, numBytes || 32, 'sha512');
}
//# sourceMappingURL=encryption-internals.js.map