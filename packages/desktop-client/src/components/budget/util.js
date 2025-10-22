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
exports.addToBeBudgetedGroup = addToBeBudgetedGroup;
exports.removeCategoriesFromGroups = removeCategoriesFromGroups;
exports.separateGroups = separateGroups;
exports.makeAmountGrey = makeAmountGrey;
exports.makeBalanceAmountStyle = makeBalanceAmountStyle;
exports.makeAmountFullStyle = makeAmountFullStyle;
exports.findSortDown = findSortDown;
exports.findSortUp = findSortUp;
exports.getScrollbarWidth = getScrollbarWidth;
exports.prewarmMonth = prewarmMonth;
exports.prewarmAllMonths = prewarmAllMonths;
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var i18next_1 = require("i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var MonthsContext_1 = require("./MonthsContext");
function addToBeBudgetedGroup(groups) {
    return __spreadArray([
        {
            id: 'to-budget',
            name: (0, i18next_1.t)('To Budget'),
            categories: [
                {
                    id: 'to-budget',
                    name: (0, i18next_1.t)('To Budget'),
                    group: 'to-budget',
                },
            ],
        }
    ], groups, true);
}
function removeCategoriesFromGroups(categoryGroups) {
    var categoryIds = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        categoryIds[_i - 1] = arguments[_i];
    }
    if (!categoryIds || categoryIds.length === 0)
        return categoryGroups;
    var categoryIdsSet = new Set(categoryIds);
    return categoryGroups
        .map(function (group) {
        var _a, _b;
        return (__assign(__assign({}, group), { categories: (_b = (_a = group.categories) === null || _a === void 0 ? void 0 : _a.filter(function (cat) { return !categoryIdsSet.has(cat.id); })) !== null && _b !== void 0 ? _b : [] }));
    })
        .filter(function (group) { var _a; return (_a = group.categories) === null || _a === void 0 ? void 0 : _a.length; });
}
function separateGroups(categoryGroups) {
    return [
        categoryGroups.filter(function (g) { return !g.is_income; }),
        categoryGroups.find(function (g) { return g.is_income; }),
    ];
}
function makeAmountGrey(value) {
    return value === 0 || value === '0' || value === '' || value == null
        ? { color: theme_1.theme.tableTextSubdued }
        : null;
}
function makeBalanceAmountStyle(value, goalValue, budgetedValue) {
    if (value < 0) {
        return { color: theme_1.theme.errorText };
    }
    if (goalValue == null) {
        var greyed = makeAmountGrey(value);
        if (greyed) {
            return greyed;
        }
    }
    else {
        if (budgetedValue < goalValue) {
            return { color: theme_1.theme.warningText };
        }
        return { color: theme_1.theme.noticeText };
    }
}
function makeAmountFullStyle(value, colors) {
    var positiveColorToUse = (colors === null || colors === void 0 ? void 0 : colors.positiveColor) || theme_1.theme.noticeText;
    var negativeColorToUse = (colors === null || colors === void 0 ? void 0 : colors.negativeColor) || theme_1.theme.errorText;
    var zeroColorToUse = (colors === null || colors === void 0 ? void 0 : colors.zeroColor) || theme_1.theme.tableTextSubdued;
    return {
        color: value < 0
            ? negativeColorToUse
            : value === 0
                ? zeroColorToUse
                : positiveColorToUse,
    };
}
function findSortDown(arr, pos, targetId) {
    if (pos === 'top') {
        return { targetId: targetId };
    }
    else {
        var idx = arr.findIndex(function (item) { return item.id === targetId; });
        if (idx === -1) {
            throw new Error('findSort: item not found: ' + targetId);
        }
        var newIdx = idx + 1;
        if (newIdx < arr.length) {
            return { targetId: arr[newIdx].id };
        }
        else {
            // Move to the end
            return { targetId: null };
        }
    }
}
function findSortUp(arr, pos, targetId) {
    if (pos === 'bottom') {
        return { targetId: targetId };
    }
    else {
        var idx = arr.findIndex(function (item) { return item.id === targetId; });
        if (idx === -1) {
            throw new Error('findSort: item not found: ' + targetId);
        }
        var newIdx = idx - 1;
        if (newIdx >= 0) {
            return { targetId: arr[newIdx].id };
        }
        else {
            // Move to the beginning
            return { targetId: null };
        }
    }
}
function getScrollbarWidth() {
    return Math.max(styles_1.styles.scrollbarWidth - 2, 0);
}
function prewarmMonth(budgetType, spreadsheet, month) {
    return __awaiter(this, void 0, void 0, function () {
        var method, values, _i, values_1, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = budgetType === 'tracking'
                        ? 'tracking-budget-month'
                        : 'envelope-budget-month';
                    return [4 /*yield*/, (0, fetch_1.send)(method, { month: month })];
                case 1:
                    values = _a.sent();
                    for (_i = 0, values_1 = values; _i < values_1.length; _i++) {
                        value = values_1[_i];
                        spreadsheet.prewarmCache(value.name, value);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function prewarmAllMonths(budgetType, spreadsheet, bounds, startMonth) {
    return __awaiter(this, void 0, void 0, function () {
        var numMonths, months;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    numMonths = 3;
                    bounds = (0, MonthsContext_1.getValidMonthBounds)(bounds, monthUtils.subMonths(startMonth, 1), monthUtils.addMonths(startMonth, numMonths + 1));
                    months = monthUtils.rangeInclusive(bounds.start, bounds.end);
                    return [4 /*yield*/, Promise.all(months.map(function (month) { return prewarmMonth(budgetType, spreadsheet, month); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
