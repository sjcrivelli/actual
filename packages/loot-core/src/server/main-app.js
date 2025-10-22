"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var connection = require("../platform/server/connection");
var app_1 = require("./app");
// Main app
exports.app = (0, app_1.createApp)();
exports.app.events.on('sync', function (event) {
    connection.send('sync-event', event);
});
