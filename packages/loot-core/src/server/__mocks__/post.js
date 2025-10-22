"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.postBinary = exports.post = void 0;
// @ts-strict-ignore
var mockSyncServer_1 = require("../tests/mockSyncServer");
Object.defineProperty(exports, "post", { enumerable: true, get: function () { return mockSyncServer_1.handleRequest; } });
Object.defineProperty(exports, "postBinary", { enumerable: true, get: function () { return mockSyncServer_1.handleRequestBinary; } });
var get = function () {
    throw new Error('get unimplemented');
};
exports.get = get;
