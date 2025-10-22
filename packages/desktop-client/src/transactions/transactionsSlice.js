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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLastTransaction = exports.updateNewTransactions = exports.setNewTransactions = exports.actions = exports.getInitialState = exports.reducer = exports.name = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var appSlice_1 = require("@desktop-client/app/appSlice");
var sliceName = 'transactions';
var initialState = {
    newTransactions: [],
    matchedTransactions: [],
    lastTransaction: null,
};
var transactionsSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        setNewTransactions: function (state, action) {
            state.newTransactions = action.payload.newTransactions
                ? __spreadArray(__spreadArray([], state.newTransactions, true), action.payload.newTransactions, true) : state.newTransactions;
            state.matchedTransactions = action.payload.matchedTransactions
                ? __spreadArray(__spreadArray([], state.matchedTransactions, true), action.payload.matchedTransactions, true) : state.matchedTransactions;
        },
        updateNewTransactions: function (state, action) {
            state.newTransactions = state.newTransactions.filter(function (id) { return id !== action.payload.id; });
            state.matchedTransactions = state.matchedTransactions.filter(function (id) { return id !== action.payload.id; });
        },
        setLastTransaction: function (state, action) {
            state.lastTransaction = action.payload.transaction;
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
    },
});
exports.name = transactionsSlice.name, exports.reducer = transactionsSlice.reducer, exports.getInitialState = transactionsSlice.getInitialState;
exports.actions = __assign({}, transactionsSlice.actions);
exports.setNewTransactions = (_a = transactionsSlice.actions, _a.setNewTransactions), exports.updateNewTransactions = _a.updateNewTransactions, exports.setLastTransaction = _a.setLastTransaction;
