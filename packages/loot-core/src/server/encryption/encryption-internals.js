"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = randomBytes;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createKey = createKey;
exports.importKey = importKey;
// @ts-strict-ignore
var crypto_1 = require("crypto");
var ENCRYPTION_ALGORITHM = 'aes-256-gcm';
function randomBytes(n) {
    return crypto_1.default.randomBytes(n);
}
function encrypt(masterKey, value) {
    var masterKeyBuffer = masterKey.getValue().raw;
    // let iv = createKeyBuffer({ numBytes: 12, secret: masterKeyBuffer });
    var iv = crypto_1.default.randomBytes(12);
    var cipher = crypto_1.default.createCipheriv(ENCRYPTION_ALGORITHM, masterKeyBuffer, iv);
    var encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    var authTag = cipher.getAuthTag();
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
    var masterKeyBuffer = masterKey.getValue().raw;
    var algorithm = meta.algorithm, originalIv = meta.iv, originalAuthTag = meta.authTag;
    var iv = Buffer.from(originalIv, 'base64');
    var authTag = Buffer.from(originalAuthTag, 'base64');
    var decipher = crypto_1.default.createDecipheriv(algorithm, masterKeyBuffer, iv);
    decipher.setAuthTag(authTag);
    var decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}
function createKey(_a) {
    var secret = _a.secret, salt = _a.salt;
    var buffer = createKeyBuffer({ secret: secret, salt: salt });
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
function createKeyBuffer(_a) {
    var numBytes = _a.numBytes, secret = _a.secret, salt = _a.salt;
    return crypto_1.default.pbkdf2Sync(secret || crypto_1.default.randomBytes(128).toString('base64'), salt || crypto_1.default.randomBytes(32).toString('base64'), 10000, numBytes || 32, 'sha512');
}
