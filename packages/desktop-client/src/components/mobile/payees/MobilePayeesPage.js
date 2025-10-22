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
exports.MobilePayeesPage = MobilePayeesPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var normalisation_1 = require("loot-core/shared/normalisation");
var PayeesList_1 = require("./PayeesList");
var Search_1 = require("@desktop-client/components/common/Search");
var Page_1 = require("@desktop-client/components/Page");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePayeeRuleCounts_1 = require("@desktop-client/hooks/usePayeeRuleCounts");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function MobilePayeesPage() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var payees = (0, usePayees_1.usePayees)();
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var _a = (0, react_1.useState)(''), filter = _a[0], setFilter = _a[1];
    var _b = (0, usePayeeRuleCounts_1.usePayeeRuleCounts)(), ruleCounts = _b.ruleCounts, isRuleCountsLoading = _b.isLoading;
    var isLoading = (0, redux_1.useSelector)(function (s) { return s.payees.isPayeesLoading || s.payees.isCommonPayeesLoading; });
    var filteredPayees = (0, react_1.useMemo)(function () {
        if (!filter)
            return payees;
        var norm = (0, normalisation_1.getNormalisedString)(filter);
        return payees.filter(function (p) { return (0, normalisation_1.getNormalisedString)(p.name).includes(norm); });
    }, [payees, filter]);
    var onSearchChange = (0, react_1.useCallback)(function (value) {
        setFilter(value);
    }, []);
    var handlePayeePress = (0, react_1.useCallback)(function (payee) { return __awaiter(_this, void 0, void 0, function () {
        var associatedRules, ruleIds, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(((_a = ruleCounts.get(payee.id)) !== null && _a !== void 0 ? _a : 0) > 0)) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetch_1.send)('payees-get-rules', {
                            id: payee.id,
                        })];
                case 2:
                    associatedRules = _b.sent();
                    ruleIds = associatedRules.map(function (rule) { return rule.id; }).join(',');
                    navigate("/rules?visible-rules=".concat(ruleIds));
                    return [2 /*return*/];
                case 3:
                    error_1 = _b.sent();
                    console.error('Failed to fetch payee rules:', error_1);
                    // Fallback to general rules page
                    navigate('/rules');
                    return [2 /*return*/];
                case 4:
                    // Create a new rule for the payee
                    navigate('/rules/new', {
                        state: {
                            rule: {
                                conditions: [
                                    {
                                        field: 'payee',
                                        op: 'is',
                                        value: payee.id,
                                        type: 'id',
                                    },
                                ],
                            },
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [navigate, ruleCounts]);
    var handlePayeeDelete = (0, react_1.useCallback)(function (payee) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, fetch_1.send)('payees-batch-change', { deleted: [{ id: payee.id }] })];
                case 1:
                    _a.sent();
                    showUndoNotification({
                        message: t('Payee “{{name}}” deleted successfully', {
                            name: payee.name,
                        }),
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Failed to delete payee:', error_2);
                    dispatch((0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'error',
                            message: t('Failed to delete payee. Please try again.'),
                        },
                    }));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [dispatch, showUndoNotification, t]);
    return (<Page_1.Page header={<Page_1.MobilePageHeader title={t('Payees')}/>} padding={0}>
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
        <Search_1.Search placeholder={t('Filter payees…')} value={filter} onChange={onSearchChange} width="100%" height={styles_1.styles.mobileMinHeight} style={{
            backgroundColor: theme_1.theme.tableBackground,
            borderColor: theme_1.theme.formInputBorder,
        }}/>
      </view_1.View>
      <PayeesList_1.PayeesList payees={filteredPayees} ruleCounts={ruleCounts} isRuleCountsLoading={isRuleCountsLoading} isLoading={isLoading} onPayeePress={handlePayeePress} onPayeeDelete={handlePayeeDelete}/>
    </Page_1.Page>);
}
