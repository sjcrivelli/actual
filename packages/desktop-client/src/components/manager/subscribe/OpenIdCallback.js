"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIdCallback = OpenIdCallback;
var react_1 = require("react");
var fetch_1 = require("loot-core/platform/client/fetch");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function OpenIdCallback() {
    var dispatch = (0, redux_1.useDispatch)();
    (0, react_1.useEffect)(function () {
        var token = new URLSearchParams(window.location.search).get('token');
        (0, fetch_1.send)('subscribe-set-token', { token: token }).then(function () {
            dispatch((0, usersSlice_1.loggedIn)());
        });
    });
    return null;
}
