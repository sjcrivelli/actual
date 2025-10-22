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
exports.Accounts = Accounts;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Account_1 = require("./Account");
var SecondaryItem_1 = require("./SecondaryItem");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useClosedAccounts_1 = require("@desktop-client/hooks/useClosedAccounts");
var useFailedAccounts_1 = require("@desktop-client/hooks/useFailedAccounts");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useOffBudgetAccounts_1 = require("@desktop-client/hooks/useOffBudgetAccounts");
var useOnBudgetAccounts_1 = require("@desktop-client/hooks/useOnBudgetAccounts");
var useUpdatedAccounts_1 = require("@desktop-client/hooks/useUpdatedAccounts");
var redux_1 = require("@desktop-client/redux");
var bindings = require("@desktop-client/spreadsheet/bindings");
var fontWeight = 600;
function Accounts() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, react_1.useState)(false), isDragging = _a[0], setIsDragging = _a[1];
    var accounts = (0, useAccounts_1.useAccounts)();
    var failedAccounts = (0, useFailedAccounts_1.useFailedAccounts)();
    var updatedAccounts = (0, useUpdatedAccounts_1.useUpdatedAccounts)();
    var offbudgetAccounts = (0, useOffBudgetAccounts_1.useOffBudgetAccounts)();
    var onBudgetAccounts = (0, useOnBudgetAccounts_1.useOnBudgetAccounts)();
    var closedAccounts = (0, useClosedAccounts_1.useClosedAccounts)();
    var syncingAccountIds = (0, redux_1.useSelector)(function (state) { return state.account.accountsSyncing; });
    var getAccountPath = function (account) { return "/accounts/".concat(account.id); };
    var _b = (0, useLocalPref_1.useLocalPref)('ui.showClosedAccounts'), showClosedAccounts = _b[0], setShowClosedAccountsPref = _b[1];
    function onDragChange(drag) {
        setIsDragging(drag.state === 'start');
    }
    var makeDropPadding = function (i) {
        if (i === 0) {
            return {
                paddingTop: isDragging ? 15 : 0,
                marginTop: isDragging ? -15 : 0,
            };
        }
        return undefined;
    };
    function onReorder(id, dropPos, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetIdToMove, idx;
            return __generator(this, function (_a) {
                targetIdToMove = targetId;
                if (dropPos === 'bottom') {
                    idx = accounts.findIndex(function (a) { return a.id === targetId; }) + 1;
                    targetIdToMove = idx < accounts.length ? accounts[idx].id : null;
                }
                dispatch((0, accountsSlice_1.moveAccount)({ id: id, targetId: targetIdToMove }));
                return [2 /*return*/];
            });
        });
    }
    var onToggleClosedAccounts = function () {
        setShowClosedAccountsPref(!showClosedAccounts);
    };
    return (<view_1.View style={{
            flexGrow: 1,
            '@media screen and (max-height: 480px)': {
                minHeight: 'auto',
            },
        }}>
      <view_1.View style={{
            height: 1,
            backgroundColor: theme_1.theme.sidebarItemBackgroundHover,
            marginTop: 15,
            flexShrink: 0,
        }}/>

      <view_1.View style={{ overflow: 'auto' }}>
        <Account_1.Account name={t('All accounts')} to="/accounts" query={bindings.allAccountBalance()} style={{ fontWeight: fontWeight, marginTop: 15 }}/>

        {onBudgetAccounts.length > 0 && (<Account_1.Account name={t('On budget')} to="/accounts/onbudget" query={bindings.onBudgetAccountBalance()} style={{
                fontWeight: fontWeight,
                marginTop: 13,
                marginBottom: 5,
            }} titleAccount={true}/>)}

        {onBudgetAccounts.map(function (account, i) { return (<Account_1.Account key={account.id} name={account.name} account={account} connected={!!account.bank} pending={syncingAccountIds.includes(account.id)} failed={failedAccounts.has(account.id)} updated={updatedAccounts.includes(account.id)} to={getAccountPath(account)} query={bindings.accountBalance(account.id)} onDragChange={onDragChange} onDrop={onReorder} outerStyle={makeDropPadding(i)}/>); })}

        {offbudgetAccounts.length > 0 && (<Account_1.Account name={t('Off budget')} to="/accounts/offbudget" query={bindings.offBudgetAccountBalance()} style={{
                fontWeight: fontWeight,
                marginTop: 13,
                marginBottom: 5,
            }} titleAccount={true}/>)}

        {offbudgetAccounts.map(function (account, i) { return (<Account_1.Account key={account.id} name={account.name} account={account} connected={!!account.bank} pending={syncingAccountIds.includes(account.id)} failed={failedAccounts.has(account.id)} updated={updatedAccounts.includes(account.id)} to={getAccountPath(account)} query={bindings.accountBalance(account.id)} onDragChange={onDragChange} onDrop={onReorder} outerStyle={makeDropPadding(i)}/>); })}

        {closedAccounts.length > 0 && (<SecondaryItem_1.SecondaryItem style={{ marginTop: 15 }} title={showClosedAccounts
                ? t('Closed accounts')
                : t('Closed accounts...')} onClick={onToggleClosedAccounts} bold/>)}

        {showClosedAccounts &&
            closedAccounts.map(function (account) { return (<Account_1.Account key={account.id} name={account.name} account={account} to={getAccountPath(account)} query={bindings.accountBalance(account.id)} onDragChange={onDragChange} onDrop={onReorder}/>); })}
      </view_1.View>
    </view_1.View>);
}
