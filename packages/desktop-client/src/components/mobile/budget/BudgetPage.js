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
exports.BudgetPage = BudgetPage;
// @ts-strict-ignore
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var card_1 = require("@actual-app/components/card");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var logo_1 = require("@actual-app/components/icons/logo");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var BudgetTable_1 = require("./BudgetTable");
var appSlice_1 = require("@desktop-client/app/appSlice");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var util_2 = require("@desktop-client/components/budget/util");
var Page_1 = require("@desktop-client/components/Page");
var SyncRefresh_1 = require("@desktop-client/components/SyncRefresh");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useOverspentCategories_1 = require("@desktop-client/hooks/useOverspentCategories");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
var useSpreadsheet_1 = require("@desktop-client/hooks/useSpreadsheet");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var queries_1 = require("@desktop-client/queries");
var redux_1 = require("@desktop-client/redux");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function isBudgetType(input) {
    return ['envelope', 'tracking'].includes(input);
}
function BudgetPage() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var locale = (0, useLocale_1.useLocale)();
    var _a = (0, useCategories_1.useCategories)(), categories = _a.list, categoryGroups = _a.grouped;
    var budgetTypePref = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0];
    var budgetType = isBudgetType(budgetTypePref) ? budgetTypePref : 'envelope';
    var spreadsheet = (0, useSpreadsheet_1.useSpreadsheet)();
    var currMonth = monthUtils.currentMonth();
    var _b = (0, useLocalPref_1.useLocalPref)('budget.startMonth'), _c = _b[0], startMonth = _c === void 0 ? currMonth : _c, setStartMonthPref = _b[1];
    var _d = (0, react_1.useState)({
        start: startMonth,
        end: startMonth,
    }), monthBounds = _d[0], setMonthBounds = _d[1];
    // const [editMode, setEditMode] = useState(false);
    var _e = (0, react_1.useState)(false), initialized = _e[0], setInitialized = _e[1];
    var _numberFormat = (0, useSyncedPref_1.useSyncedPref)('numberFormat')[0];
    var numberFormat = _numberFormat || 'comma-dot';
    var hideFraction = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var dispatch = (0, redux_1.useDispatch)();
    (0, react_1.useEffect)(function () {
        function init() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-budget-bounds')];
                        case 1:
                            _a = _b.sent(), start = _a.start, end = _a.end;
                            setMonthBounds({ start: start, end: end });
                            return [4 /*yield*/, (0, util_2.prewarmMonth)(budgetType, spreadsheet, startMonth)];
                        case 2:
                            _b.sent();
                            setInitialized(true);
                            return [2 /*return*/];
                    }
                });
            });
        }
        init();
    }, [budgetType, startMonth, dispatch, spreadsheet]);
    var onBudgetAction = (0, react_1.useCallback)(function (month, type, args) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch((0, budgetSlice_1.applyBudgetAction)({ month: month, type: type, args: args }));
            return [2 /*return*/];
        });
    }); }, [dispatch]);
    var onShowBudgetSummary = (0, react_1.useCallback)(function () {
        if (budgetType === 'tracking') {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'tracking-budget-summary',
                    options: {
                        month: startMonth,
                    },
                },
            }));
        }
        else {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'envelope-budget-summary',
                    options: {
                        month: startMonth,
                        onBudgetAction: onBudgetAction,
                    },
                },
            }));
        }
    }, [budgetType, dispatch, onBudgetAction, startMonth]);
    var onOpenNewCategoryGroupModal = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'new-category-group',
                options: {
                    onValidate: function (name) { return (!name ? 'Name is required.' : null); },
                    onSubmit: function (name) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'budget-page-menu' }));
                            dispatch((0, budgetSlice_1.createCategoryGroup)({ name: name }));
                            return [2 /*return*/];
                        });
                    }); },
                },
            },
        }));
    }, [dispatch]);
    var onOpenNewCategoryModal = (0, react_1.useCallback)(function (groupId, isIncome) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'new-category',
                options: {
                    onValidate: function (name) { return (!name ? 'Name is required.' : null); },
                    onSubmit: function (name) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-group-menu' }));
                            dispatch((0, budgetSlice_1.createCategory)({ name: name, groupId: groupId, isIncome: isIncome, isHidden: false }));
                            return [2 /*return*/];
                        });
                    }); },
                },
            },
        }));
    }, [dispatch]);
    var onSaveGroup = (0, react_1.useCallback)(function (group) {
        dispatch((0, budgetSlice_1.updateCategoryGroup)({ group: group }));
    }, [dispatch]);
    var onApplyBudgetTemplatesInGroup = (0, react_1.useCallback)(function (categories) { return __awaiter(_this, void 0, void 0, function () {
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
    }); }, [dispatch, startMonth]);
    var onDeleteGroup = (0, react_1.useCallback)(function (groupId) { return __awaiter(_this, void 0, void 0, function () {
        var group, mustTransfer, _i, _a, category;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    group = categoryGroups === null || categoryGroups === void 0 ? void 0 : categoryGroups.find(function (g) { return g.id === groupId; });
                    if (!group) {
                        return [2 /*return*/];
                    }
                    mustTransfer = false;
                    _i = 0, _a = (_b = group.categories) !== null && _b !== void 0 ? _b : [];
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    category = _a[_i];
                    return [4 /*yield*/, (0, fetch_1.send)('must-category-transfer', { id: category.id })];
                case 2:
                    if (_c.sent()) {
                        mustTransfer = true;
                        return [3 /*break*/, 4];
                    }
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (mustTransfer) {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-category-delete',
                                options: {
                                    group: groupId,
                                    onDelete: function (transferCategory) {
                                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-group-menu' }));
                                        dispatch((0, budgetSlice_1.deleteCategoryGroup)({
                                            id: groupId,
                                            transferId: transferCategory,
                                        }));
                                    },
                                },
                            },
                        }));
                    }
                    else {
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-group-menu' }));
                        dispatch((0, budgetSlice_1.deleteCategoryGroup)({ id: groupId }));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [categoryGroups, dispatch]);
    var onToggleGroupVisibility = (0, react_1.useCallback)(function (groupId) {
        var group = categoryGroups.find(function (g) { return g.id === groupId; });
        onSaveGroup(__assign(__assign({}, group), { hidden: !!!group.hidden }));
        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-group-menu' }));
    }, [categoryGroups, dispatch, onSaveGroup]);
    var onSaveCategory = (0, react_1.useCallback)(function (category) {
        dispatch((0, budgetSlice_1.updateCategory)({ category: category }));
    }, [dispatch]);
    var onDeleteCategory = (0, react_1.useCallback)(function (categoryId) { return __awaiter(_this, void 0, void 0, function () {
        var mustTransfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('must-category-transfer', {
                        id: categoryId,
                    })];
                case 1:
                    mustTransfer = _a.sent();
                    if (mustTransfer) {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-category-delete',
                                options: {
                                    category: categoryId,
                                    onDelete: function (transferCategory) {
                                        if (categoryId !== transferCategory) {
                                            dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-menu' }));
                                            dispatch((0, budgetSlice_1.deleteCategory)({
                                                id: categoryId,
                                                transferId: transferCategory,
                                            }));
                                        }
                                    },
                                },
                            },
                        }));
                    }
                    else {
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-menu' }));
                        dispatch((0, budgetSlice_1.deleteCategory)({ id: categoryId }));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [dispatch]);
    var onToggleCategoryVisibility = (0, react_1.useCallback)(function (categoryId) {
        var category = categories.find(function (c) { return c.id === categoryId; });
        onSaveCategory(__assign(__assign({}, category), { hidden: !!!category.hidden }));
        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'category-menu' }));
    }, [categories, dispatch, onSaveCategory]);
    var onPrevMonth = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var month;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    month = monthUtils.subMonths(startMonth, 1);
                    return [4 /*yield*/, (0, util_2.prewarmMonth)(budgetType, spreadsheet, month)];
                case 1:
                    _a.sent();
                    setStartMonthPref(month);
                    setInitialized(true);
                    return [2 /*return*/];
            }
        });
    }); }, [budgetType, setStartMonthPref, spreadsheet, startMonth]);
    var onNextMonth = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var month;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    month = monthUtils.addMonths(startMonth, 1);
                    return [4 /*yield*/, (0, util_2.prewarmMonth)(budgetType, spreadsheet, month)];
                case 1:
                    _a.sent();
                    setStartMonthPref(month);
                    setInitialized(true);
                    return [2 /*return*/];
            }
        });
    }); }, [budgetType, setStartMonthPref, spreadsheet, startMonth]);
    var onCurrentMonth = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, util_2.prewarmMonth)(budgetType, spreadsheet, currMonth)];
                case 1:
                    _a.sent();
                    setStartMonthPref(currMonth);
                    setInitialized(true);
                    return [2 /*return*/];
            }
        });
    }); }, [budgetType, setStartMonthPref, spreadsheet, currMonth]);
    // const onOpenMonthActionMenu = () => {
    //   const options = [
    //     'Copy last month’s budget',
    //     'Set budgets to zero',
    //     'Set budgets to 3 month average',
    //     budgetType === 'tracking' && 'Apply to all future budgets',
    //   ].filter(Boolean);
    //   props.showActionSheetWithOptions(
    //     {
    //       options,
    //       cancelButtonIndex: options.length - 1,
    //       title: 'Actions',
    //     },
    //     idx => {
    //       switch (idx) {
    //         case 0:
    //           setEditMode(true);
    //           break;
    //         case 1:
    //           onBudgetAction('copy-last');
    //           break;
    //         case 2:
    //           onBudgetAction('set-zero');
    //           break;
    //         case 3:
    //           onBudgetAction('set-3-avg');
    //           break;
    //         case 4:
    //           if (budgetType === 'tracking') {
    //             onBudgetAction('set-all-future');
    //           }
    //           break;
    //         default:
    //       }
    //     },
    //   );
    // };
    var onSaveNotes = (0, react_1.useCallback)(function (id, notes) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('notes-save', { id: id, note: notes })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var onOpenCategoryGroupNotesModal = (0, react_1.useCallback)(function (id) {
        var group = categoryGroups.find(function (g) { return g.id === id; });
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'notes',
                options: {
                    id: id,
                    name: group.name,
                    onSave: onSaveNotes,
                },
            },
        }));
    }, [categoryGroups, dispatch, onSaveNotes]);
    var onOpenCategoryNotesModal = (0, react_1.useCallback)(function (id) {
        var category = categories.find(function (c) { return c.id === id; });
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'notes',
                options: {
                    id: id,
                    name: category.name,
                    onSave: onSaveNotes,
                },
            },
        }));
    }, [categories, dispatch, onSaveNotes]);
    var onOpenCategoryGroupMenuModal = (0, react_1.useCallback)(function (id) {
        var group = categoryGroups.find(function (g) { return g.id === id; });
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'category-group-menu',
                options: {
                    groupId: group.id,
                    onSave: onSaveGroup,
                    onAddCategory: onOpenNewCategoryModal,
                    onEditNotes: onOpenCategoryGroupNotesModal,
                    onDelete: onDeleteGroup,
                    onToggleVisibility: onToggleGroupVisibility,
                    onApplyBudgetTemplatesInGroup: onApplyBudgetTemplatesInGroup,
                },
            },
        }));
    }, [
        categoryGroups,
        dispatch,
        onDeleteGroup,
        onOpenCategoryGroupNotesModal,
        onOpenNewCategoryModal,
        onSaveGroup,
        onToggleGroupVisibility,
        onApplyBudgetTemplatesInGroup,
    ]);
    var onOpenCategoryMenuModal = (0, react_1.useCallback)(function (id) {
        var category = categories.find(function (c) { return c.id === id; });
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'category-menu',
                options: {
                    categoryId: category.id,
                    onSave: onSaveCategory,
                    onEditNotes: onOpenCategoryNotesModal,
                    onDelete: onDeleteCategory,
                    onToggleVisibility: onToggleCategoryVisibility,
                },
            },
        }));
    }, [
        categories,
        dispatch,
        onDeleteCategory,
        onOpenCategoryNotesModal,
        onSaveCategory,
        onToggleCategoryVisibility,
    ]);
    var _f = (0, useLocalPref_1.useLocalPref)('budget.showHiddenCategories'), showHiddenCategories = _f[0], setShowHiddenCategoriesPref = _f[1];
    var onToggleHiddenCategories = (0, react_1.useCallback)(function () {
        setShowHiddenCategoriesPref(!showHiddenCategories);
        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'budget-page-menu' }));
    }, [dispatch, setShowHiddenCategoriesPref, showHiddenCategories]);
    var onOpenBudgetMonthNotesModal = (0, react_1.useCallback)(function (month) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'notes',
                options: {
                    id: "budget-".concat(month),
                    name: monthUtils.format(month, 'MMMM ‘yy', locale),
                    onSave: onSaveNotes,
                },
            },
        }));
    }, [dispatch, onSaveNotes, locale]);
    var onSwitchBudgetFile = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'budget-file-selection' } }));
    }, [dispatch]);
    var onOpenBudgetMonthMenu = (0, react_1.useCallback)(function (month) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: "".concat(budgetType, "-budget-month-menu"),
                options: {
                    month: month,
                    onBudgetAction: onBudgetAction,
                    onEditNotes: onOpenBudgetMonthNotesModal,
                },
            },
        }));
    }, [budgetType, dispatch, onBudgetAction, onOpenBudgetMonthNotesModal]);
    var onOpenBudgetPageMenu = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'budget-page-menu',
                options: {
                    onAddCategoryGroup: onOpenNewCategoryGroupModal,
                    onToggleHiddenCategories: onToggleHiddenCategories,
                    onSwitchBudgetFile: onSwitchBudgetFile,
                },
            },
        }));
    }, [
        dispatch,
        onOpenNewCategoryGroupModal,
        onSwitchBudgetFile,
        onToggleHiddenCategories,
    ]);
    if (!categoryGroups || !initialized) {
        return (<view_1.View style={{
                flex: 1,
                backgroundColor: theme_1.theme.mobilePageBackground,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 25,
            }}>
        <AnimatedLoading_1.AnimatedLoading width={25} height={25}/>
      </view_1.View>);
    }
    return (<Page_1.Page padding={0} header={<Page_1.MobilePageHeader title={<MonthSelector month={startMonth} monthBounds={monthBounds} onOpenMonthMenu={onOpenBudgetMonthMenu} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth}/>} leftContent={<button_1.Button variant="bare" style={{ margin: 10 }} onPress={onOpenBudgetPageMenu} aria-label={t('Budget page menu')}>
              <logo_1.SvgLogo style={{ color: theme_1.theme.mobileHeaderText }} width="20" height="20"/>
              <v1_1.SvgCheveronRight style={{ flexShrink: 0, color: theme_1.theme.mobileHeaderTextSubdued }} width="14" height="14"/>
            </button_1.Button>} rightContent={!monthUtils.isCurrentMonth(startMonth) && (<button_1.Button variant="bare" onPress={onCurrentMonth} aria-label={t('Today')} style={{ margin: 10 }}>
                <v2_1.SvgCalendar width={20} height={20}/>
              </button_1.Button>)}/>}>
      <useSheetName_1.SheetNameProvider name={monthUtils.sheetForMonth(startMonth)}>
        <SyncRefresh_1.SyncRefresh onSync={function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                dispatch((0, appSlice_1.sync)());
                return [2 /*return*/];
            });
        }); }}>
          {function (_a) {
            var onRefresh = _a.onRefresh;
            return (<>
              <Banners month={startMonth} onBudgetAction={onBudgetAction}/>
              <BudgetTable_1.BudgetTable 
            // This key forces the whole table rerender when the number
            // format changes
            key={"".concat(numberFormat).concat(hideFraction)} categoryGroups={categoryGroups} month={startMonth} onShowBudgetSummary={onShowBudgetSummary} onBudgetAction={onBudgetAction} onRefresh={onRefresh} onEditCategoryGroup={onOpenCategoryGroupMenuModal} onEditCategory={onOpenCategoryMenuModal}/>
            </>);
        }}
        </SyncRefresh_1.SyncRefresh>
      </useSheetName_1.SheetNameProvider>
    </Page_1.Page>);
}
function Banners(_a) {
    var month = _a.month, onBudgetAction = _a.onBudgetAction;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    return (<react_aria_components_1.GridList aria-label={t('Banners')} style={{ backgroundColor: theme_1.theme.mobilePageBackground }}>
      <UncategorizedTransactionsBanner />
      <OverspendingBanner month={month} onBudgetAction={onBudgetAction} budgetType={budgetType}/>
      {budgetType === 'envelope' && (<OverbudgetedBanner month={month} onBudgetAction={onBudgetAction}/>)}
    </react_aria_components_1.GridList>);
}
function Banner(_a) {
    var _b = _a.type, type = _b === void 0 ? 'info' : _b, children = _a.children;
    return (<card_1.Card style={{
            height: 50,
            marginTop: 10,
            marginBottom: 10,
            padding: 10,
            justifyContent: 'center',
            backgroundColor: type === 'critical'
                ? theme_1.theme.errorBackground
                : type === 'warning'
                    ? theme_1.theme.warningBackground
                    : theme_1.theme.noticeBackground,
        }}>
      {children}
    </card_1.Card>);
}
function UncategorizedTransactionsBanner(props) {
    var navigate = (0, useNavigate_1.useNavigate)();
    var format = (0, useFormat_1.useFormat)();
    var transactionsQuery = (0, react_1.useMemo)(function () { return (0, queries_1.uncategorizedTransactions)().select('*'); }, []);
    var _a = (0, useTransactions_1.useTransactions)({
        query: transactionsQuery,
        options: {
            pageCount: 1000,
        },
    }), transactions = _a.transactions, isLoading = _a.isLoading;
    if (isLoading || transactions.length === 0) {
        return null;
    }
    var totalUncategorizedAmount = transactions.reduce(function (sum, t) { var _a; return sum + ((_a = t.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
    return (<react_aria_components_1.GridListItem textValue="Uncategorized transactions banner" {...props}>
      <Banner type="warning">
        <view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
          <react_i18next_1.Trans count={transactions.length}>
            You have {{ count: transactions.length }} uncategorized transactions
            ({{ amount: format(totalUncategorizedAmount, 'financial') }})
          </react_i18next_1.Trans>
          <button_1.Button onPress={function () { return navigate('/categories/uncategorized'); }} style={BudgetTable_1.PILL_STYLE}>
            <text_1.Text>
              <react_i18next_1.Trans>Categorize</react_i18next_1.Trans>
            </text_1.Text>
          </button_1.Button>
        </view_1.View>
      </Banner>
    </react_aria_components_1.GridListItem>);
}
function OverbudgetedBanner(_a) {
    var month = _a.month, onBudgetAction = _a.onBudgetAction, props = __rest(_a, ["month", "onBudgetAction"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var toBudgetAmount = (0, useSheetValue_1.useSheetValue)(bindings_1.envelopeBudget.toBudget);
    var dispatch = (0, redux_1.useDispatch)();
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var categories = (0, useCategories_1.useCategories)().list;
    var categoriesById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(categories); }, [categories]);
    var openCoverOverbudgetedModal = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'cover',
                options: {
                    title: t('Cover overbudgeted'),
                    month: month,
                    showToBeBudgeted: false,
                    onSubmit: function (categoryId) {
                        onBudgetAction(month, 'cover-overbudgeted', {
                            category: categoryId,
                        });
                        showUndoNotification({
                            message: t('Covered overbudgeted from {{categoryName}}', {
                                categoryName: categoriesById[categoryId].name,
                            }),
                        });
                    },
                },
            },
        }));
    }, [
        categoriesById,
        dispatch,
        month,
        onBudgetAction,
        showUndoNotification,
        t,
    ]);
    if (!toBudgetAmount || toBudgetAmount >= 0) {
        return null;
    }
    return (<react_aria_components_1.GridListItem textValue="Overbudgeted banner" {...props}>
      <Banner type="critical">
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
          <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        }}>
            <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        }}>
              <v2_1.SvgArrowButtonDown1 style={{ width: 15, height: 15 }}/>
              <text_1.Text>
                <react_i18next_1.Trans>You have budgeted more than your available funds</react_i18next_1.Trans>
              </text_1.Text>
            </view_1.View>
          </view_1.View>
          <button_1.Button onPress={openCoverOverbudgetedModal} style={BudgetTable_1.PILL_STYLE}>
            <react_i18next_1.Trans>Cover</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
      </Banner>
    </react_aria_components_1.GridListItem>);
}
function OverspendingBanner(_a) {
    var month = _a.month, onBudgetAction = _a.onBudgetAction, budgetType = _a.budgetType, props = __rest(_a, ["month", "onBudgetAction", "budgetType"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useCategories_1.useCategories)(), categories = _b.list, categoryGroups = _b.grouped;
    var categoriesById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(categories); }, [categories]);
    var dispatch = (0, redux_1.useDispatch)();
    var format = (0, useFormat_1.useFormat)();
    var _c = (0, useOverspentCategories_1.useOverspentCategories)({ month: month }), overspentCategories = _c.categories, totalOverspending = _c.totalAmount;
    var categoryGroupsToShow = (0, react_1.useMemo)(function () {
        return categoryGroups
            .filter(function (g) { return overspentCategories.some(function (c) { return c.group === g.id; }); })
            .map(function (g) { return (__assign(__assign({}, g), { categories: overspentCategories.filter(function (c) { return c.group === g.id; }) })); });
    }, [categoryGroups, overspentCategories]);
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var onOpenCoverCategoryModal = (0, react_1.useCallback)(function (categoryId) {
        var category = categoriesById[categoryId];
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'cover',
                options: {
                    title: category.name,
                    month: month,
                    categoryId: category.id,
                    onSubmit: function (fromCategoryId) {
                        onBudgetAction(month, 'cover-overspending', {
                            to: category.id,
                            from: fromCategoryId,
                        });
                        showUndoNotification({
                            message: t("Covered {{toCategoryName}} overspending from {{fromCategoryName}}.", {
                                toCategoryName: category.name,
                                fromCategoryName: fromCategoryId === 'to-budget'
                                    ? t('To Budget')
                                    : categoriesById[fromCategoryId].name,
                            }),
                        });
                    },
                },
            },
        }));
    }, [categoriesById, dispatch, month, onBudgetAction, showUndoNotification, t]);
    var onOpenCategorySelectionModal = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'category-autocomplete',
                options: {
                    title: budgetType === 'envelope'
                        ? t('Cover overspending')
                        : t('Overspent categories'),
                    month: month,
                    categoryGroups: categoryGroupsToShow,
                    showHiddenCategories: true,
                    onSelect: budgetType === 'envelope' ? onOpenCoverCategoryModal : null,
                    clearOnSelect: true,
                    closeOnSelect: false,
                },
            },
        }));
    }, [
        categoryGroupsToShow,
        dispatch,
        month,
        onOpenCoverCategoryModal,
        t,
        budgetType,
    ]);
    var numberOfOverspentCategories = overspentCategories.length;
    if (numberOfOverspentCategories === 0) {
        return null;
    }
    return (<react_aria_components_1.GridListItem textValue="Overspent banner" {...props}>
      <Banner type="critical">
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
          <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        }}>
            <text_1.Text>
              <react_i18next_1.Trans count={numberOfOverspentCategories}>
                You have {{ count: numberOfOverspentCategories }} overspent
                categories ({{ amount: format(totalOverspending, 'financial') }}
                )
              </react_i18next_1.Trans>
            </text_1.Text>
          </view_1.View>
          <button_1.Button onPress={onOpenCategorySelectionModal} style={BudgetTable_1.PILL_STYLE}>
            {budgetType === 'envelope' && <react_i18next_1.Trans>Cover</react_i18next_1.Trans>}
            {budgetType === 'tracking' && <react_i18next_1.Trans>View</react_i18next_1.Trans>}
          </button_1.Button>
        </view_1.View>
      </Banner>
    </react_aria_components_1.GridListItem>);
}
function MonthSelector(_a) {
    var month = _a.month, monthBounds = _a.monthBounds, onOpenMonthMenu = _a.onOpenMonthMenu, onPrevMonth = _a.onPrevMonth, onNextMonth = _a.onNextMonth;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var prevEnabled = month > monthBounds.start;
    var nextEnabled = month < monthUtils.subMonths(monthBounds.end, 1);
    var arrowButtonStyle = {
        padding: 10,
        margin: 2,
    };
    return (<view_1.View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        }}>
      <button_1.Button aria-label={t('Previous month')} variant="bare" isDisabled={!prevEnabled} onPress={onPrevMonth} style={__assign(__assign({}, arrowButtonStyle), { opacity: prevEnabled ? 1 : 0.6 })}>
        <v1_1.SvgArrowThinLeft width="15" height="15"/>
      </button_1.Button>
      <button_1.Button variant="bare" style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 500,
        }} onPress={function () {
            onOpenMonthMenu === null || onOpenMonthMenu === void 0 ? void 0 : onOpenMonthMenu(month);
        }} data-month={month}>
        <text_1.Text style={styles_1.styles.underlinedText}>
          {monthUtils.format(month, 'MMMM ‘yy', locale)}
        </text_1.Text>
      </button_1.Button>
      <button_1.Button aria-label={t('Next month')} variant="bare" isDisabled={!nextEnabled} onPress={onNextMonth} style={__assign(__assign({}, arrowButtonStyle), { opacity: nextEnabled ? 1 : 0.6 })}>
        <v1_1.SvgArrowThinRight width="15" height="15"/>
      </button_1.Button>
    </view_1.View>);
}
