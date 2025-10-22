"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSyncServerStatus = useSyncServerStatus;
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var redux_1 = require("@desktop-client/redux");
function useSyncServerStatus() {
    var serverUrl = (0, ServerContext_1.useServerURL)();
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    if (!serverUrl) {
        return 'no-server';
    }
    return !userData || (userData === null || userData === void 0 ? void 0 : userData.offline) ? 'offline' : 'online';
}
