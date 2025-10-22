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
exports.AccountPage = AccountPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var AccountTransactions_1 = require("./AccountTransactions");
var AllAccountTransactions_1 = require("./AllAccountTransactions");
var OffBudgetAccountTransactions_1 = require("./OffBudgetAccountTransactions");
var OnBudgetAccountTransactions_1 = require("./OnBudgetAccountTransactions");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var AddTransactionButton_1 = require("@desktop-client/components/mobile/transactions/AddTransactionButton");
var Page_1 = require("@desktop-client/components/Page");
var useAccount_1 = require("@desktop-client/hooks/useAccount");
var useFailedAccounts_1 = require("@desktop-client/hooks/useFailedAccounts");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function AccountPage() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _numberFormat = (0, useSyncedPref_1.useSyncedPref)('numberFormat')[0];
    var numberFormat = _numberFormat || 'comma-dot';
    var hideFraction = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var accountIdParam = (0, react_router_1.useParams)().id;
    var account = (0, useAccount_1.useAccount)(accountIdParam || '');
    var nameFromId = (0, react_1.useCallback)(function (id) {
        switch (id) {
            case 'onbudget':
                return t('On Budget Accounts');
            case 'offbudget':
                return t('Off Budget Accounts');
            case 'uncategorized':
                return t('Uncategorized');
            case 'closed':
                return t('Closed Accounts');
            default:
                return t('All Accounts');
        }
    }, [t]);
    return (<Page_1.Page header={<Page_1.MobilePageHeader title={account ? (<AccountHeader account={account}/>) : (<NameOnlyHeader name={nameFromId(accountIdParam)}/>)} leftContent={<MobileBackButton_1.MobileBackButton />} rightContent={<AddTransactionButton_1.AddTransactionButton accountId={account === null || account === void 0 ? void 0 : account.id}/>}/>} padding={0}>
      {/* This key forces the whole table rerender when the number format changes */}
      <react_1.Fragment key={numberFormat + hideFraction}>
        {account ? (<AccountTransactions_1.AccountTransactions account={account}/>) : accountIdParam === 'onbudget' ? (<OnBudgetAccountTransactions_1.OnBudgetAccountTransactions />) : accountIdParam === 'offbudget' ? (<OffBudgetAccountTransactions_1.OffBudgetAccountTransactions />) : (<AllAccountTransactions_1.AllAccountTransactions />)}
      </react_1.Fragment>
    </Page_1.Page>);
}
function AccountHeader(_a) {
    var _this = this;
    var account = _a.account;
    var failedAccounts = (0, useFailedAccounts_1.useFailedAccounts)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var syncingAccountIds = (0, redux_1.useSelector)(function (state) { return state.account.accountsSyncing; });
    var pending = (0, react_1.useMemo)(function () { return syncingAccountIds.includes(account.id); }, [syncingAccountIds, account.id]);
    var failed = (0, react_1.useMemo)(function () { return failedAccounts.has(account.id); }, [failedAccounts, account.id]);
    var dispatch = (0, redux_1.useDispatch)();
    var onSave = (0, react_1.useCallback)(function (account) {
        dispatch((0, accountsSlice_1.updateAccount)({ account: account }));
    }, [dispatch]);
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
    var onEditNotes = (0, react_1.useCallback)(function (id) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'notes',
                options: {
                    id: "account-".concat(id),
                    name: account.name,
                    onSave: onSaveNotes,
                },
            },
        }));
    }, [account.name, dispatch, onSaveNotes]);
    var onCloseAccount = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.openAccountCloseModal)({ accountId: account.id }));
    }, [account.id, dispatch]);
    var onReopenAccount = (0, react_1.useCallback)(function () {
        dispatch((0, accountsSlice_1.reopenAccount)({ id: account.id }));
    }, [account.id, dispatch]);
    var onClick = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'account-menu',
                options: {
                    accountId: account.id,
                    onSave: onSave,
                    onEditNotes: onEditNotes,
                    onCloseAccount: onCloseAccount,
                    onReopenAccount: onReopenAccount,
                },
            },
        }));
    }, [
        account.id,
        dispatch,
        onCloseAccount,
        onEditNotes,
        onReopenAccount,
        onSave,
    ]);
    return (<view_1.View style={{
            flexDirection: 'row',
        }}>
      {account.bank && (<view_1.View style={{
                margin: 'auto',
                marginRight: 5,
                width: 8,
                height: 8,
                borderRadius: 8,
                flexShrink: 0,
                backgroundColor: pending
                    ? theme_1.theme.sidebarItemBackgroundPending
                    : failed
                        ? theme_1.theme.sidebarItemBackgroundFailed
                        : theme_1.theme.sidebarItemBackgroundPositive,
                transition: 'transform .3s',
            }}/>)}
      <button_1.Button variant="bare" onPress={onClick}>
        <text_1.Text style={__assign(__assign({ fontSize: 17, fontWeight: 500 }, styles_1.styles.underlinedText), styles_1.styles.lineClamp(2))}>
          {account.closed
            ? t('Closed: {{accountName}}', { accountName: account.name })
            : account.name}
        </text_1.Text>
      </button_1.Button>
    </view_1.View>);
}
function NameOnlyHeader(_a) {
    var name = _a.name;
    return (<view_1.View style={{
            flexDirection: 'row',
        }}>
      <text_1.Text style={__assign({}, styles_1.styles.lineClamp(2))}>{name}</text_1.Text>
    </view_1.View>);
}
