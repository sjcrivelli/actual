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
exports.BudgetAutomationsModal = BudgetAutomationsModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var stack_1 = require("@actual-app/components/stack");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var uniqueId_1 = require("lodash/uniqueId");
var fetch_1 = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var alerts_1 = require("@desktop-client/components/alerts");
var BudgetAutomation_1 = require("@desktop-client/components/budget/goals/BudgetAutomation");
var reducer_1 = require("@desktop-client/components/budget/goals/reducer");
var useBudgetAutomationCategories_1 = require("@desktop-client/components/budget/goals/useBudgetAutomationCategories");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useBudgetAutomations_1 = require("@desktop-client/hooks/useBudgetAutomations");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function BudgetAutomationList(_a) {
    var automations = _a.automations, setAutomations = _a.setAutomations, schedules = _a.schedules, categories = _a.categories, style = _a.style;
    var _b = (0, react_1.useState)(function () {
        // automations don't have ids, so we need to generate them
        return automations.map(function () { return (0, uniqueId_1.default)('automation-'); });
    }), automationIds = _b[0], setAutomationIds = _b[1];
    var onAdd = function () {
        var newId = (0, uniqueId_1.default)('automation-');
        setAutomationIds(function (prevIds) { return __spreadArray(__spreadArray([], prevIds, true), [newId], false); });
        setAutomations(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
            {
                type: 'simple',
                monthly: 5,
                directive: 'template',
                priority: reducer_1.DEFAULT_PRIORITY,
            },
        ], false); });
    };
    var onDelete = function (index) { return function () {
        setAutomations(function (prev) { return __spreadArray(__spreadArray([], prev.slice(0, index), true), prev.slice(index + 1), true); });
        setAutomationIds(function (prev) { return __spreadArray(__spreadArray([], prev.slice(0, index), true), prev.slice(index + 1), true); });
    }; };
    return (<stack_1.Stack spacing={4} style={__assign({ overflowY: 'scroll' }, style)}>
      {automations.map(function (automation, index) { return (<BudgetAutomation_1.BudgetAutomation key={automationIds[index]} onDelete={onDelete(index)} template={automation} categories={categories} schedules={schedules} readOnlyStyle={{
                color: theme_1.theme.pillText,
                backgroundColor: theme_1.theme.pillBackground,
                borderRadius: 4,
                padding: 16,
                paddingLeft: 30,
                paddingRight: 16,
            }}/>); })}
      <button_1.Button onPress={onAdd}>
        <react_i18next_1.Trans>Add new automation</react_i18next_1.Trans>
      </button_1.Button>
    </stack_1.Stack>);
}
function BudgetAutomationMigrationWarning(_a) {
    var categoryId = _a.categoryId, style = _a.style;
    var notes = (0, useNotes_1.useNotes)(categoryId);
    var templates = (0, react_1.useMemo)(function () {
        if (!notes)
            return null;
        var lines = notes.split('\n');
        return lines
            .flatMap(function (line) {
            if (line.trim().startsWith('#template'))
                return line;
            if (line.trim().startsWith('#goal'))
                return line;
            if (line.trim().startsWith('#cleanup'))
                return line;
            return [];
        })
            .join('\n');
    }, [notes]);
    if (!templates)
        return null;
    return (<alerts_1.Warning style={style}>
      <stack_1.Stack style={{ minHeight: 'unset' }}>
        <view_1.View>
          <react_i18next_1.Trans>
            This category uses notes-based automations (formerly “budget
            templates”). We have automatically imported your existing
            automations below. Please review them for accuracy and hit save to
            complete the migration.
          </react_i18next_1.Trans>
        </view_1.View>
        <view_1.View>
          <react_i18next_1.Trans>
            Original templates:
            <view_1.View style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            marginTop: 4,
            padding: 12,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}>
              {templates}
            </view_1.View>
          </react_i18next_1.Trans>
        </view_1.View>
      </stack_1.Stack>
    </alerts_1.Warning>);
}
function BudgetAutomationsModal(_a) {
    var _this = this;
    var _b;
    var categoryId = _a.categoryId;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _c = (0, react_1.useState)({}), automations = _c[0], setAutomations = _c[1];
    var loading = (0, useBudgetAutomations_1.useBudgetAutomations)({
        categoryId: categoryId,
        onLoaded: setAutomations,
    }).loading;
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []);
    var schedules = (0, useSchedules_1.useSchedules)({
        query: schedulesQuery,
    }).schedules;
    var categories = (0, useBudgetAutomationCategories_1.useBudgetAutomationCategories)();
    var currentCategory = (0, useCategory_1.useCategory)(categoryId);
    var needsMigration = ((_b = currentCategory === null || currentCategory === void 0 ? void 0 : currentCategory.template_settings) === null || _b === void 0 ? void 0 : _b.source) !== 'ui';
    var onSave = function (close) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!automations[categoryId]) {
                        close();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, fetch_1.send)('budget/set-category-automations', {
                            categoriesWithTemplates: [
                                {
                                    id: categoryId,
                                    templates: automations[categoryId],
                                },
                            ],
                            source: 'ui',
                        })];
                case 1:
                    _a.sent();
                    close();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<Modal_1.Modal name="category-automations-edit" containerProps={{
            style: { width: 850, height: 650, paddingBottom: 20 },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<stack_1.Stack direction="column" style={{ height: '100%' }}>
          <Modal_1.ModalHeader title={t('Budget automations: {{category}}', {
                    category: currentCategory === null || currentCategory === void 0 ? void 0 : currentCategory.name,
                })} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          {loading ? (<view_1.View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
              <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20 }}/>
            </view_1.View>) : (<stack_1.Stack>
              {needsMigration && (<BudgetAutomationMigrationWarning categoryId={categoryId}/>)}
              <BudgetAutomationList automations={automations[categoryId] || []} setAutomations={function (cb) {
                        setAutomations(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[categoryId] = cb(prev[categoryId] || []), _a)));
                        });
                    }} schedules={schedules} categories={categories}/>
            </stack_1.Stack>)}
          <view_1.View style={{ flexGrow: 1 }}/>
          <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ marginTop: 20 }}>
            {!needsMigration && (<Link_1.Link variant="text" onClick={function () {
                        var templates = automations[categoryId] || [];
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'category-automations-unmigrate',
                                options: { categoryId: categoryId, templates: templates },
                            },
                        }));
                    }}>
                <react_i18next_1.Trans>Un-migrate</react_i18next_1.Trans>
              </Link_1.Link>)}
            {/* <View style={{ flex: 1 }} /> */}
            <button_1.Button onPress={close}>
              <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="primary" onPress={function () { return onSave(close); }}>
              <react_i18next_1.Trans>Save</react_i18next_1.Trans>
            </button_1.Button>
          </stack_1.Stack>
        </stack_1.Stack>);
        }}
    </Modal_1.Modal>);
}
