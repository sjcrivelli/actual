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
exports.mapValue = mapValue;
exports.ruleToString = ruleToString;
exports.ManageRules = ManageRules;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var undo = require("loot-core/platform/client/undo");
var normalisation_1 = require("loot-core/shared/normalisation");
var query_1 = require("loot-core/shared/query");
var rules_1 = require("loot-core/shared/rules");
var schedules_1 = require("loot-core/shared/schedules");
var InfiniteScrollWrapper_1 = require("./common/InfiniteScrollWrapper");
var Link_1 = require("./common/Link");
var Search_1 = require("./common/Search");
var RulesHeader_1 = require("./rules/RulesHeader");
var RulesList_1 = require("./rules/RulesList");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
function mapValue(field, value, _a) {
    var _b = _a.payees, payees = _b === void 0 ? [] : _b, _c = _a.categories, categories = _c === void 0 ? [] : _c, _d = _a.accounts, accounts = _d === void 0 ? [] : _d;
    if (!value)
        return '';
    var object = null;
    if (field === 'payee') {
        object = payees.find(function (p) { return p.id === value; });
    }
    else if (field === 'category') {
        object = categories.find(function (c) { return c.id === value; });
    }
    else if (field === 'account') {
        object = accounts.find(function (a) { return a.id === value; });
    }
    else {
        return value;
    }
    if (object) {
        return object.name;
    }
    return '(deleted)';
}
function ruleToString(rule, data) {
    var conditions = rule.conditions.flatMap(function (cond) { return [
        (0, rules_1.mapField)(cond.field),
        (0, rules_1.friendlyOp)(cond.op),
        cond.op === 'oneOf' || cond.op === 'notOneOf'
            ? Array.isArray(cond.value)
                ? cond.value.map(function (v) { return mapValue(cond.field, v, data); }).join(', ')
                : mapValue(cond.field, cond.value, data)
            : mapValue(cond.field, cond.value, data),
    ]; });
    var actions = rule.actions.flatMap(function (action) {
        var _a, _b;
        if (action.op === 'set') {
            return [
                (0, rules_1.friendlyOp)(action.op),
                (0, rules_1.mapField)(action.field),
                'to',
                mapValue(action.field, action.value, data),
            ];
        }
        else if (action.op === 'link-schedule') {
            var schedule_1 = (_a = data.schedules) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.id === String(action.value); });
            return [
                (0, rules_1.friendlyOp)(action.op),
                schedule_1
                    ? (0, schedules_1.describeSchedule)(schedule_1, (_b = data.payees) === null || _b === void 0 ? void 0 : _b.find(function (p) { return p.id === schedule_1._payee; }))
                    : '-',
            ];
        }
        else if (action.op === 'prepend-notes' || action.op === 'append-notes') {
            var noteValue = String(action.value || '');
            return [(0, rules_1.friendlyOp)(action.op), '\u201c' + noteValue + '\u201d'];
        }
        else if (action.op === 'delete-transaction') {
            return [(0, rules_1.friendlyOp)(action.op), '(delete)'];
        }
        else {
            return [];
        }
    });
    return ((rule.stage || '') + ' ' + conditions.join(' ') + ' ' + actions.join(' '));
}
function ManageRules(_a) {
    var _this = this;
    var isModal = _a.isModal, payeeId = _a.payeeId, _b = _a.setLoading, setLoading = _b === void 0 ? function () { } : _b;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _c = (0, react_1.useState)([]), allRules = _c[0], setAllRules = _c[1];
    var _d = (0, react_1.useState)(0), page = _d[0], setPage = _d[1];
    var _e = (0, react_1.useState)(''), filter = _e[0], setFilter = _e[1];
    var dispatch = (0, redux_1.useDispatch)();
    var _f = (0, useSchedules_1.useSchedules)({
        query: (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []),
    }).schedules, schedules = _f === void 0 ? [] : _f;
    var categories = (0, useCategories_1.useCategories)().list;
    var payees = (0, usePayees_1.usePayees)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var filterData = (0, react_1.useMemo)(function () { return ({
        payees: payees,
        accounts: accounts,
        schedules: schedules,
        categories: categories,
    }); }, [payees, accounts, schedules, categories]);
    var filteredRules = (0, react_1.useMemo)(function () {
        var rules = allRules.filter(function (rule) {
            var schedule = schedules.find(function (schedule) { return schedule.rule === rule.id; });
            return schedule ? schedule.completed === false : true;
        });
        return (filter === ''
            ? rules
            : rules.filter(function (rule) {
                return (0, normalisation_1.getNormalisedString)(ruleToString(rule, filterData)).includes((0, normalisation_1.getNormalisedString)(filter));
            })).slice(0, 100 + page * 50);
    }, [allRules, filter, filterData, page]);
    var selectedInst = (0, useSelected_1.useSelected)('manage-rules', filteredRules, []);
    var _g = (0, react_1.useState)(null), hoveredRule = _g[0], setHoveredRule = _g[1];
    var onSearchChange = (0, react_1.useCallback)(function (value) {
        setFilter(value);
        setPage(0);
    }, [setFilter]);
    function loadRules() {
        return __awaiter(this, void 0, void 0, function () {
            var loadedRules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        loadedRules = null;
                        if (!payeeId) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.send)('payees-get-rules', {
                                id: payeeId,
                            })];
                    case 1:
                        loadedRules = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, fetch_1.send)('rules-get')];
                    case 3:
                        loadedRules = _a.sent();
                        _a.label = 4;
                    case 4:
                        setAllRules(loadedRules);
                        return [2 /*return*/, loadedRules];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        function loadData() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, loadRules()];
                        case 1:
                            _a.sent();
                            setLoading(false);
                            return [4 /*yield*/, dispatch((0, payeesSlice_1.getPayees)())];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        if (payeeId) {
            undo.setUndoState('openModal', { name: 'manage-rules', options: {} });
        }
        loadData();
        return function () {
            undo.setUndoState('openModal', null);
        };
    }, []);
    function loadMore() {
        setPage(function (page) { return page + 1; });
    }
    var onDeleteSelected = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var someDeletionsFailed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, (0, fetch_1.send)('rule-delete-all', __spreadArray([], selectedInst.items, true))];
                case 1:
                    someDeletionsFailed = (_a.sent()).someDeletionsFailed;
                    if (someDeletionsFailed) {
                        alert(t('Some rules were not deleted because they are linked to schedules.'));
                    }
                    return [4 /*yield*/, loadRules()];
                case 2:
                    _a.sent();
                    selectedInst.dispatch({ type: 'select-none' });
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [selectedInst]);
    function onDeleteRule(id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, (0, fetch_1.send)('rule-delete', id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loadRules()];
                    case 2:
                        _a.sent();
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    var onEditRule = (0, react_1.useCallback)(function (rule) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'edit-rule',
                options: {
                    rule: rule,
                    onSave: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadRules()];
                                case 1:
                                    _a.sent();
                                    setLoading(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                },
            },
        }));
    }, []);
    function onCreateRule() {
        var _this = this;
        var rule = {
            stage: null,
            conditionsOp: 'and',
            conditions: [
                {
                    field: 'payee',
                    op: 'is',
                    value: payeeId || null,
                    type: 'id',
                },
            ],
            actions: [
                {
                    op: 'set',
                    field: 'category',
                    value: null,
                    type: 'id',
                },
            ],
        };
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'edit-rule',
                options: {
                    rule: rule,
                    onSave: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadRules()];
                                case 1:
                                    _a.sent();
                                    setLoading(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                },
            },
        }));
    }
    var onHover = (0, react_1.useCallback)(function (id) {
        setHoveredRule(id);
    }, []);
    return (<useSelected_1.SelectedProvider instance={selectedInst}>
      <view_1.View>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: isModal ? '0 13px 15px' : '0 0 15px',
            flexShrink: 0,
        }}>
          <view_1.View style={{
            color: theme_1.theme.pageTextLight,
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
        }}>
            <text_1.Text>
              <react_i18next_1.Trans>
                Rules are always run in the order that you see them.
              </react_i18next_1.Trans>{' '}
              <Link_1.Link variant="external" to="https://actualbudget.org/docs/budgeting/rules/" linkColor="muted">
                <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
              </Link_1.Link>
            </text_1.Text>
          </view_1.View>
          <view_1.View style={{ flex: 1 }}/>
          <Search_1.Search placeholder={t('Filter rules...')} value={filter} onChange={onSearchChange}/>
        </view_1.View>
        <view_1.View style={{ flex: 1 }}>
          <RulesHeader_1.RulesHeader />
          <InfiniteScrollWrapper_1.InfiniteScrollWrapper loadMore={loadMore}>
            {filteredRules.length === 0 ? (<EmptyMessage text={t('No rules')} style={{ marginTop: 15 }}/>) : (<RulesList_1.RulesList rules={filteredRules} selectedItems={selectedInst.items} hoveredRule={hoveredRule} onHover={onHover} onEditRule={onEditRule} onDeleteRule={function (rule) { return onDeleteRule(rule.id); }}/>)}
          </InfiniteScrollWrapper_1.InfiniteScrollWrapper>
        </view_1.View>
        <view_1.View style={{
            paddingBlock: 15,
            paddingInline: isModal ? 13 : 0,
            borderTop: isModal && '1px solid ' + theme_1.theme.pillBorder,
            flexShrink: 0,
        }}>
          <stack_1.Stack direction="row" align="center" justify="flex-end" spacing={2}>
            {selectedInst.items.size > 0 && (<button_1.Button onPress={onDeleteSelected}>
                <react_i18next_1.Trans count={selectedInst.items.size}>
                  Delete {{ count: selectedInst.items.size }} rules
                </react_i18next_1.Trans>
              </button_1.Button>)}
            <button_1.Button variant="primary" onPress={onCreateRule}>
              <react_i18next_1.Trans>Create new rule</react_i18next_1.Trans>
            </button_1.Button>
          </stack_1.Stack>
        </view_1.View>
      </view_1.View>
    </useSelected_1.SelectedProvider>);
}
function EmptyMessage(_a) {
    var text = _a.text, style = _a.style;
    return (<view_1.View style={{
            textAlign: 'center',
            color: theme_1.theme.pageTextSubdued,
            fontStyle: 'italic',
            fontSize: 13,
            marginTop: 5,
            style: style,
        }}>
      {text}
    </view_1.View>);
}
