"use strict";
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
exports.MobileRulesPage = MobileRulesPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var undo = require("loot-core/platform/client/undo");
var normalisation_1 = require("loot-core/shared/normalisation");
var query_1 = require("loot-core/shared/query");
var AddRuleButton_1 = require("./AddRuleButton");
var RulesList_1 = require("./RulesList");
var Search_1 = require("@desktop-client/components/common/Search");
var ManageRules_1 = require("@desktop-client/components/ManageRules");
var Page_1 = require("@desktop-client/components/Page");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var useUrlParam_1 = require("@desktop-client/hooks/useUrlParam");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function MobileRulesPage() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var dispatch = (0, redux_1.useDispatch)();
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var visibleRulesParam = (0, useUrlParam_1.useUrlParam)('visible-rules')[0];
    var _a = (0, react_1.useState)([]), allRules = _a[0], setAllRules = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(''), filter = _c[0], setFilter = _c[1];
    var _d = (0, useSchedules_1.useSchedules)({
        query: (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []),
    }).schedules, schedules = _d === void 0 ? [] : _d;
    var categories = (0, useCategories_1.useCategories)().list;
    var payees = (0, usePayees_1.usePayees)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var filterData = (0, react_1.useMemo)(function () { return ({
        payees: payees,
        accounts: accounts,
        schedules: schedules,
        categories: categories,
    }); }, [payees, accounts, schedules, categories]);
    var visibleRules = (0, react_1.useMemo)(function () {
        if (!visibleRulesParam || visibleRulesParam.trim() === '') {
            return allRules;
        }
        var visibleRuleIdsSet = new Set(visibleRulesParam.split(',').map(function (id) { return id.trim(); }));
        return allRules.filter(function (rule) { return visibleRuleIdsSet.has(rule.id); });
    }, [allRules, visibleRulesParam]);
    var filteredRules = (0, react_1.useMemo)(function () {
        var rules = visibleRules.filter(function (rule) {
            var schedule = schedules.find(function (schedule) { return schedule.rule === rule.id; });
            return schedule ? schedule.completed === false : true;
        });
        return filter === ''
            ? rules
            : rules.filter(function (rule) {
                return (0, normalisation_1.getNormalisedString)((0, ManageRules_1.ruleToString)(rule, filterData)).includes((0, normalisation_1.getNormalisedString)(filter));
            });
    }, [visibleRules, filter, filterData, schedules]);
    var loadRules = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, rules, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    return [4 /*yield*/, (0, fetch_1.send)('rules-get')];
                case 1:
                    result = _a.sent();
                    rules = result || [];
                    setAllRules(rules);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to load rules:', error_1);
                    setAllRules([]);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        loadRules();
    }, [loadRules]);
    // Listen for undo events to refresh rules list
    (0, react_1.useEffect)(function () {
        var onUndo = function () {
            loadRules();
        };
        var lastUndoEvent = undo.getUndoState('undoEvent');
        if (lastUndoEvent) {
            onUndo();
        }
        return (0, fetch_1.listen)('undo-event', onUndo);
    }, [loadRules]);
    var handleRulePress = (0, react_1.useCallback)(function (rule) {
        navigate("/rules/".concat(rule.id));
    }, [navigate]);
    var onSearchChange = (0, react_1.useCallback)(function (value) {
        setFilter(value);
    }, [setFilter]);
    var handleRuleDelete = (0, react_1.useCallback)(function (rule) { return __awaiter(_this, void 0, void 0, function () {
        var someDeletionsFailed, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, fetch_1.send)('rule-delete-all', [
                            rule.id,
                        ])];
                case 1:
                    someDeletionsFailed = (_a.sent()).someDeletionsFailed;
                    if (someDeletionsFailed) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'warning',
                                message: t('This rule could not be deleted because it is linked to a schedule.'),
                            },
                        }));
                    }
                    else {
                        showUndoNotification({
                            message: t('Rule deleted successfully'),
                        });
                    }
                    // Refresh the rules list
                    return [4 /*yield*/, loadRules()];
                case 2:
                    // Refresh the rules list
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to delete rule:', error_2);
                    dispatch((0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'error',
                            message: t('Failed to delete rule. Please try again.'),
                        },
                    }));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [dispatch, showUndoNotification, t, loadRules]);
    return (<Page_1.Page header={<Page_1.MobilePageHeader title={t('Rules')} rightContent={<AddRuleButton_1.AddRuleButton />}/>} padding={0}>
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme_1.theme.mobilePageBackground,
            padding: 10,
            width: '100%',
            borderBottomWidth: 2,
            borderBottomStyle: 'solid',
            borderBottomColor: theme_1.theme.tableBorder,
        }}>
        <Search_1.Search placeholder={t('Filter rules…')} value={filter} onChange={onSearchChange} width="100%" height={styles_1.styles.mobileMinHeight} style={{
            backgroundColor: theme_1.theme.tableBackground,
            borderColor: theme_1.theme.formInputBorder,
        }}/>
      </view_1.View>
      <RulesList_1.RulesList rules={filteredRules} isLoading={isLoading} onRulePress={handleRulePress} onRuleDelete={handleRuleDelete}/>
    </Page_1.Page>);
}
