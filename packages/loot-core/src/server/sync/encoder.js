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
exports.encode = encode;
exports.decode = decode;
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var log_1 = require("../../platform/server/log");
var encryption = require("../encryption");
var errors_1 = require("../errors");
var prefs = require("../prefs");
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
function encode(groupId, fileId, since, messages) {
    return __awaiter(this, void 0, void 0, function () {
        var encryptKeyId, requestPb, i, msg, envelopePb, messagePb, binaryMsg, encrypted, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encryptKeyId = prefs.getPrefs().encryptKeyId;
                    requestPb = new crdt_1.SyncProtoBuf.SyncRequest();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < messages.length)) return [3 /*break*/, 9];
                    msg = messages[i];
                    envelopePb = new crdt_1.SyncProtoBuf.MessageEnvelope();
                    envelopePb.setTimestamp(msg.timestamp.toString());
                    messagePb = new crdt_1.SyncProtoBuf.Message();
                    messagePb.setDataset(msg.dataset);
                    messagePb.setRow(msg.row);
                    messagePb.setColumn(msg.column);
                    messagePb.setValue(msg.value);
                    binaryMsg = messagePb.serializeBinary();
                    if (!encryptKeyId) return [3 /*break*/, 6];
                    encrypted = new crdt_1.SyncProtoBuf.EncryptedData();
                    result = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, encryption.encrypt(binaryMsg, encryptKeyId)];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    throw new errors_1.SyncError('encrypt-failure', {
                        isMissingKey: e_1.message === 'missing-key',
                    });
                case 5:
                    encrypted.setData(result.value);
                    encrypted.setIv(Buffer.from(result.meta.iv, 'base64'));
                    encrypted.setAuthtag(Buffer.from(result.meta.authTag, 'base64'));
                    envelopePb.setContent(encrypted.serializeBinary());
                    envelopePb.setIsencrypted(true);
                    return [3 /*break*/, 7];
                case 6:
                    envelopePb.setContent(binaryMsg);
                    _a.label = 7;
                case 7:
                    requestPb.addMessages(envelopePb);
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 1];
                case 9:
                    requestPb.setGroupid(groupId);
                    requestPb.setFileid(fileId);
                    requestPb.setKeyid(encryptKeyId);
                    requestPb.setSince(since.toString());
                    return [2 /*return*/, requestPb.serializeBinary()];
            }
        });
    });
}
function decode(data) {
    return __awaiter(this, void 0, void 0, function () {
        var encryptKeyId, responsePb, merkle, list, messages, i, envelopePb, timestamp, encrypted, msg, binary, decrypted, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encryptKeyId = prefs.getPrefs().encryptKeyId;
                    responsePb = crdt_1.SyncProtoBuf.SyncResponse.deserializeBinary(data);
                    merkle = JSON.parse(responsePb.getMerkle());
                    list = responsePb.getMessagesList();
                    messages = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < list.length)) return [3 /*break*/, 9];
                    envelopePb = list[i];
                    timestamp = crdt_1.Timestamp.parse(envelopePb.getTimestamp());
                    encrypted = envelopePb.getIsencrypted();
                    msg = void 0;
                    if (!encrypted) return [3 /*break*/, 6];
                    binary = crdt_1.SyncProtoBuf.EncryptedData.deserializeBinary(envelopePb.getContent());
                    decrypted = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, encryption.decrypt(coerceBuffer(binary.getData()), {
                            keyId: encryptKeyId,
                            algorithm: 'aes-256-gcm',
                            iv: coerceBuffer(binary.getIv()),
                            authTag: coerceBuffer(binary.getAuthtag()),
                        })];
                case 3:
                    decrypted = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    log_1.logger.log(e_2);
                    throw new errors_1.SyncError('decrypt-failure', {
                        isMissingKey: e_2.message === 'missing-key',
                    });
                case 5:
                    msg = crdt_1.SyncProtoBuf.Message.deserializeBinary(decrypted);
                    return [3 /*break*/, 7];
                case 6:
                    msg = crdt_1.SyncProtoBuf.Message.deserializeBinary(envelopePb.getContent());
                    _a.label = 7;
                case 7:
                    messages.push({
                        timestamp: timestamp,
                        dataset: msg.getDataset(),
                        row: msg.getRow(),
                        column: msg.getColumn(),
                        value: msg.getValue(),
                    });
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/, { messages: messages, merkle: merkle }];
            }
        });
    });
}
