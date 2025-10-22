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
exports.ManagePayees = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var popover_1 = require("@actual-app/components/popover");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var memoize_one_1 = require("memoize-one");
var normalisation_1 = require("loot-core/shared/normalisation");
var util_1 = require("loot-core/shared/util");
var PayeeMenu_1 = require("./PayeeMenu");
var PayeeTable_1 = require("./PayeeTable");
var Search_1 = require("@desktop-client/components/common/Search");
var table_1 = require("@desktop-client/components/table");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var getPayeesById = (0, memoize_one_1.default)(function (payees) { return (0, util_1.groupById)(payees); });
function PayeeTableHeader() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    return (<view_1.View>
      <table_1.TableHeader style={{
            backgroundColor: theme_1.theme.tableBackground,
            color: theme_1.theme.pageTextLight,
            zIndex: 200,
            userSelect: 'none',
        }} collapsed={true}>
        <table_1.SelectCell exposed={true} focused={false} selected={selectedItems.size > 0} icon={<v0_1.SvgSubtract width={6} height={6}/>} onSelect={function (e) {
            return dispatchSelected({ type: 'select-all', isRangeSelect: e.shiftKey });
        }}/>
        <table_1.Cell value={t('Name')} width="flex"/>
      </table_1.TableHeader>
    </view_1.View>);
}
var ManagePayees = function (_a) {
    var payees = _a.payees, ruleCounts = _a.ruleCounts, orphanedPayees = _a.orphanedPayees, initialSelectedIds = _a.initialSelectedIds, onBatchChange = _a.onBatchChange, onViewRules = _a.onViewRules, onCreateRule = _a.onCreateRule, props = __rest(_a, ["payees", "ruleCounts", "orphanedPayees", "initialSelectedIds", "onBatchChange", "onViewRules", "onCreateRule"]);
    var _b = (0, react_1.useState)(''), filter = _b[0], setFilter = _b[1];
    var table = (0, react_1.useRef)(null);
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), orphanedOnly = _c[0], setOrphanedOnly = _c[1];
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var filteredPayees = (0, react_1.useMemo)(function () {
        var filtered = payees;
        if (filter) {
            filtered = filtered.filter(function (p) {
                return (0, normalisation_1.getNormalisedString)(p.name).includes((0, normalisation_1.getNormalisedString)(filter));
            });
        }
        if (orphanedOnly) {
            filtered = filtered.filter(function (p) {
                return orphanedPayees.map(function (o) { return o.id; }).includes(p.id);
            });
        }
        return filtered;
    }, [payees, filter, orphanedOnly, orphanedPayees]);
    var selected = (0, useSelected_1.useSelected)('payees', filteredPayees, initialSelectedIds);
    function applyFilter(f) {
        if (filter !== f) {
            setFilter(f);
        }
    }
    var onUpdate = (0, react_1.useCallback)(function (id, name, value) {
        var _a;
        var payee = payees.find(function (p) { return p.id === id; });
        if (payee && payee[name] !== value) {
            onBatchChange({
                updated: [(_a = { id: id }, _a[name] = value, _a)],
                added: [],
                deleted: [],
            });
        }
    }, [payees, onBatchChange]);
    var getSelectableIds = (0, react_1.useCallback)(function () {
        return Promise.resolve(filteredPayees.filter(function (p) { return p.transfer_acct == null; }).map(function (p) { return p.id; }));
    }, [filteredPayees]);
    function onDelete(ids) {
        onBatchChange({
            deleted: ids !== null && ids !== void 0 ? ids : __spreadArray([], selected.items, true).map(function (id) { return ({ id: id }); }),
            updated: [],
            added: [],
        });
        if (!ids)
            selected.dispatch({ type: 'select-none' });
    }
    function onFavorite() {
        var allFavorited = __spreadArray([], selected.items, true).map(function (id) { return payeesById[id].favorite; })
            .every(function (f) { return f; });
        if (allFavorited) {
            onBatchChange({
                updated: __spreadArray([], selected.items, true).map(function (id) { return ({ id: id, favorite: false }); }),
                added: [],
                deleted: [],
            });
        }
        else {
            onBatchChange({
                updated: __spreadArray([], selected.items, true).map(function (id) { return ({ id: id, favorite: true }); }),
                added: [],
                deleted: [],
            });
        }
        selected.dispatch({ type: 'select-none' });
    }
    function onLearn() {
        var allLearnCategories = __spreadArray([], selected.items, true).map(function (id) { return payeesById[id].learn_categories; })
            .every(function (f) { return f; });
        if (allLearnCategories) {
            onBatchChange({
                updated: __spreadArray([], selected.items, true).map(function (id) { return ({
                    id: id,
                    learn_categories: false,
                }); }),
                added: [],
                deleted: [],
            });
        }
        else {
            onBatchChange({
                updated: __spreadArray([], selected.items, true).map(function (id) { return ({
                    id: id,
                    learn_categories: true,
                }); }),
                added: [],
                deleted: [],
            });
        }
        selected.dispatch({ type: 'select-none' });
    }
    function onMerge() {
        return __awaiter(this, void 0, void 0, function () {
            var ids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ids = __spreadArray([], selected.items, true);
                        return [4 /*yield*/, props.onMerge(ids)];
                    case 1:
                        _a.sent();
                        selected.dispatch({ type: 'select-none' });
                        return [2 /*return*/];
                }
            });
        });
    }
    var onChangeCategoryLearning = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'payee-category-learning' } }));
    }, [dispatch]);
    var buttonsDisabled = selected.items.size === 0;
    var payeesById = getPayeesById(payees);
    var _d = (0, react_1.useState)(false), menuOpen = _d[0], setMenuOpen = _d[1];
    return (<view_1.View style={{ height: '100%' }}>
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 0 15px',
        }}>
        <view_1.View style={{ flexShrink: 0 }}>
          <button_1.Button ref={triggerRef} variant="bare" style={{ marginRight: 10 }} isDisabled={buttonsDisabled} onPress={function () { return setMenuOpen(true); }}>
            {buttonsDisabled
            ? t('No payees selected')
            : t('{{count}} payees', {
                count: selected.items.size,
            })}
            <v0_1.SvgExpandArrow width={8} height={8} style={{ marginLeft: 5 }}/>
          </button_1.Button>

          <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} placement="bottom start" style={{ width: 250 }} onOpenChange={function () { return setMenuOpen(false); }}>
            <PayeeMenu_1.PayeeMenu payeesById={payeesById} selectedPayees={selected.items} onClose={function () { return setMenuOpen(false); }} onDelete={onDelete} onMerge={onMerge} onFavorite={onFavorite} onLearn={onLearn}/>
          </popover_1.Popover>
        </view_1.View>
        <view_1.View style={{
            flexShrink: 0,
        }}>
          {(orphanedOnly || (orphanedPayees && orphanedPayees.length > 0)) && (<button_1.Button variant="bare" style={{ marginRight: 10 }} onPress={function () { return setOrphanedOnly(function (prev) { return !prev; }); }}>
              {orphanedOnly
                ? t('Show all payees')
                : t('Show {{count}} unused payees', {
                    count: orphanedPayees.length,
                })}
            </button_1.Button>)}
        </view_1.View>
        <view_1.View style={{ flex: 1 }}/>
        <Search_1.Search placeholder={t('Filter payees...')} value={filter} onChange={applyFilter}/>
      </view_1.View>

      <useSelected_1.SelectedProvider instance={selected} fetchAllIds={getSelectableIds}>
        <view_1.View style={{
            flex: 1,
            border: '1px solid ' + theme_1.theme.tableBorder,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            overflow: 'hidden',
        }}>
          <PayeeTableHeader />
          {filteredPayees.length === 0 ? (<view_1.View style={{
                textAlign: 'center',
                color: theme_1.theme.pageTextSubdued,
                fontStyle: 'italic',
                fontSize: 13,
                marginTop: 5,
            }}>
              <react_i18next_1.Trans>No payees</react_i18next_1.Trans>
            </view_1.View>) : (<PayeeTable_1.PayeeTable ref={table} payees={filteredPayees} ruleCounts={ruleCounts} onUpdate={onUpdate} onViewRules={onViewRules} onCreateRule={onCreateRule} onDelete={function (ids) { return onDelete(ids.map(function (id) { return ({ id: id }); })); }}/>)}
        </view_1.View>
      </useSelected_1.SelectedProvider>

      <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '20px 0',
            flexShrink: 0,
        }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1em',
        }}>
          <button_1.Button aria-label={t('Category learning settings')} variant="normal" onPress={onChangeCategoryLearning}>
            <react_i18next_1.Trans>Category learning settings</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
      </view_1.View>
    </view_1.View>);
};
exports.ManagePayees = ManagePayees;
