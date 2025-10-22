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
exports.EditSyncAccount = EditSyncAccount;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var custom_sync_mapping_1 = require("loot-core/server/util/custom-sync-mapping");
var query_1 = require("loot-core/shared/query");
var FieldMapping_1 = require("./FieldMapping");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var CheckboxOption_1 = require("@desktop-client/components/modals/ImportTransactionsModal/CheckboxOption");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var mappableFields = [
    {
        actualField: 'date',
        syncFields: [
            'date',
            'bookingDate',
            'valueDate',
            'postedDate',
            'transactedDate',
        ],
    },
    {
        actualField: 'payee',
        syncFields: [
            'payeeName',
            'creditorName',
            'debtorName',
            'remittanceInformationUnstructured',
            'remittanceInformationUnstructuredArrayString',
            'remittanceInformationStructured',
            'remittanceInformationStructuredArrayString',
            'additionalInformation',
            'paymentData.payer.accountNumber',
            'paymentData.payer.documentNumber.value',
            'paymentData.payer.name',
            'paymentData.receiver.accountNumber',
            'paymentData.receiver.documentNumber.value',
            'paymentData.receiver.name',
            'merchant.name',
            'merchant.businessName',
            'merchant.cnpj',
        ],
    },
    {
        actualField: 'notes',
        syncFields: [
            'notes',
            'remittanceInformationUnstructured',
            'remittanceInformationUnstructuredArrayString',
            'remittanceInformationStructured',
            'remittanceInformationStructuredArrayString',
            'additionalInformation',
            'category',
            'paymentData.payer.accountNumber',
            'paymentData.payer.documentNumber.value',
            'paymentData.payer.name',
            'paymentData.receiver.accountNumber',
            'paymentData.receiver.documentNumber.value',
            'paymentData.receiver.name',
            'merchant.name',
            'merchant.businessName',
            'merchant.cnpj',
        ],
    },
];
var getFields = function (transaction) {
    return mappableFields.map(function (field) { return ({
        actualField: field.actualField,
        syncFields: field.syncFields
            .filter(function (syncField) { return transaction[syncField]; })
            .map(function (syncField) { return ({
            field: syncField,
            example: transaction[syncField],
        }); }),
    }); });
};
function EditSyncAccount(_a) {
    var _this = this;
    var account = _a.account;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useSyncedPref_1.useSyncedPref)("custom-sync-mappings-".concat(account.id)), _c = _b[0], savedMappings = _c === void 0 ? (0, custom_sync_mapping_1.mappingsToString)(custom_sync_mapping_1.defaultMappings) : _c, setSavedMappings = _b[1];
    var _d = (0, useSyncedPref_1.useSyncedPref)("sync-import-notes-".concat(account.id)), _e = _d[0], savedImportNotes = _e === void 0 ? true : _e, setSavedImportNotes = _d[1];
    var _f = (0, useSyncedPref_1.useSyncedPref)("sync-import-pending-".concat(account.id)), _g = _f[0], savedImportPending = _g === void 0 ? true : _g, setSavedImportPending = _f[1];
    var _h = (0, useSyncedPref_1.useSyncedPref)("sync-reimport-deleted-".concat(account.id)), _j = _h[0], savedReimportDeleted = _j === void 0 ? true : _j, setSavedReimportDeleted = _h[1];
    var _k = (0, useSyncedPref_1.useSyncedPref)("sync-import-transactions-".concat(account.id)), _l = _k[0], savedImportTransactions = _l === void 0 ? true : _l, setSavedImportTransactions = _k[1];
    var _m = (0, react_1.useState)('payment'), transactionDirection = _m[0], setTransactionDirection = _m[1];
    var _o = (0, react_1.useState)(String(savedImportPending) === 'true'), importPending = _o[0], setImportPending = _o[1];
    var _p = (0, react_1.useState)(String(savedImportNotes) === 'true'), importNotes = _p[0], setImportNotes = _p[1];
    var _q = (0, react_1.useState)(String(savedReimportDeleted) === 'true'), reimportDeleted = _q[0], setReimportDeleted = _q[1];
    var _r = (0, react_1.useState)((0, custom_sync_mapping_1.mappingsFromString)(savedMappings)), mappings = _r[0], setMappings = _r[1];
    var _s = (0, react_1.useState)(String(savedImportTransactions) === 'true'), importTransactions = _s[0], setImportTransactions = _s[1];
    var transactionQuery = (0, react_1.useMemo)(function () {
        return (0, query_1.q)('transactions')
            .filter({
            account: account.id,
            amount: transactionDirection === 'payment' ? { $lte: 0 } : { $gt: 0 },
            raw_synced_data: { $ne: null },
        })
            .options({ splits: 'none' })
            .select('*');
    }, [account.id, transactionDirection]);
    var transactions = (0, useTransactions_1.useTransactions)({
        query: transactionQuery,
    }).transactions;
    var exampleTransaction = (0, react_1.useMemo)(function () {
        var _a;
        var data = (_a = transactions === null || transactions === void 0 ? void 0 : transactions[0]) === null || _a === void 0 ? void 0 : _a.raw_synced_data;
        if (!data)
            return undefined;
        try {
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Failed to parse transaction data:', error);
            return undefined;
        }
    }, [transactions]);
    var onSave = function (close) { return __awaiter(_this, void 0, void 0, function () {
        var mappingsStr;
        return __generator(this, function (_a) {
            mappingsStr = (0, custom_sync_mapping_1.mappingsToString)(mappings);
            setSavedMappings(mappingsStr);
            setSavedImportPending(String(importPending));
            setSavedImportNotes(String(importNotes));
            setSavedReimportDeleted(String(reimportDeleted));
            setSavedImportTransactions(String(importTransactions));
            close();
            return [2 /*return*/];
        });
    }); };
    var dispatch = (0, redux_1.useDispatch)();
    var onUnlink = function (close) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'confirm-unlink-account',
                    options: {
                        accountName: account.name,
                        isViewBankSyncSettings: true,
                        onUnlink: function () {
                            dispatch((0, accountsSlice_1.unlinkAccount)({ id: account.id }));
                            close();
                        },
                    },
                },
            }));
            return [2 /*return*/];
        });
    }); };
    var setMapping = function (field, value) {
        setMappings(function (prev) {
            var _a;
            var updated = new Map(prev);
            (_a = updated === null || updated === void 0 ? void 0 : updated.get(transactionDirection)) === null || _a === void 0 ? void 0 : _a.set(field, value);
            return updated;
        });
    };
    var potentiallyTruncatedAccountName = account.name.length > 30 ? account.name.slice(0, 30) + '...' : account.name;
    var fields = exampleTransaction ? getFields(exampleTransaction) : [];
    var mapping = mappings.get(transactionDirection);
    return (<Modal_1.Modal name="synced-account-edit" containerProps={{ style: { width: 800 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('{{accountName}} bank sync settings', {
                    accountName: potentiallyTruncatedAccountName,
                })} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>

          <text_1.Text style={{ fontSize: 15 }}>
            <react_i18next_1.Trans>Field mapping</react_i18next_1.Trans>
          </text_1.Text>

          <FieldMapping_1.FieldMapping transactionDirection={transactionDirection} setTransactionDirection={setTransactionDirection} fields={fields} mapping={mapping} setMapping={setMapping}/>

          <text_1.Text style={{ fontSize: 15, margin: '1em 0 .5em 0' }}>
            <react_i18next_1.Trans>Options</react_i18next_1.Trans>
          </text_1.Text>

          <CheckboxOption_1.CheckboxOption id="form_pending" checked={importPending && importTransactions} onChange={function () { return setImportPending(!importPending); }} disabled={!importTransactions}>
            <react_i18next_1.Trans>Import pending transactions</react_i18next_1.Trans>
          </CheckboxOption_1.CheckboxOption>

          <CheckboxOption_1.CheckboxOption id="form_notes" checked={importNotes && importTransactions} onChange={function () { return setImportNotes(!importNotes); }} disabled={!importTransactions}>
            <react_i18next_1.Trans>Import transaction notes</react_i18next_1.Trans>
          </CheckboxOption_1.CheckboxOption>

          <CheckboxOption_1.CheckboxOption id="form_reimport_deleted" checked={reimportDeleted && importTransactions} onChange={function () { return setReimportDeleted(!reimportDeleted); }} disabled={!importTransactions}>
            <tooltip_1.Tooltip content={t('By default imported transactions that you delete will be re-imported with the next bank sync operation. To disable this behaviour - untick this box.')}>
              <view_1.View style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                }}>
                <react_i18next_1.Trans>Reimport deleted transactions</react_i18next_1.Trans>
                <v1_1.SvgQuestion height={12} width={12} cursor="pointer"/>
              </view_1.View>
            </tooltip_1.Tooltip>
          </CheckboxOption_1.CheckboxOption>

          <CheckboxOption_1.CheckboxOption id="form_import_transactions" checked={!importTransactions} onChange={function () { return setImportTransactions(!importTransactions); }}>
            <tooltip_1.Tooltip content={t("Selecting this option will disable importing transactions and only import the account balance for use in reconciliation")}>
              <view_1.View style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                }}>
                <react_i18next_1.Trans>Investment Account</react_i18next_1.Trans>
                <v1_1.SvgQuestion height={12} width={12} cursor="pointer"/>
              </view_1.View>
            </tooltip_1.Tooltip>
          </CheckboxOption_1.CheckboxOption>

          <view_1.View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20,
                }}>
            <button_1.Button style={{ color: theme_1.theme.errorText }} onPress={function () {
                    onUnlink(close);
                }}>
              <react_i18next_1.Trans>Unlink account</react_i18next_1.Trans>
            </button_1.Button>

            <stack_1.Stack direction="row">
              <button_1.Button style={{ marginRight: 10 }} onPress={close}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>
              <button_1.Button variant="primary" onPress={function () {
                    onSave(close);
                }}>
                <react_i18next_1.Trans>Save</react_i18next_1.Trans>
              </button_1.Button>
            </stack_1.Stack>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
