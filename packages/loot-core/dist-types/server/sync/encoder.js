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
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = encode;
exports.decode = decode;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const log_1 = require("../../platform/server/log");
const encryption = __importStar(require("../encryption"));
const errors_1 = require("../errors");
const prefs = __importStar(require("../prefs"));
function coerceBuffer(value) {
    // The web encryption APIs give us back raw Uint8Array... but our
    // encryption code assumes we can work with it as a buffer. This is
    // a leaky abstraction and ideally the our abstraction over the web
    // encryption APIs should do this.
    if (!Buffer.isBuffer(value)) {
        return Buffer.from(value);
    }
    return value;
}
async function encode(groupId, fileId, since, messages) {
    const { encryptKeyId } = prefs.getPrefs();
    const requestPb = new crdt_1.SyncProtoBuf.SyncRequest();
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const envelopePb = new crdt_1.SyncProtoBuf.MessageEnvelope();
        envelopePb.setTimestamp(msg.timestamp.toString());
        const messagePb = new crdt_1.SyncProtoBuf.Message();
        messagePb.setDataset(msg.dataset);
        messagePb.setRow(msg.row);
        messagePb.setColumn(msg.column);
        messagePb.setValue(msg.value);
        const binaryMsg = messagePb.serializeBinary();
        if (encryptKeyId) {
            const encrypted = new crdt_1.SyncProtoBuf.EncryptedData();
            let result;
            try {
                result = await encryption.encrypt(binaryMsg, encryptKeyId);
            }
            catch (e) {
                throw new errors_1.SyncError('encrypt-failure', {
                    isMissingKey: e.message === 'missing-key',
                });
            }
            encrypted.setData(result.value);
            encrypted.setIv(Buffer.from(result.meta.iv, 'base64'));
            encrypted.setAuthtag(Buffer.from(result.meta.authTag, 'base64'));
            envelopePb.setContent(encrypted.serializeBinary());
            envelopePb.setIsencrypted(true);
        }
        else {
            envelopePb.setContent(binaryMsg);
        }
        requestPb.addMessages(envelopePb);
    }
    requestPb.setGroupid(groupId);
    requestPb.setFileid(fileId);
    requestPb.setKeyid(encryptKeyId);
    requestPb.setSince(since.toString());
    return requestPb.serializeBinary();
}
async function decode(data) {
    const { encryptKeyId } = prefs.getPrefs();
    const responsePb = crdt_1.SyncProtoBuf.SyncResponse.deserializeBinary(data);
    const merkle = JSON.parse(responsePb.getMerkle());
    const list = responsePb.getMessagesList();
    const messages = [];
    for (let i = 0; i < list.length; i++) {
        const envelopePb = list[i];
        const timestamp = crdt_1.Timestamp.parse(envelopePb.getTimestamp());
        const encrypted = envelopePb.getIsencrypted();
        let msg;
        if (encrypted) {
            const binary = crdt_1.SyncProtoBuf.EncryptedData.deserializeBinary(envelopePb.getContent());
            let decrypted;
            try {
                decrypted = await encryption.decrypt(coerceBuffer(binary.getData()), {
                    keyId: encryptKeyId,
                    algorithm: 'aes-256-gcm',
                    iv: coerceBuffer(binary.getIv()),
                    authTag: coerceBuffer(binary.getAuthtag()),
                });
            }
            catch (e) {
                log_1.logger.log(e);
                throw new errors_1.SyncError('decrypt-failure', {
                    isMissingKey: e.message === 'missing-key',
                });
            }
            msg = crdt_1.SyncProtoBuf.Message.deserializeBinary(decrypted);
        }
        else {
            msg = crdt_1.SyncProtoBuf.Message.deserializeBinary(envelopePb.getContent());
        }
        messages.push({
            timestamp,
            dataset: msg.getDataset(),
            row: msg.getRow(),
            column: msg.getColumn(),
            value: msg.getValue(),
        });
    }
    return { messages, merkle };
}
//# sourceMappingURL=encoder.js.map