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
exports.handleRequestBinary = exports.handlers = exports.handleRequest = exports.getMessages = exports.getClock = exports.reset = exports.filterMockData = void 0;
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var mockData_json_1 = require("./mockData.json");
var handlers = {};
exports.handlers = handlers;
var currentMockData = mockData_json_1.basic;
var currentClock = (0, crdt_1.makeClock)(new crdt_1.Timestamp(0, 0, '0000000000000000'));
var currentMessages = [];
// Ugh, this is duplicated...
function deserializeValue(value) {
    var type = value[0];
    switch (type) {
        case '0':
            return null;
        case 'N':
            return parseFloat(value.slice(2));
        case 'S':
            return value.slice(2);
        default:
    }
    throw new Error('Invalid type key for value: ' + value);
}
handlers['/'] = function () {
    return 'development';
};
handlers['/sync/sync'] = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var requestPb, since, messages, newMessages, responsePb;
    return __generator(this, function (_a) {
        requestPb = crdt_1.SyncProtoBuf.SyncRequest.deserializeBinary(data);
        since = requestPb.getSince();
        messages = requestPb.getMessagesList();
        newMessages = currentMessages.filter(function (msg) { return msg.timestamp > since; });
        messages.forEach(function (msg) {
            if (!currentMessages.find(function (m) { return m.timestamp === msg.getTimestamp(); })) {
                currentMessages.push({
                    timestamp: msg.getTimestamp(),
                    is_encrypted: msg.getIsencrypted(),
                    content: msg.getContent_asU8(),
                });
                currentClock.merkle = crdt_1.merkle.insert(currentClock.merkle, crdt_1.Timestamp.parse(msg.getTimestamp()));
            }
        });
        currentClock.merkle = crdt_1.merkle.prune(currentClock.merkle);
        responsePb = new crdt_1.SyncProtoBuf.SyncResponse();
        responsePb.setMerkle(JSON.stringify(currentClock.merkle));
        newMessages.forEach(function (msg) {
            var envelopePb = new crdt_1.SyncProtoBuf.MessageEnvelope();
            envelopePb.setTimestamp(msg.timestamp);
            envelopePb.setIsencrypted(msg.is_encrypted);
            envelopePb.setContent(msg.content);
            responsePb.addMessages(envelopePb);
        });
        return [2 /*return*/, responsePb.serializeBinary()];
    });
}); };
handlers['/gocardless/accounts'] = function () {
    // Ignore the parameters and just return the accounts.
    return { accounts: currentMockData.accounts };
};
var filterMockData = function (func) {
    var copied = JSON.parse(JSON.stringify(mockData_json_1.basic));
    currentMockData = func(copied);
};
exports.filterMockData = filterMockData;
var reset = function () {
    currentMockData = mockData_json_1.basic;
    currentClock = (0, crdt_1.makeClock)(new crdt_1.Timestamp(0, 0, '0000000000000000'));
    currentMessages = [];
};
exports.reset = reset;
var getClock = function () {
    return currentClock;
};
exports.getClock = getClock;
var getMessages = function () {
    return currentMessages.map(function (msg) {
        var timestamp = msg.timestamp, content = msg.content;
        var fields = crdt_1.SyncProtoBuf.Message.deserializeBinary(content);
        return {
            timestamp: crdt_1.Timestamp.parse(timestamp),
            dataset: fields.getDataset(),
            row: fields.getRow(),
            column: fields.getColumn(),
            value: deserializeValue(fields.getValue()),
        };
    });
};
exports.getMessages = getMessages;
var handleRequest = function (url, data) {
    url = url.replace(/http(s)?:\/\/[^/]*/, '');
    if (!handlers[url]) {
        throw new Error('No url handler for ' + url);
    }
    return Promise.resolve(handlers[url](data));
};
exports.handleRequest = handleRequest;
exports.handleRequestBinary = exports.handleRequest;
