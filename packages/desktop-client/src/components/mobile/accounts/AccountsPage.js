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
exports.AccountsPage = AccountsPage;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var appSlice_1 = require("@desktop-client/app/appSlice");
var util_1 = require("@desktop-client/components/budget/util");
var MobileNavTabs_1 = require("@desktop-client/components/mobile/MobileNavTabs");
var PullToRefresh_1 = require("@desktop-client/components/mobile/PullToRefresh");
var Page_1 = require("@desktop-client/components/Page");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useFailedAccounts_1 = require("@desktop-client/hooks/useFailedAccounts");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var bindings = require("@desktop-client/spreadsheet/bindings");
var ROW_HEIGHT = 60;
function AccountHeader(_a) {
    var id = _a.id, name = _a.name, amount = _a.amount, _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.showCheveronDown, showCheveronDown = _c === void 0 ? false : _c, onPress = _a.onPress;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var Cheveron = showCheveronDown ? v1_1.SvgCheveronDown : v1_1.SvgCheveronRight;
    return (<button_1.Button variant="bare" aria-label={t('View {{name}} transactions', { name: name })} onPress={onPress ? onPress : function () { return navigate("/accounts/".concat(id)); }} style={__assign({ height: ROW_HEIGHT, width: '100%', padding: '0 18px', color: theme_1.theme.pageTextLight }, style)} 
    // to match the feel of the other account buttons
    className={(0, css_1.css)([
            {
                '&[data-pressed], &[data-hovered]': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(1px)',
                },
            },
        ])}>
      <view_1.View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.text), { fontSize: 17 })} data-testid="name">
          {name}
        </text_1.Text>
        <Cheveron style={{
            flexShrink: 0,
            color: theme_1.theme.mobileHeaderTextSubdued,
            marginLeft: 5,
        }} width={styles_1.styles.text.fontSize} height={styles_1.styles.text.fontSize}/>
      </view_1.View>
      <CellValue_1.CellValue binding={amount} type="financial">
        {function (props) { return (<CellValue_1.CellValueText {...props} style={__assign({}, styles_1.styles.text)}/>); }}
      </CellValue_1.CellValue>
    </button_1.Button>);
}
function AccountListItem(_a) {
    var isUpdated = _a.isUpdated, isConnected = _a.isConnected, isPending = _a.isPending, isFailed = _a.isFailed, getBalanceQuery = _a.getBalanceQuery, onSelect = _a.onSelect, props = __rest(_a, ["isUpdated", "isConnected", "isPending", "isFailed", "getBalanceQuery", "onSelect"]);
    var account = props.value;
    if (!account) {
        return null;
    }
    return (<react_aria_components_1.ListBoxItem textValue={account.name} {...props}>
      {function (itemProps) { return (<button_1.Button {...itemProps} style={{
                height: ROW_HEIGHT,
                width: '100%',
                backgroundColor: theme_1.theme.tableBackground,
                border: "1px solid ".concat(theme_1.theme.tableBorder),
                paddingLeft: 20,
            }} data-testid="account-list-item" onPress={function () { return onSelect(account); }}>
          <view_1.View style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
            }}>
            {
            /* TODO: Should bankId be part of the AccountEntity type? */
            'bankId' in account && account.bankId ? (<view_1.View style={{
                    backgroundColor: isPending
                        ? theme_1.theme.sidebarItemBackgroundPending
                        : isFailed
                            ? theme_1.theme.sidebarItemBackgroundFailed
                            : theme_1.theme.sidebarItemBackgroundPositive,
                    marginRight: '8px',
                    width: 8,
                    flexShrink: 0,
                    height: 8,
                    borderRadius: 8,
                    opacity: isConnected ? 1 : 0,
                }}/>) : null}
            <text_one_line_1.TextOneLine style={__assign(__assign({}, styles_1.styles.text), { fontSize: 17, fontWeight: 600, color: isUpdated ? theme_1.theme.mobileAccountText : theme_1.theme.pillText })} data-testid="account-name">
              {account.name}
            </text_one_line_1.TextOneLine>
          </view_1.View>
          <CellValue_1.CellValue binding={getBalanceQuery(account.id)} type="financial">
            {function (props) { return (<CellValue_1.CellValueText {...props} style={__assign({ fontSize: 16 }, (0, util_1.makeAmountFullStyle)(props.value))} data-testid="account-balance"/>); }}
          </CellValue_1.CellValue>
        </button_1.Button>); }}
    </react_aria_components_1.ListBoxItem>);
}
function EmptyMessage() {
    return (<view_1.View style={{ flex: 1, padding: 30 }}>
      <text_1.Text style={styles_1.styles.text}>
        <react_i18next_1.Trans>
          For Actual to be useful, you need to <strong>add an account</strong>.
          You can link an account to automatically download transactions, or
          manage it locally yourself.
        </react_i18next_1.Trans>
      </text_1.Text>
    </view_1.View>);
}
function AllAccountList(_a) {
    var accounts = _a.accounts, getAccountBalance = _a.getAccountBalance, getAllAccountsBalance = _a.getAllAccountsBalance, getOnBudgetBalance = _a.getOnBudgetBalance, getOffBudgetBalance = _a.getOffBudgetBalance, getClosedAccountsBalance = _a.getClosedAccountsBalance, onAddAccount = _a.onAddAccount, onOpenAccount = _a.onOpenAccount, onSync = _a.onSync;
    var t = (0, react_i18next_1.useTranslation)().t;
    var onBudgetAccounts = accounts.filter(function (account) { return account.offbudget === 0 && account.closed === 0; });
    var offBudgetAccounts = accounts.filter(function (account) { return account.offbudget === 1 && account.closed === 0; });
    var closedAccounts = accounts.filter(function (account) { return account.closed === 1; });
    var closedAccountsRef = (0, react_1.useRef)(null);
    var _b = (0, useLocalPref_1.useLocalPref)('ui.showClosedAccounts'), showClosedAccounts = _b[0], setShowClosedAccountsPref = _b[1];
    var onToggleClosedAccounts = function () {
        var toggledState = !showClosedAccounts;
        setShowClosedAccountsPref(toggledState);
        if (toggledState) {
            // Make sure to scroll to the closed accounts when the user presses
            // on the account header, otherwise it's not clear that the accounts are there.
            // Delay the scroll until the component is rendered, otherwise the scroll
            // won't work.
            setTimeout(function () {
                var _a;
                (_a = closedAccountsRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
            });
        }
    };
    return (<Page_1.Page header={<Page_1.MobilePageHeader title={t('Accounts')} rightContent={<button_1.Button variant="bare" aria-label={t('Add account')} style={{ margin: 10 }} onPress={onAddAccount}>
              <v1_1.SvgAdd width={20} height={20}/>
            </button_1.Button>}/>} padding={0}>
      {accounts.length === 0 && <EmptyMessage />}
      <PullToRefresh_1.PullToRefresh onRefresh={onSync}>
        <view_1.View aria-label={t('Account list')} style={{ paddingBottom: MobileNavTabs_1.MOBILE_NAV_HEIGHT }}>
          <AccountHeader id="all" name={t('All accounts')} amount={getAllAccountsBalance()}/>
          {onBudgetAccounts.length > 0 && (<AccountHeader id="onbudget" name={t('On budget')} amount={getOnBudgetBalance()}/>)}
          <AccountList aria-label={t('On budget accounts')} accounts={onBudgetAccounts} getAccountBalance={getAccountBalance} onOpenAccount={onOpenAccount}/>
          {offBudgetAccounts.length > 0 && (<AccountHeader id="offbudget" name={t('Off budget')} amount={getOffBudgetBalance()}/>)}
          <AccountList aria-label={t('Off budget accounts')} accounts={offBudgetAccounts} getAccountBalance={getAccountBalance} onOpenAccount={onOpenAccount}/>
          {closedAccounts.length > 0 && (<AccountHeader id="closed" name={t('Closed')} onPress={onToggleClosedAccounts} amount={getClosedAccountsBalance()} style={{ marginTop: 30 }} showCheveronDown={showClosedAccounts}/>)}
          {showClosedAccounts && (<AccountList aria-label={t('Closed accounts')} accounts={closedAccounts} getAccountBalance={getAccountBalance} onOpenAccount={onOpenAccount} ref={function (el) {
                if (el)
                    closedAccountsRef.current = el;
            }}/>)}
        </view_1.View>
      </PullToRefresh_1.PullToRefresh>
    </Page_1.Page>);
}
var AccountList = (0, react_1.forwardRef)(function (_a, ref) {
    var ariaLabel = _a["aria-label"], accounts = _a.accounts, getBalanceBinding = _a.getAccountBalance, onOpenAccount = _a.onOpenAccount;
    var failedAccounts = (0, useFailedAccounts_1.useFailedAccounts)();
    var syncingAccountIds = (0, redux_1.useSelector)(function (state) { return state.account.accountsSyncing; });
    var updatedAccounts = (0, redux_1.useSelector)(function (state) { return state.account.updatedAccounts; });
    var dispatch = (0, redux_1.useDispatch)();
    var dragAndDropHooks = (0, react_aria_components_1.useDragAndDrop)({
        getItems: function (keys) {
            return __spreadArray([], keys, true).map(function (key) {
                return ({
                    'text/plain': key,
                });
            });
        },
        renderDropIndicator: function (target) {
            return (<react_aria_components_1.DropIndicator target={target} className={(0, css_1.css)({
                    '&[data-drop-target]': {
                        height: 4,
                        backgroundColor: theme_1.theme.tableBorderSeparator,
                        opacity: 1,
                        borderRadius: 4,
                    },
                })}/>);
        },
        onReorder: function (e) {
            var key = e.keys[0];
            var accountIdToMove = key;
            var targetAccountId = e.target.key;
            if (e.target.dropPosition === 'before') {
                dispatch((0, accountsSlice_1.moveAccount)({
                    id: accountIdToMove,
                    targetId: targetAccountId,
                }));
            }
            else if (e.target.dropPosition === 'after') {
                var targetAccountIndex = accounts.findIndex(function (account) { return account.id === e.target.key; });
                if (targetAccountIndex === -1) {
                    throw new Error("Internal error: account with ID ".concat(targetAccountId, " not found."));
                }
                var nextToTargetAccount = accounts[targetAccountIndex + 1];
                dispatch((0, accountsSlice_1.moveAccount)({
                    id: accountIdToMove,
                    // Due to the way `moveAccount` works, we use the account next to the
                    // actual target account here because `moveAccount` always shoves the
                    // account *before* the target account.
                    // On the other hand, using `null` as `targetId`moves the account
                    // to the end of the list.
                    targetId: (nextToTargetAccount === null || nextToTargetAccount === void 0 ? void 0 : nextToTargetAccount.id) || null,
                }));
            }
        },
    }).dragAndDropHooks;
    return (<react_aria_components_1.ListBox aria-label={ariaLabel} items={accounts} dragAndDropHooks={dragAndDropHooks} ref={ref} style={{ display: 'flex', flexDirection: 'column', margin: '0 8px' }}>
        {function (account) { return (<AccountListItem key={account.id} id={account.id} value={account} isUpdated={updatedAccounts && updatedAccounts.includes(account.id)} isConnected={!!account.bank} isPending={syncingAccountIds.includes(account.id)} isFailed={failedAccounts && failedAccounts.has(account.id)} getBalanceQuery={getBalanceBinding} onSelect={onOpenAccount}/>); }}
      </react_aria_components_1.ListBox>);
});
AccountList.displayName = 'AccountList';
function AccountsPage() {
    var _this = this;
    var dispatch = (0, redux_1.useDispatch)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var _numberFormat = (0, useSyncedPref_1.useSyncedPref)('numberFormat')[0];
    var numberFormat = _numberFormat || 'comma-dot';
    var hideFraction = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var navigate = (0, useNavigate_1.useNavigate)();
    var onOpenAccount = (0, react_1.useCallback)(function (account) {
        navigate("/accounts/".concat(account.id));
    }, [navigate]);
    var onAddAccount = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.replaceModal)({ modal: { name: 'add-account', options: {} } }));
    }, [dispatch]);
    var onSync = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch((0, appSlice_1.syncAndDownload)({}));
            return [2 /*return*/];
        });
    }); }, [dispatch]);
    return (<view_1.View style={{ flex: 1 }}>
      <AllAccountList 
    // This key forces the whole table rerender when the number
    // format changes
    key={numberFormat + hideFraction} accounts={accounts} getAccountBalance={bindings.accountBalance} getAllAccountsBalance={bindings.allAccountBalance} getOnBudgetBalance={bindings.onBudgetAccountBalance} getOffBudgetBalance={bindings.offBudgetAccountBalance} getClosedAccountsBalance={bindings.closedAccountBalance} onAddAccount={onAddAccount} onOpenAccount={onOpenAccount} onSync={onSync}/>
    </view_1.View>);
}
