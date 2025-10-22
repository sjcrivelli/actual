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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTagsDirty = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.findTags = exports.updateTag = exports.deleteAllTags = exports.deleteTag = exports.createTag = exports.reloadTags = exports.getTags = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var fetch_1 = require("loot-core/platform/client/fetch");
var appSlice_1 = require("@desktop-client/app/appSlice");
var redux_1 = require("@desktop-client/redux");
var sliceName = 'tags';
var initialState = {
    tags: [],
    isTagsLoading: false,
    isTagsLoaded: false,
    isTagsDirty: false,
};
var tagSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        markTagsDirty: function (state) {
            _markTagsDirty(state);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
        builder.addCase(exports.createTag.fulfilled, _markTagsDirty);
        builder.addCase(exports.deleteTag.fulfilled, _markTagsDirty);
        builder.addCase(exports.deleteAllTags.fulfilled, _markTagsDirty);
        builder.addCase(exports.updateTag.fulfilled, _markTagsDirty);
        builder.addCase(exports.reloadTags.fulfilled, function (state, action) {
            _loadTags(state, action.payload);
        });
        builder.addCase(exports.reloadTags.rejected, function (state) {
            state.isTagsLoading = false;
        });
        builder.addCase(exports.reloadTags.pending, function (state) {
            state.isTagsLoading = true;
        });
        builder.addCase(exports.getTags.fulfilled, function (state, action) {
            _loadTags(state, action.payload);
        });
        builder.addCase(exports.getTags.rejected, function (state) {
            state.isTagsLoading = false;
        });
        builder.addCase(exports.getTags.pending, function (state) {
            state.isTagsLoading = true;
        });
        builder.addCase(exports.findTags.fulfilled, function (state, action) {
            _loadTags(state, action.payload);
        });
        builder.addCase(exports.findTags.rejected, function (state) {
            state.isTagsLoading = false;
        });
        builder.addCase(exports.findTags.pending, function (state) {
            state.isTagsLoading = true;
        });
    },
});
exports.getTags = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getTags"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var tags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-get')];
            case 1:
                tags = _a.sent();
                return [2 /*return*/, tags];
        }
    });
}); }, {
    condition: function (_, _a) {
        var getState = _a.getState;
        var tags = getState().tags;
        return !tags.isTagsLoading && (tags.isTagsDirty || !tags.isTagsLoaded);
    },
});
exports.reloadTags = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/reloadTags"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var tags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-get')];
            case 1:
                tags = _a.sent();
                return [2 /*return*/, tags];
        }
    });
}); });
exports.createTag = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/createTag"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id;
    var tag = _b.tag, color = _b.color, description = _b.description;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-create', { tag: tag, color: color, description: description })];
            case 1:
                id = _c.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.deleteTag = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/deleteTag"), function (tag) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-delete', tag)];
            case 1:
                id = _a.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.deleteAllTags = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/deleteAllTags"), function (ids) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-delete-all', ids)];
            case 1:
                id = _a.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.updateTag = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/updateTag"), function (tag) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-update', tag)];
            case 1:
                id = _a.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.findTags = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/findTags"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var tags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('tags-find')];
            case 1:
                tags = _a.sent();
                return [2 /*return*/, tags];
        }
    });
}); });
exports.name = tagSlice.name, exports.reducer = tagSlice.reducer, exports.getInitialState = tagSlice.getInitialState;
exports.actions = __assign(__assign({}, tagSlice.actions), { getTags: exports.getTags, reloadTags: exports.reloadTags, createTag: exports.createTag, deleteTag: exports.deleteTag, deleteAllTags: exports.deleteAllTags, updateTag: exports.updateTag, findTags: exports.findTags });
exports.markTagsDirty = tagSlice.actions.markTagsDirty;
function _loadTags(state, tags) {
    state.tags = tags;
    state.isTagsLoading = false;
    state.isTagsLoaded = true;
    state.isTagsDirty = false;
}
function _markTagsDirty(state) {
    state.isTagsDirty = true;
}
