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
exports.TransactionListWithBalances = TransactionListWithBalances;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var label_1 = require("@actual-app/components/label");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var TransactionList_1 = require("./TransactionList");
var Search_1 = require("@desktop-client/components/common/Search");
var PullToRefresh_1 = require("@desktop-client/components/mobile/PullToRefresh");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
function TransactionSearchInput(_a) {
    var placeholder = _a.placeholder, onSearch = _a.onSearch;
    var _b = (0, react_1.useState)(''), text = _b[0], setText = _b[1];
    return (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme_1.theme.mobilePageBackground,
            padding: 10,
            width: '100%',
        }}>
      <Search_1.Search value={text} onChange={function (text) {
            setText(text);
            onSearch(text);
        }} placeholder={placeholder} width="100%" height={styles_1.styles.mobileMinHeight} style={{
            backgroundColor: theme_1.theme.tableBackground,
            borderColor: theme_1.theme.formInputBorder,
        }}/>
    </view_1.View>);
}
function TransactionListWithBalances(_a) {
    var _this = this;
    var isLoading = _a.isLoading, transactions = _a.transactions, balance = _a.balance, balanceCleared = _a.balanceCleared, balanceUncleared = _a.balanceUncleared, _b = _a.searchPlaceholder, searchPlaceholder = _b === void 0 ? 'Search...' : _b, onSearch = _a.onSearch, isLoadingMore = _a.isLoadingMore, onLoadMore = _a.onLoadMore, onOpenTransaction = _a.onOpenTransaction, onRefresh = _a.onRefresh, _c = _a.showMakeTransfer, showMakeTransfer = _c === void 0 ? false : _c;
    var selectedInst = (0, useSelected_1.useSelected)('transactions', __spreadArray([], transactions, true), []);
    return (<useSelected_1.SelectedProvider instance={selectedInst}>
      <>
        <view_1.View style={{
            flexShrink: 0,
            marginTop: 10,
        }}>
          <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        }}>
            {balanceCleared && balanceUncleared ? (<BalanceWithCleared balance={balance} balanceCleared={balanceCleared} balanceUncleared={balanceUncleared}/>) : (<Balance balance={balance}/>)}
          </view_1.View>
          <TransactionSearchInput placeholder={searchPlaceholder} onSearch={onSearch}/>
        </view_1.View>
        <PullToRefresh_1.PullToRefresh isPullable={!isLoading && !!onRefresh} onRefresh={function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh()];
    }); }); }}>
          <TransactionList_1.TransactionList isLoading={isLoading} transactions={transactions} isLoadingMore={isLoadingMore} onLoadMore={onLoadMore} onOpenTransaction={onOpenTransaction} showMakeTransfer={showMakeTransfer}/>
        </PullToRefresh_1.PullToRefresh>
      </>
    </useSelected_1.SelectedProvider>);
}
var TransactionListBalanceCellValue = function (props) {
    return <CellValue_1.CellValue {...props}/>;
};
function BalanceWithCleared(_a) {
    var balanceUncleared = _a.balanceUncleared, balanceCleared = _a.balanceCleared, balance = _a.balance;
    var t = (0, react_i18next_1.useTranslation)().t;
    var unclearedAmount = (0, useSheetValue_1.useSheetValue)(balanceUncleared);
    return (<>
      <view_1.View style={{
            display: !unclearedAmount ? 'none' : undefined,
            flexBasis: '33%',
        }}>
        <label_1.Label title={t('Cleared')} style={{ textAlign: 'center', fontSize: 12 }}/>
        <TransactionListBalanceCellValue binding={balanceCleared} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} style={{
                fontSize: 12,
                textAlign: 'center',
                fontWeight: '500',
            }} data-testid="transactions-balance-cleared"/>); }}
        </TransactionListBalanceCellValue>
      </view_1.View>
      <Balance balance={balance}/>
      <view_1.View style={{
            display: !unclearedAmount ? 'none' : undefined,
            flexBasis: '33%',
        }}>
        <label_1.Label title={t('Uncleared')} style={{ textAlign: 'center', fontSize: 12 }}/>
        <TransactionListBalanceCellValue binding={balanceUncleared} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} style={{
                fontSize: 12,
                textAlign: 'center',
                fontWeight: '500',
            }} data-testid="transactions-balance-uncleared"/>); }}
        </TransactionListBalanceCellValue>
      </view_1.View>
    </>);
}
function Balance(_a) {
    var balance = _a.balance;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{ flexBasis: '33%' }}>
      <label_1.Label title={t('Balance')} style={{ textAlign: 'center' }}/>
      <TransactionListBalanceCellValue binding={balance} type="financial">
        {function (props) { return (<CellValue_1.CellValueText {...props} style={{
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '500',
                color: props.value < 0 ? theme_1.theme.errorText : theme_1.theme.pillTextHighlighted,
            }} data-testid="transactions-balance"/>); }}
      </TransactionListBalanceCellValue>
    </view_1.View>);
}
