"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequestBinary = exports.handlers = exports.handleRequest = exports.getMessages = exports.getClock = exports.reset = exports.filterMockData = void 0;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const mockData_json_1 = require("./mockData.json");
const handlers = {};
exports.handlers = handlers;
let currentMockData = mockData_json_1.basic;
let currentClock = (0, crdt_1.makeClock)(new crdt_1.Timestamp(0, 0, '0000000000000000'));
let currentMessages = [];
// Ugh, this is duplicated...
function deserializeValue(value) {
    const type = value[0];
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
handlers['/'] = () => {
    return 'development';
};
handlers['/sync/sync'] = async (data) => {
    const requestPb = crdt_1.SyncProtoBuf.SyncRequest.deserializeBinary(data);
    const since = requestPb.getSince();
    const messages = requestPb.getMessagesList();
    const newMessages = currentMessages.filter(msg => msg.timestamp > since);
    messages.forEach(msg => {
        if (!currentMessages.find(m => m.timestamp === msg.getTimestamp())) {
            currentMessages.push({
                timestamp: msg.getTimestamp(),
                is_encrypted: msg.getIsencrypted(),
                content: msg.getContent_asU8(),
            });
            currentClock.merkle = crdt_1.merkle.insert(currentClock.merkle, crdt_1.Timestamp.parse(msg.getTimestamp()));
        }
    });
    currentClock.merkle = crdt_1.merkle.prune(currentClock.merkle);
    const responsePb = new crdt_1.SyncProtoBuf.SyncResponse();
    responsePb.setMerkle(JSON.stringify(currentClock.merkle));
    newMessages.forEach(msg => {
        const envelopePb = new crdt_1.SyncProtoBuf.MessageEnvelope();
        envelopePb.setTimestamp(msg.timestamp);
        envelopePb.setIsencrypted(msg.is_encrypted);
        envelopePb.setContent(msg.content);
        responsePb.addMessages(envelopePb);
    });
    return responsePb.serializeBinary();
};
handlers['/gocardless/accounts'] = () => {
    // Ignore the parameters and just return the accounts.
    return { accounts: currentMockData.accounts };
};
const filterMockData = func => {
    const copied = JSON.parse(JSON.stringify(mockData_json_1.basic));
    currentMockData = func(copied);
};
exports.filterMockData = filterMockData;
const reset = () => {
    currentMockData = mockData_json_1.basic;
    currentClock = (0, crdt_1.makeClock)(new crdt_1.Timestamp(0, 0, '0000000000000000'));
    currentMessages = [];
};
exports.reset = reset;
const getClock = () => {
    return currentClock;
};
exports.getClock = getClock;
const getMessages = () => {
    return currentMessages.map(msg => {
        const { timestamp, content } = msg;
        const fields = crdt_1.SyncProtoBuf.Message.deserializeBinary(content);
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
const handleRequest = (url, data) => {
    url = url.replace(/http(s)?:\/\/[^/]*/, '');
    if (!handlers[url]) {
        throw new Error('No url handler for ' + url);
    }
    return Promise.resolve(handlers[url](data));
};
exports.handleRequest = handleRequest;
exports.handleRequestBinary = exports.handleRequest;
