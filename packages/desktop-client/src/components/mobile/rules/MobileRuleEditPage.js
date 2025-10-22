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
exports.MobileRuleEditPage = MobileRuleEditPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var Page_1 = require("@desktop-client/components/Page");
var RuleEditor_1 = require("@desktop-client/components/rules/RuleEditor");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function MobileRuleEditPage() {
    var _this = this;
    var _a, _b;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var id = (0, react_router_1.useParams)().id;
    var location = (0, react_router_1.useLocation)();
    var dispatch = (0, redux_1.useDispatch)();
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var _c = (0, react_1.useState)(null), rule = _c[0], setRule = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, useSchedules_1.useSchedules)({
        query: (0, react_1.useMemo)(function () {
            return (rule === null || rule === void 0 ? void 0 : rule.id)
                ? (0, query_1.q)('schedules')
                    .filter({ rule: rule.id, completed: false })
                    .select('*')
                : (0, query_1.q)('schedules').filter({ id: null }).select('*');
        }, // Return empty result when no rule
        [rule === null || rule === void 0 ? void 0 : rule.id]),
    }).schedules, schedules = _e === void 0 ? [] : _e;
    // Check if the current rule is linked to a schedule
    var isLinkedToSchedule = schedules.length > 0;
    // Load rule by ID if we're in edit mode
    (0, react_1.useEffect)(function () {
        if (id && id !== 'new') {
            setIsLoading(true);
            (0, fetch_1.send)('rule-get', { id: id })
                .then(function (loadedRule) {
                if (loadedRule) {
                    setRule(loadedRule);
                }
                else {
                    // Rule not found, navigate back to rules list
                    navigate('/rules');
                }
            })
                .catch(function (error) {
                console.error('Failed to load rule:', error);
                // Navigate back to rules list if rule not found
                navigate('/rules');
            })
                .finally(function () {
                setIsLoading(false);
            });
        }
    }, [id, navigate]);
    // If no rule is provided, create a new one
    var defaultRule = rule || __assign({ stage: null, conditionsOp: 'and', conditions: [
            {
                field: 'payee',
                op: 'is',
                value: '',
                type: 'id',
            },
        ], actions: [
            {
                field: 'category',
                op: 'set',
                value: '',
                type: 'id',
            },
        ] }, (((_a = location.state) === null || _a === void 0 ? void 0 : _a.rule) || {}));
    var handleSave = function () {
        if (rule === null || rule === void 0 ? void 0 : rule.id) {
            showUndoNotification({
                message: t('Rule saved successfully'),
            });
        }
        // Navigate back to rules list
        navigate('/rules');
    };
    var handleCancel = function () {
        navigate(-1);
    };
    var handleDelete = function () {
        // Runtime guard to ensure id exists
        if (!id || id === 'new') {
            throw new Error('Cannot delete rule: invalid id');
        }
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'confirm-delete',
                options: {
                    message: t('Are you sure you want to delete this rule?'),
                    onConfirm: function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, fetch_1.send)('rule-delete', id)];
                                case 1:
                                    _a.sent();
                                    showUndoNotification({
                                        message: t('Rule deleted successfully'),
                                    });
                                    navigate('/rules');
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    console.error('Failed to delete rule:', error_1);
                                    dispatch((0, notificationsSlice_1.addNotification)({
                                        notification: {
                                            type: 'error',
                                            message: t('Failed to delete rule. Please try again.'),
                                        },
                                    }));
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                },
            },
        }));
    };
    var isEditing = Boolean(id && id !== 'new' && rule);
    var pageTitle = ((_b = location.state) === null || _b === void 0 ? void 0 : _b.rule)
        ? t('Rule')
        : isEditing
            ? t('Edit Rule')
            : t('Create Rule');
    // Show loading state while fetching rule
    if (isLoading) {
        return (<Page_1.Page header={<Page_1.MobilePageHeader title={t('Loading...')} leftContent={<MobileBackButton_1.MobileBackButton onPress={handleCancel}/>}/>} padding={0}>
        <view_1.View style={{
                flex: 1,
                backgroundColor: theme_1.theme.mobilePageBackground,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
          <text_1.Text>
            <react_i18next_1.Trans>Loading rule...</react_i18next_1.Trans>
          </text_1.Text>
        </view_1.View>
      </Page_1.Page>);
    }
    return (<Page_1.Page header={<Page_1.MobilePageHeader title={pageTitle} leftContent={<MobileBackButton_1.MobileBackButton onPress={handleCancel}/>}/>} padding={0}>
      <RuleEditor_1.RuleEditor rule={defaultRule} onSave={handleSave} onCancel={handleCancel} onDelete={isEditing && !isLinkedToSchedule ? handleDelete : undefined} style={{
            paddingTop: 10,
            flex: 1,
            backgroundColor: theme_1.theme.mobilePageBackground,
        }}/>
    </Page_1.Page>);
}
