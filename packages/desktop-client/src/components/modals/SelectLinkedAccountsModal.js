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
exports.SelectLinkedAccountsModal = SelectLinkedAccountsModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var Autocomplete_1 = require("@desktop-client/components/autocomplete/Autocomplete");
var Modal_1 = require("@desktop-client/components/common/Modal");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var table_1 = require("@desktop-client/components/table");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function useAddBudgetAccountOptions() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var addOnBudgetAccountOption = {
        id: 'new-on',
        name: t('Create new account'),
    };
    var addOffBudgetAccountOption = {
        id: 'new-off',
        name: t('Create new account (off budget)'),
    };
    return { addOnBudgetAccountOption: addOnBudgetAccountOption, addOffBudgetAccountOption: addOffBudgetAccountOption };
}
function SelectLinkedAccountsModal(_a) {
    var _b = _a.requisitionId, requisitionId = _b === void 0 ? undefined : _b, externalAccounts = _a.externalAccounts, syncSource = _a.syncSource;
    var propsWithSortedExternalAccounts = (0, react_1.useMemo)(function () {
        var toSort = externalAccounts ? __spreadArray([], externalAccounts, true) : [];
        toSort.sort(function (a, b) {
            var _a;
            return ((_a = getInstitutionName(a)) === null || _a === void 0 ? void 0 : _a.localeCompare(getInstitutionName(b))) ||
                a.name.localeCompare(b.name);
        });
        switch (syncSource) {
            case 'simpleFin':
                return {
                    syncSource: 'simpleFin',
                    externalAccounts: toSort,
                };
            case 'pluggyai':
                return {
                    syncSource: 'pluggyai',
                    externalAccounts: toSort,
                };
            case 'goCardless':
                return {
                    syncSource: 'goCardless',
                    requisitionId: requisitionId,
                    externalAccounts: toSort,
                };
        }
    }, [externalAccounts, syncSource, requisitionId]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var localAccounts = (0, useAccounts_1.useAccounts)().filter(function (a) { return a.closed === 0; });
    var _c = (0, react_1.useState)(function () {
        return Object.fromEntries(localAccounts
            .filter(function (acc) { return acc.account_id; })
            .map(function (acc) { return [acc.account_id, acc.id]; }));
    }), chosenAccounts = _c[0], setChosenAccounts = _c[1];
    var _d = useAddBudgetAccountOptions(), addOnBudgetAccountOption = _d.addOnBudgetAccountOption, addOffBudgetAccountOption = _d.addOffBudgetAccountOption;
    function onNext() {
        return __awaiter(this, void 0, void 0, function () {
            var chosenLocalAccountIds;
            return __generator(this, function (_a) {
                chosenLocalAccountIds = Object.values(chosenAccounts);
                // Unlink accounts that were previously linked, but the user
                // chose to remove the bank-sync
                localAccounts
                    .filter(function (acc) { return acc.account_id; })
                    .filter(function (acc) { return !chosenLocalAccountIds.includes(acc.id); })
                    .forEach(function (acc) { return dispatch((0, accountsSlice_1.unlinkAccount)({ id: acc.id })); });
                // Link new accounts
                Object.entries(chosenAccounts).forEach(function (_a) {
                    var chosenExternalAccountId = _a[0], chosenLocalAccountId = _a[1];
                    var externalAccountIndex = propsWithSortedExternalAccounts.externalAccounts.findIndex(function (account) { return account.account_id === chosenExternalAccountId; });
                    var offBudget = chosenLocalAccountId === addOffBudgetAccountOption.id;
                    // Skip linking accounts that were previously linked with
                    // a different bank.
                    if (externalAccountIndex === -1) {
                        return;
                    }
                    // Finally link the matched account
                    if (propsWithSortedExternalAccounts.syncSource === 'simpleFin') {
                        dispatch((0, accountsSlice_1.linkAccountSimpleFin)({
                            externalAccount: propsWithSortedExternalAccounts.externalAccounts[externalAccountIndex],
                            upgradingId: chosenLocalAccountId !== addOnBudgetAccountOption.id &&
                                chosenLocalAccountId !== addOffBudgetAccountOption.id
                                ? chosenLocalAccountId
                                : undefined,
                            offBudget: offBudget,
                        }));
                    }
                    else if (propsWithSortedExternalAccounts.syncSource === 'pluggyai') {
                        dispatch((0, accountsSlice_1.linkAccountPluggyAi)({
                            externalAccount: propsWithSortedExternalAccounts.externalAccounts[externalAccountIndex],
                            upgradingId: chosenLocalAccountId !== addOnBudgetAccountOption.id &&
                                chosenLocalAccountId !== addOffBudgetAccountOption.id
                                ? chosenLocalAccountId
                                : undefined,
                            offBudget: offBudget,
                        }));
                    }
                    else {
                        dispatch((0, accountsSlice_1.linkAccount)({
                            requisitionId: propsWithSortedExternalAccounts.requisitionId,
                            account: propsWithSortedExternalAccounts.externalAccounts[externalAccountIndex],
                            upgradingId: chosenLocalAccountId !== addOnBudgetAccountOption.id &&
                                chosenLocalAccountId !== addOffBudgetAccountOption.id
                                ? chosenLocalAccountId
                                : undefined,
                            offBudget: offBudget,
                        }));
                    }
                });
                dispatch((0, modalsSlice_1.closeModal)());
                return [2 /*return*/];
            });
        });
    }
    var unlinkedAccounts = localAccounts.filter(function (account) { return !Object.values(chosenAccounts).includes(account.id); });
    function onSetLinkedAccount(externalAccount, localAccountId) {
        setChosenAccounts(function (accounts) {
            var updatedAccounts = __assign({}, accounts);
            if (localAccountId) {
                updatedAccounts[externalAccount.account_id] = localAccountId;
            }
            else {
                delete updatedAccounts[externalAccount.account_id];
            }
            return updatedAccounts;
        });
    }
    return (<Modal_1.Modal name="select-linked-accounts" containerProps={{ style: { width: 1000 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Link Accounts')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <text_1.Text style={{ marginBottom: 10 }}>
            <react_i18next_1.Trans>
              We found the following accounts. Select which ones you want to
              add:
            </react_i18next_1.Trans>
          </text_1.Text>
          <view_1.View style={{
                    flex: 'unset',
                    height: 300,
                    border: '1px solid ' + theme_1.theme.tableBorder,
                }}>
            <table_1.TableHeader>
              <table_1.Cell name={t('Institution to Sync')} width={175}/>
              <table_1.Cell name={t('Bank Account To Sync')} width={175}/>
              <table_1.Cell name={t('Balance')} width={80}/>
              <table_1.Cell name={t('Account in Actual')} width="flex"/>
              <table_1.Cell name={t('Actions')} width={150}/>
            </table_1.TableHeader>

            <table_1.Table items={propsWithSortedExternalAccounts.externalAccounts.map(function (account) { return (__assign(__assign({}, account), { id: account.account_id })); })} style={{ backgroundColor: theme_1.theme.tableHeaderBackground }} getItemKey={String} renderItem={function (_a) {
                    var item = _a.item;
                    return (<view_1.View key={item.id}>
                  <TableRow externalAccount={item} chosenAccount={chosenAccounts[item.account_id] ===
                            addOnBudgetAccountOption.id
                            ? addOnBudgetAccountOption
                            : chosenAccounts[item.account_id] ===
                                addOffBudgetAccountOption.id
                                ? addOffBudgetAccountOption
                                : localAccounts.find(function (acc) { return chosenAccounts[item.account_id] === acc.id; })} unlinkedAccounts={unlinkedAccounts} onSetLinkedAccount={onSetLinkedAccount}/>
                </view_1.View>);
                }}/>
          </view_1.View>

          <view_1.View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 10,
                }}>
            <button_1.Button variant="primary" onPress={onNext} isDisabled={!Object.keys(chosenAccounts).length}>
              <react_i18next_1.Trans>Link accounts</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
function getInstitutionName(externalAccount) {
    var _a, _b, _c, _d;
    if (typeof (externalAccount === null || externalAccount === void 0 ? void 0 : externalAccount.institution) === 'string') {
        return (_a = externalAccount === null || externalAccount === void 0 ? void 0 : externalAccount.institution) !== null && _a !== void 0 ? _a : '';
    }
    else if (typeof ((_b = externalAccount.institution) === null || _b === void 0 ? void 0 : _b.name) === 'string') {
        return (_d = (_c = externalAccount === null || externalAccount === void 0 ? void 0 : externalAccount.institution) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '';
    }
    return '';
}
function TableRow(_a) {
    var externalAccount = _a.externalAccount, chosenAccount = _a.chosenAccount, unlinkedAccounts = _a.unlinkedAccounts, onSetLinkedAccount = _a.onSetLinkedAccount;
    var _b = (0, react_1.useState)(null), focusedField = _b[0], setFocusedField = _b[1];
    var _c = useAddBudgetAccountOptions(), addOnBudgetAccountOption = _c.addOnBudgetAccountOption, addOffBudgetAccountOption = _c.addOffBudgetAccountOption;
    var availableAccountOptions = __spreadArray([], unlinkedAccounts, true);
    if (chosenAccount && chosenAccount.id !== addOnBudgetAccountOption.id) {
        availableAccountOptions.push(chosenAccount);
    }
    availableAccountOptions.push(addOnBudgetAccountOption, addOffBudgetAccountOption);
    return (<table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
      <table_1.Field width={175}>
        <tooltip_1.Tooltip content={getInstitutionName(externalAccount)}>
          <view_1.View style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'block',
        }}>
            {getInstitutionName(externalAccount)}
          </view_1.View>
        </tooltip_1.Tooltip>
      </table_1.Field>
      <table_1.Field width={175}>
        <tooltip_1.Tooltip content={externalAccount.name}>
          <view_1.View style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'block',
        }}>
            {externalAccount.name}
          </view_1.View>
        </tooltip_1.Tooltip>
      </table_1.Field>
      <table_1.Field width={80}>
        <PrivacyFilter_1.PrivacyFilter>{externalAccount.balance}</PrivacyFilter_1.PrivacyFilter>
      </table_1.Field>
      <table_1.Field width="flex" truncate={focusedField !== 'account'} onClick={function () { return setFocusedField('account'); }}>
        {focusedField === 'account' ? (<Autocomplete_1.Autocomplete focused strict highlightFirst suggestions={availableAccountOptions} onSelect={function (value) {
                onSetLinkedAccount(externalAccount, value);
            }} inputProps={{
                onBlur: function () { return setFocusedField(null); },
            }} value={chosenAccount === null || chosenAccount === void 0 ? void 0 : chosenAccount.id}/>) : (chosenAccount === null || chosenAccount === void 0 ? void 0 : chosenAccount.name)}
      </table_1.Field>
      <table_1.Field width={150}>
        {chosenAccount ? (<button_1.Button onPress={function () {
                onSetLinkedAccount(externalAccount, null);
            }} style={{ float: 'right' }}>
            <react_i18next_1.Trans>Remove bank sync</react_i18next_1.Trans>
          </button_1.Button>) : (<button_1.Button variant="primary" onPress={function () {
                setFocusedField('account');
            }} style={{ float: 'right' }}>
            <react_i18next_1.Trans>Set up bank sync</react_i18next_1.Trans>
          </button_1.Button>)}
      </table_1.Field>
    </table_1.Row>);
}
