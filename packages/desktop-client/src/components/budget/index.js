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
exports.Budget = Budget;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var DynamicBudgetTable_1 = require("./DynamicBudgetTable");
var envelopeBudget = require("./envelope/EnvelopeBudgetComponents");
var EnvelopeBudgetContext_1 = require("./envelope/EnvelopeBudgetContext");
var trackingBudget = require("./tracking/TrackingBudgetComponents");
var TrackingBudgetContext_1 = require("./tracking/TrackingBudgetContext");
var util_1 = require("./util");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useSpreadsheet_1 = require("@desktop-client/hooks/useSpreadsheet");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function BudgetInner(props) {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var currentMonth = monthUtils.currentMonth();
    var spreadsheet = (0, useSpreadsheet_1.useSpreadsheet)();
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var _a = (0, useLocalPref_1.useLocalPref)('budget.summaryCollapsed'), summaryCollapsed = _a[0], setSummaryCollapsedPref = _a[1];
    var _b = (0, useLocalPref_1.useLocalPref)('budget.startMonth'), startMonthPref = _b[0], setStartMonthPref = _b[1];
    var startMonth = startMonthPref || currentMonth;
    var _c = (0, react_1.useState)({
        start: startMonth,
        end: startMonth,
    }), bounds = _c[0], setBounds = _c[1];
    var _d = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _d === void 0 ? 'envelope' : _d;
    var maxMonthsPref = (0, useGlobalPref_1.useGlobalPref)('maxMonths')[0];
    var maxMonths = maxMonthsPref || 1;
    var _e = (0, react_1.useState)(false), initialized = _e[0], setInitialized = _e[1];
    var categoryGroups = (0, useCategories_1.useCategories)().grouped;
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dispatch((0, budgetSlice_1.getCategories)())];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, fetch_1.send)('get-budget-bounds')];
                        case 2:
                            _a = _b.sent(), start = _a.start, end = _a.end;
                            setBounds({ start: start, end: end });
                            return [4 /*yield*/, (0, util_1.prewarmAllMonths)(budgetType, spreadsheet, { start: start, end: end }, startMonth)];
                        case 3:
                            _b.sent();
                            setInitialized(true);
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, []);
    (0, react_1.useEffect)(function () {
        (0, fetch_1.send)('get-budget-bounds').then(function (_a) {
            var start = _a.start, end = _a.end;
            if (bounds.start !== start || bounds.end !== end) {
                setBounds({ start: start, end: end });
            }
        });
    }, [props.accountId]);
    var onMonthSelect = function (month, numDisplayed) { return __awaiter(_this, void 0, void 0, function () {
        var warmingMonth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setStartMonthPref(month);
                    warmingMonth = month;
                    if (!(month < startMonth)) return [3 /*break*/, 2];
                    // pre-warm prev month
                    return [4 /*yield*/, (0, util_1.prewarmMonth)(budgetType, spreadsheet, monthUtils.subMonths(month, 1))];
                case 1:
                    // pre-warm prev month
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!(month > startMonth)) return [3 /*break*/, 4];
                    // pre-warm next month
                    return [4 /*yield*/, (0, util_1.prewarmMonth)(budgetType, spreadsheet, monthUtils.addMonths(month, numDisplayed))];
                case 3:
                    // pre-warm next month
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (warmingMonth === month) {
                        setStartMonthPref(month);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var categoryNameAlreadyExistsNotification = function (name) {
        dispatch((0, notificationsSlice_1.addNotification)({
            notification: {
                type: 'error',
                message: t('Category “{{name}}” already exists in group (it may be hidden)', { name: name }),
            },
        }));
    };
    var onSaveCategory = function (category) { return __awaiter(_this, void 0, void 0, function () {
        var cats, exists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('get-categories')];
                case 1:
                    cats = _a.sent();
                    exists = cats.grouped
                        .filter(function (g) { return g.id === category.group; })[0]
                        .categories.filter(function (c) { return c.name.toUpperCase() === category.name.toUpperCase(); })
                        .filter(function (c) { return (category.id === 'new' ? true : c.id !== category.id); })
                        .length > 0;
                    if (exists) {
                        categoryNameAlreadyExistsNotification(category.name);
                        return [2 /*return*/];
                    }
                    if (category.id === 'new') {
                        dispatch((0, budgetSlice_1.createCategory)({
                            name: category.name,
                            groupId: category.group,
                            isIncome: category.is_income,
                            isHidden: category.hidden,
                        }));
                    }
                    else {
                        dispatch((0, budgetSlice_1.updateCategory)({ category: category }));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onDeleteCategory = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var mustTransfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('must-category-transfer', { id: id })];
                case 1:
                    mustTransfer = _a.sent();
                    if (mustTransfer) {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-category-delete',
                                options: {
                                    category: id,
                                    onDelete: function (transferCategory) {
                                        if (id !== transferCategory) {
                                            dispatch((0, budgetSlice_1.deleteCategory)({ id: id, transferId: transferCategory }));
                                        }
                                    },
                                },
                            },
                        }));
                    }
                    else {
                        dispatch((0, budgetSlice_1.deleteCategory)({ id: id }));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onSaveGroup = function (group) {
        if (group.id === 'new') {
            dispatch((0, budgetSlice_1.createCategoryGroup)({ name: group.name }));
        }
        else {
            dispatch((0, budgetSlice_1.updateCategoryGroup)({ group: group }));
        }
    };
    var onDeleteGroup = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var group, mustTransfer, _i, _a, category;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    group = categoryGroups.find(function (g) { return g.id === id; });
                    mustTransfer = false;
                    _i = 0, _a = group.categories;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    category = _a[_i];
                    return [4 /*yield*/, (0, fetch_1.send)('must-category-transfer', { id: category.id })];
                case 2:
                    if (_b.sent()) {
                        mustTransfer = true;
                        return [3 /*break*/, 4];
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (mustTransfer) {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-category-delete',
                                options: {
                                    group: id,
                                    onDelete: function (transferCategory) {
                                        dispatch((0, budgetSlice_1.deleteCategoryGroup)({ id: id, transferId: transferCategory }));
                                    },
                                },
                            },
                        }));
                    }
                    else {
                        dispatch((0, budgetSlice_1.deleteCategoryGroup)({ id: id }));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onApplyBudgetTemplatesInGroup = function (categories) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch((0, budgetSlice_1.applyBudgetAction)({
                month: startMonth,
                type: 'apply-multiple-templates',
                args: {
                    categories: categories,
                },
            }));
            return [2 /*return*/];
        });
    }); };
    var onBudgetAction = function (month, type, args) {
        dispatch((0, budgetSlice_1.applyBudgetAction)({ month: month, type: type, args: args }));
    };
    var onShowActivity = function (categoryId, month) {
        var filterConditions = [
            { field: 'category', op: 'is', value: categoryId, type: 'id' },
            {
                field: 'date',
                op: 'is',
                value: month,
                options: { month: true },
                type: 'date',
            },
        ];
        navigate('/accounts', {
            state: {
                goBack: true,
                filterConditions: filterConditions,
                categoryId: categoryId,
            },
        });
    };
    var onReorderCategory = function (sortInfo) { return __awaiter(_this, void 0, void 0, function () {
        var cats, moveCandidate, exists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('get-categories')];
                case 1:
                    cats = _a.sent();
                    moveCandidate = cats.list.filter(function (c) { return c.id === sortInfo.id; })[0];
                    exists = cats.grouped
                        .filter(function (g) { return g.id === sortInfo.groupId; })[0]
                        .categories.filter(function (c) { return c.name.toUpperCase() === moveCandidate.name.toUpperCase(); })
                        .filter(function (c) { return c.id !== moveCandidate.id; }).length > 0;
                    if (exists) {
                        categoryNameAlreadyExistsNotification(moveCandidate.name);
                        return [2 /*return*/];
                    }
                    dispatch((0, budgetSlice_1.moveCategory)({
                        id: sortInfo.id,
                        groupId: sortInfo.groupId,
                        targetId: sortInfo.targetId,
                    }));
                    return [2 /*return*/];
            }
        });
    }); };
    var onReorderGroup = function (sortInfo) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch((0, budgetSlice_1.moveCategoryGroup)({ id: sortInfo.id, targetId: sortInfo.targetId }));
            return [2 /*return*/];
        });
    }); };
    var onToggleCollapse = function () {
        setSummaryCollapsedPref(!summaryCollapsed);
    };
    var trackingComponents = props.trackingComponents, envelopeComponents = props.envelopeComponents;
    if (!initialized || !categoryGroups) {
        return null;
    }
    var table;
    if (budgetType === 'tracking') {
        table = (<TrackingBudgetContext_1.TrackingBudgetProvider summaryCollapsed={summaryCollapsed} onBudgetAction={onBudgetAction} onToggleSummaryCollapse={onToggleCollapse}>
        <DynamicBudgetTable_1.DynamicBudgetTable type={budgetType} prewarmStartMonth={startMonth} startMonth={startMonth} monthBounds={bounds} maxMonths={maxMonths} dataComponents={trackingComponents} onMonthSelect={onMonthSelect} onDeleteCategory={onDeleteCategory} onDeleteGroup={onDeleteGroup} onSaveCategory={onSaveCategory} onSaveGroup={onSaveGroup} onBudgetAction={onBudgetAction} onShowActivity={onShowActivity} onReorderCategory={onReorderCategory} onReorderGroup={onReorderGroup} onApplyBudgetTemplatesInGroup={onApplyBudgetTemplatesInGroup}/>
      </TrackingBudgetContext_1.TrackingBudgetProvider>);
    }
    else {
        table = (<EnvelopeBudgetContext_1.EnvelopeBudgetProvider summaryCollapsed={summaryCollapsed} onBudgetAction={onBudgetAction} onToggleSummaryCollapse={onToggleCollapse}>
        <DynamicBudgetTable_1.DynamicBudgetTable type={budgetType} prewarmStartMonth={startMonth} startMonth={startMonth} monthBounds={bounds} maxMonths={maxMonths} dataComponents={envelopeComponents} onMonthSelect={onMonthSelect} onDeleteCategory={onDeleteCategory} onDeleteGroup={onDeleteGroup} onSaveCategory={onSaveCategory} onSaveGroup={onSaveGroup} onBudgetAction={onBudgetAction} onShowActivity={onShowActivity} onReorderCategory={onReorderCategory} onReorderGroup={onReorderGroup} onApplyBudgetTemplatesInGroup={onApplyBudgetTemplatesInGroup}/>
      </EnvelopeBudgetContext_1.EnvelopeBudgetProvider>);
    }
    return (<useSheetName_1.SheetNameProvider name={monthUtils.sheetForMonth(startMonth)}>
      <view_1.View style={{ flex: 1 }}>{table}</view_1.View>
    </useSheetName_1.SheetNameProvider>);
}
function Budget() {
    var trackingComponents = (0, react_1.useMemo)(function () { return ({
        SummaryComponent: trackingBudget.BudgetSummary,
        ExpenseCategoryComponent: trackingBudget.ExpenseCategoryMonth,
        ExpenseGroupComponent: trackingBudget.ExpenseGroupMonth,
        IncomeCategoryComponent: trackingBudget.IncomeCategoryMonth,
        IncomeGroupComponent: trackingBudget.IncomeGroupMonth,
        BudgetTotalsComponent: trackingBudget.BudgetTotalsMonth,
        IncomeHeaderComponent: trackingBudget.IncomeHeaderMonth,
    }); }, [trackingBudget]);
    var envelopeComponents = (0, react_1.useMemo)(function () { return ({
        SummaryComponent: envelopeBudget.BudgetSummary,
        ExpenseCategoryComponent: envelopeBudget.ExpenseCategoryMonth,
        ExpenseGroupComponent: envelopeBudget.ExpenseGroupMonth,
        IncomeCategoryComponent: envelopeBudget.IncomeCategoryMonth,
        IncomeGroupComponent: envelopeBudget.IncomeGroupMonth,
        BudgetTotalsComponent: envelopeBudget.BudgetTotalsMonth,
        IncomeHeaderComponent: envelopeBudget.IncomeHeaderMonth,
    }); }, [envelopeBudget]);
    // In a previous iteration, the wrapper needs `overflow: hidden` for
    // some reason. Without it at certain dimensions the width/height
    // that autosizer gives us is slightly wrong, causing scrollbars to
    // appear. We might not need it anymore?
    return (<view_1.View style={__assign(__assign({}, styles_1.styles.page), { paddingLeft: 8, paddingRight: 8, overflow: 'hidden' })}>
      <BudgetInner trackingComponents={trackingComponents} envelopeComponents={envelopeComponents}/>
    </view_1.View>);
}
