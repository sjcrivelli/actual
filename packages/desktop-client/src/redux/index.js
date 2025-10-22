"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelector = exports.useDispatch = exports.useStore = exports.createAppAsyncThunk = void 0;
/* eslint-disable no-restricted-imports */
var react_redux_1 = require("react-redux");
var toolkit_1 = require("@reduxjs/toolkit");
exports.createAppAsyncThunk = toolkit_1.createAsyncThunk.withTypes();
exports.useStore = react_redux_1.useStore.withTypes();
exports.useDispatch = react_redux_1.useDispatch.withTypes();
exports.useSelector = react_redux_1.useSelector.withTypes();
