"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNotificationInset = exports.removeNotification = exports.addNotification = exports.addGenericErrorNotification = exports.actions = exports.getInitialState = exports.reducer = exports.name = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var i18next_1 = require("i18next");
var uuid_1 = require("uuid");
var appSlice_1 = require("@desktop-client/app/appSlice");
var sliceName = 'notifications';
var initialState = {
    notifications: [],
    inset: {},
};
var notificationsSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        addNotification: function (state, action) {
            var notification = __assign(__assign({}, action.payload.notification), { id: action.payload.notification.id || (0, uuid_1.v4)() });
            if (state.notifications.find(function (n) { return n.id === notification.id; })) {
                return;
            }
            state.notifications = __spreadArray(__spreadArray([], state.notifications, true), [notification], false);
        },
        addGenericErrorNotification: function (state) {
            var notification = {
                id: (0, uuid_1.v4)(),
                type: 'error',
                message: (0, i18next_1.t)('Something internally went wrong. You may want to restart the app if anything looks wrong. ' +
                    'Please report this as a new issue on GitHub.'),
            };
            state.notifications = __spreadArray(__spreadArray([], state.notifications, true), [notification], false);
        },
        removeNotification: function (state, action) {
            state.notifications = state.notifications.filter(function (notif) { return notif.id !== action.payload.id; });
        },
        setNotificationInset: function (state, action) {
            var _a;
            state.inset = ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.inset) ? action.payload.inset : {};
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
    },
});
exports.name = notificationsSlice.name, exports.reducer = notificationsSlice.reducer, exports.getInitialState = notificationsSlice.getInitialState;
exports.actions = __assign({}, notificationsSlice.actions);
exports.addGenericErrorNotification = exports.actions.addGenericErrorNotification, exports.addNotification = exports.actions.addNotification, exports.removeNotification = exports.actions.removeNotification, exports.setNotificationInset = exports.actions.setNotificationInset;
