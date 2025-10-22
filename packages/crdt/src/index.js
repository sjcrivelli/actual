"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncProtoBuf = exports.EncryptedData = exports.MessageEnvelope = exports.Message = exports.SyncResponse = exports.SyncRequest = exports.Timestamp = exports.deserializeClock = exports.serializeClock = exports.makeClientId = exports.makeClock = exports.setClock = exports.getClock = exports.merkle = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
require("./proto/sync_pb.js"); // Import for side effects
var crdt_1 = require("./crdt");
Object.defineProperty(exports, "merkle", { enumerable: true, get: function () { return crdt_1.merkle; } });
Object.defineProperty(exports, "getClock", { enumerable: true, get: function () { return crdt_1.getClock; } });
Object.defineProperty(exports, "setClock", { enumerable: true, get: function () { return crdt_1.setClock; } });
Object.defineProperty(exports, "makeClock", { enumerable: true, get: function () { return crdt_1.makeClock; } });
Object.defineProperty(exports, "makeClientId", { enumerable: true, get: function () { return crdt_1.makeClientId; } });
Object.defineProperty(exports, "serializeClock", { enumerable: true, get: function () { return crdt_1.serializeClock; } });
Object.defineProperty(exports, "deserializeClock", { enumerable: true, get: function () { return crdt_1.deserializeClock; } });
Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return crdt_1.Timestamp; } });
// Access global proto namespace
exports.SyncRequest = globalThis.proto.SyncRequest;
exports.SyncResponse = globalThis.proto.SyncResponse;
exports.Message = globalThis.proto.Message;
exports.MessageEnvelope = globalThis.proto.MessageEnvelope;
exports.EncryptedData = globalThis.proto.EncryptedData;
exports.SyncProtoBuf = globalThis.proto;
