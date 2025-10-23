"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEvents = exports.send = exports.init = void 0;
let events = [];
const init = function () { };
exports.init = init;
const send = function (type, args) {
    events.push([type, args]);
};
exports.send = send;
const resetEvents = function () {
    events = [];
};
exports.resetEvents = resetEvents;
//# sourceMappingURL=index.js.map