"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEvents = exports.send = exports.init = void 0;
var events = [];
var init = function () { };
exports.init = init;
var send = function (type, args) {
    events.push([type, args]);
};
exports.send = send;
var resetEvents = function () {
    events = [];
};
exports.resetEvents = resetEvents;
