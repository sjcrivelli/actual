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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markCategoriesDirty = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.getCategoriesById = exports.applyBudgetAction = exports.reloadCategories = exports.getCategories = exports.moveCategoryGroup = exports.moveCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.deleteCategoryGroup = exports.updateCategoryGroup = exports.createCategoryGroup = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var i18next_1 = require("i18next");
var memoize_one_1 = require("memoize-one");
var fetch_1 = require("loot-core/platform/client/fetch");
var appSlice_1 = require("@desktop-client/app/appSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var sliceName = 'budget';
var initialState = {
    categories: {
        grouped: [],
        list: [],
    },
    isCategoriesLoading: false,
    isCategoriesLoaded: false,
    isCategoriesDirty: false,
};
var budgetSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        markCategoriesDirty: function (state) {
            _markCategoriesDirty(state);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
        builder.addCase(exports.createCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.updateCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.deleteCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.createCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.updateCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.deleteCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.moveCategoryGroup.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.moveCategory.fulfilled, _markCategoriesDirty);
        builder.addCase(exports.reloadCategories.fulfilled, function (state, action) {
            _loadCategories(state, action.payload);
        });
        builder.addCase(exports.reloadCategories.rejected, function (state) {
            state.isCategoriesLoading = false;
        });
        builder.addCase(exports.reloadCategories.pending, function (state) {
            state.isCategoriesLoading = true;
        });
        builder.addCase(exports.getCategories.fulfilled, function (state, action) {
            _loadCategories(state, action.payload);
        });
        builder.addCase(exports.getCategories.rejected, function (state) {
            state.isCategoriesLoading = false;
        });
        builder.addCase(exports.getCategories.pending, function (state) {
            state.isCategoriesLoading = true;
        });
    },
});
exports.createCategoryGroup = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/createCategoryGroup"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id;
    var name = _b.name;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-group-create', { name: name })];
            case 1:
                id = _c.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.updateCategoryGroup = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/updateCategoryGroup"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _, groupNoCategories;
    var group = _b.group;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _ = group.categories, groupNoCategories = __rest(group, ["categories"]);
                return [4 /*yield*/, (0, fetch_1.send)('category-group-update', groupNoCategories)];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.deleteCategoryGroup = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/deleteCategoryGroup"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id = _b.id, transferId = _b.transferId;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-group-delete', { id: id, transferId: transferId })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.createCategory = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/createCategory"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id;
    var name = _b.name, groupId = _b.groupId, isIncome = _b.isIncome, isHidden = _b.isHidden;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-create', {
                    name: name,
                    groupId: groupId,
                    isIncome: isIncome,
                    hidden: isHidden,
                })];
            case 1:
                id = _c.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.updateCategory = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/updateCategory"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var category = _b.category;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-update', category)];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.deleteCategory = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/deleteCategory"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var error;
    var id = _c.id, transferId = _c.transferId;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-delete', { id: id, transferId: transferId })];
            case 1:
                error = (_e.sent()).error;
                if (error) {
                    switch (error) {
                        case 'category-type':
                            dispatch((0, notificationsSlice_1.addNotification)({
                                notification: {
                                    id: "".concat(sliceName, "/deleteCategory/transfer"),
                                    type: 'error',
                                    message: (0, i18next_1.t)('A category must be transferred to another of the same type (expense or income)'),
                                },
                            }));
                            break;
                        default:
                            dispatch((0, notificationsSlice_1.addGenericErrorNotification)());
                    }
                    throw new Error(error);
                }
                return [2 /*return*/];
        }
    });
}); });
exports.moveCategory = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/moveCategory"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id = _b.id, groupId = _b.groupId, targetId = _b.targetId;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-move', { id: id, groupId: groupId, targetId: targetId })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.moveCategoryGroup = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/moveCategoryGroup"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id = _b.id, targetId = _b.targetId;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('category-group-move', { id: id, targetId: targetId })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
function translateCategories(categories) {
    return categories === null || categories === void 0 ? void 0 : categories.map(function (cat) {
        var _a;
        return (__assign(__assign({}, cat), { name: ((_a = cat.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'starting balances'
                ? (0, i18next_1.t)('Starting Balances')
                : cat.name }));
    });
}
exports.getCategories = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getCategories"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('get-categories')];
            case 1:
                categories = _a.sent();
                categories.list = translateCategories(categories.list);
                categories.grouped.forEach(function (group) {
                    group.categories = translateCategories(group.categories);
                });
                return [2 /*return*/, categories];
        }
    });
}); }, {
    condition: function (_, _a) {
        var getState = _a.getState;
        var budget = getState().budget;
        return (!budget.isCategoriesLoading &&
            (budget.isCategoriesDirty || !budget.isCategoriesLoaded));
    },
});
exports.reloadCategories = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/reloadCategories"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('get-categories')];
            case 1:
                categories = _a.sent();
                categories.list = translateCategories(categories.list);
                categories.grouped.forEach(function (group) {
                    group.categories = translateCategories(group.categories);
                });
                return [2 /*return*/, categories];
        }
    });
}); });
exports.applyBudgetAction = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/applyBudgetAction"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var _t, _u, _v, _w, _x, _y;
    var month = _c.month, type = _c.type, args = _c.args;
    var dispatch = _d.dispatch;
    return __generator(this, function (_z) {
        switch (_z.label) {
            case 0:
                _e = type;
                switch (_e) {
                    case 'budget-amount': return [3 /*break*/, 1];
                    case 'copy-last': return [3 /*break*/, 3];
                    case 'set-zero': return [3 /*break*/, 5];
                    case 'set-3-avg': return [3 /*break*/, 7];
                    case 'set-6-avg': return [3 /*break*/, 9];
                    case 'set-12-avg': return [3 /*break*/, 11];
                    case 'check-templates': return [3 /*break*/, 13];
                    case 'apply-goal-template': return [3 /*break*/, 15];
                    case 'overwrite-goal-template': return [3 /*break*/, 17];
                    case 'apply-single-category-template': return [3 /*break*/, 19];
                    case 'cleanup-goal-template': return [3 /*break*/, 21];
                    case 'hold': return [3 /*break*/, 23];
                    case 'reset-hold': return [3 /*break*/, 25];
                    case 'cover-overspending': return [3 /*break*/, 27];
                    case 'transfer-available': return [3 /*break*/, 29];
                    case 'cover-overbudgeted': return [3 /*break*/, 31];
                    case 'transfer-category': return [3 /*break*/, 33];
                    case 'carryover': return [3 /*break*/, 35];
                    case 'reset-income-carryover': return [3 /*break*/, 37];
                    case 'apply-multiple-templates': return [3 /*break*/, 39];
                    case 'set-single-3-avg': return [3 /*break*/, 41];
                    case 'set-single-6-avg': return [3 /*break*/, 43];
                    case 'set-single-12-avg': return [3 /*break*/, 45];
                    case 'copy-single-last': return [3 /*break*/, 47];
                }
                return [3 /*break*/, 49];
            case 1: return [4 /*yield*/, (0, fetch_1.send)('budget/budget-amount', {
                    month: month,
                    category: args.category,
                    amount: args.amount,
                })];
            case 2:
                _z.sent();
                return [3 /*break*/, 50];
            case 3: return [4 /*yield*/, (0, fetch_1.send)('budget/copy-previous-month', { month: month })];
            case 4:
                _z.sent();
                return [3 /*break*/, 50];
            case 5: return [4 /*yield*/, (0, fetch_1.send)('budget/set-zero', { month: month })];
            case 6:
                _z.sent();
                return [3 /*break*/, 50];
            case 7: return [4 /*yield*/, (0, fetch_1.send)('budget/set-3month-avg', { month: month })];
            case 8:
                _z.sent();
                return [3 /*break*/, 50];
            case 9: return [4 /*yield*/, (0, fetch_1.send)('budget/set-6month-avg', { month: month })];
            case 10:
                _z.sent();
                return [3 /*break*/, 50];
            case 11: return [4 /*yield*/, (0, fetch_1.send)('budget/set-12month-avg', { month: month })];
            case 12:
                _z.sent();
                return [3 /*break*/, 50];
            case 13:
                _f = dispatch;
                _g = notificationsSlice_1.addNotification;
                _t = {};
                return [4 /*yield*/, (0, fetch_1.send)('budget/check-templates')];
            case 14:
                _f.apply(void 0, [_g.apply(void 0, [(_t.notification = _z.sent(),
                            _t)])]);
                return [3 /*break*/, 50];
            case 15:
                _h = dispatch;
                _j = notificationsSlice_1.addNotification;
                _u = {};
                return [4 /*yield*/, (0, fetch_1.send)('budget/apply-goal-template', { month: month })];
            case 16:
                _h.apply(void 0, [_j.apply(void 0, [(_u.notification = _z.sent(),
                            _u)])]);
                return [3 /*break*/, 50];
            case 17:
                _k = dispatch;
                _l = notificationsSlice_1.addNotification;
                _v = {};
                return [4 /*yield*/, (0, fetch_1.send)('budget/overwrite-goal-template', {
                        month: month,
                    })];
            case 18:
                _k.apply(void 0, [_l.apply(void 0, [(_v.notification = _z.sent(),
                            _v)])]);
                return [3 /*break*/, 50];
            case 19:
                _m = dispatch;
                _o = notificationsSlice_1.addNotification;
                _w = {};
                return [4 /*yield*/, (0, fetch_1.send)('budget/apply-single-template', {
                        month: month,
                        category: args.category,
                    })];
            case 20:
                _m.apply(void 0, [_o.apply(void 0, [(_w.notification = _z.sent(),
                            _w)])]);
                return [3 /*break*/, 50];
            case 21:
                _p = dispatch;
                _q = notificationsSlice_1.addNotification;
                _x = {};
                return [4 /*yield*/, (0, fetch_1.send)('budget/cleanup-goal-template', { month: month })];
            case 22:
                _p.apply(void 0, [_q.apply(void 0, [(_x.notification = _z.sent(),
                            _x)])]);
                return [3 /*break*/, 50];
            case 23: return [4 /*yield*/, (0, fetch_1.send)('budget/hold-for-next-month', {
                    month: month,
                    amount: args.amount,
                })];
            case 24:
                _z.sent();
                return [3 /*break*/, 50];
            case 25: return [4 /*yield*/, (0, fetch_1.send)('budget/reset-hold', { month: month })];
            case 26:
                _z.sent();
                return [3 /*break*/, 50];
            case 27: return [4 /*yield*/, (0, fetch_1.send)('budget/cover-overspending', {
                    month: month,
                    to: args.to,
                    from: args.from,
                })];
            case 28:
                _z.sent();
                return [3 /*break*/, 50];
            case 29: return [4 /*yield*/, (0, fetch_1.send)('budget/transfer-available', {
                    month: month,
                    amount: args.amount,
                    category: args.category,
                })];
            case 30:
                _z.sent();
                return [3 /*break*/, 50];
            case 31: return [4 /*yield*/, (0, fetch_1.send)('budget/cover-overbudgeted', {
                    month: month,
                    category: args.category,
                })];
            case 32:
                _z.sent();
                return [3 /*break*/, 50];
            case 33: return [4 /*yield*/, (0, fetch_1.send)('budget/transfer-category', {
                    month: month,
                    amount: args.amount,
                    from: args.from,
                    to: args.to,
                })];
            case 34:
                _z.sent();
                return [3 /*break*/, 50];
            case 35: return [4 /*yield*/, (0, fetch_1.send)('budget/set-carryover', {
                    startMonth: month,
                    category: args.category,
                    flag: args.flag,
                })];
            case 36:
                _z.sent();
                return [3 /*break*/, 50];
            case 37: return [4 /*yield*/, (0, fetch_1.send)('budget/reset-income-carryover', { month: month })];
            case 38:
                _z.sent();
                return [3 /*break*/, 50];
            case 39:
                _r = dispatch;
                _s = notificationsSlice_1.addNotification;
                _y = {};
                return [4 /*yield*/, (0, fetch_1.send)('budget/apply-multiple-templates', {
                        month: month,
                        categoryIds: args.categories,
                    })];
            case 40:
                _r.apply(void 0, [_s.apply(void 0, [(_y.notification = _z.sent(),
                            _y)])]);
                return [3 /*break*/, 50];
            case 41: return [4 /*yield*/, (0, fetch_1.send)('budget/set-n-month-avg', {
                    month: month,
                    N: 3,
                    category: args.category,
                })];
            case 42:
                _z.sent();
                return [3 /*break*/, 50];
            case 43: return [4 /*yield*/, (0, fetch_1.send)('budget/set-n-month-avg', {
                    month: month,
                    N: 6,
                    category: args.category,
                })];
            case 44:
                _z.sent();
                return [3 /*break*/, 50];
            case 45: return [4 /*yield*/, (0, fetch_1.send)('budget/set-n-month-avg', {
                    month: month,
                    N: 12,
                    category: args.category,
                })];
            case 46:
                _z.sent();
                return [3 /*break*/, 50];
            case 47: return [4 /*yield*/, (0, fetch_1.send)('budget/copy-single-month', {
                    month: month,
                    category: args.category,
                })];
            case 48:
                _z.sent();
                return [3 /*break*/, 50];
            case 49:
                console.log("Invalid action type: ".concat(type));
                _z.label = 50;
            case 50: return [2 /*return*/];
        }
    });
}); });
exports.getCategoriesById = (0, memoize_one_1.default)(function (categoryGroups) {
    var res = {};
    categoryGroups === null || categoryGroups === void 0 ? void 0 : categoryGroups.forEach(function (group) {
        var _a;
        (_a = group.categories) === null || _a === void 0 ? void 0 : _a.forEach(function (cat) {
            res[cat.id] = cat;
        });
    });
    return res;
});
exports.name = budgetSlice.name, exports.reducer = budgetSlice.reducer, exports.getInitialState = budgetSlice.getInitialState;
exports.actions = __assign(__assign({}, budgetSlice.actions), { applyBudgetAction: exports.applyBudgetAction, getCategories: exports.getCategories, reloadCategories: exports.reloadCategories, createCategoryGroup: exports.createCategoryGroup, updateCategoryGroup: exports.updateCategoryGroup, deleteCategoryGroup: exports.deleteCategoryGroup, createCategory: exports.createCategory, updateCategory: exports.updateCategory, deleteCategory: exports.deleteCategory, moveCategory: exports.moveCategory, moveCategoryGroup: exports.moveCategoryGroup });
exports.markCategoriesDirty = budgetSlice.actions.markCategoriesDirty;
function _loadCategories(state, categories) {
    state.categories = categories;
    categories.list = translateCategories(categories.list);
    categories.grouped.forEach(function (group) {
        group.categories = translateCategories(group.categories);
    });
    state.isCategoriesLoading = false;
    state.isCategoriesLoaded = true;
    state.isCategoriesDirty = false;
}
function _markCategoriesDirty(state) {
    state.isCategoriesDirty = true;
}
