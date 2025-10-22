"use strict";
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
exports.SelectedTransactionsButton = SelectedTransactionsButton;
var react_1 = require("react");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var transactions_1 = require("loot-core/shared/transactions");
var transfer_1 = require("loot-core/shared/transfer");
var table_1 = require("@desktop-client/components/table");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function SelectedTransactionsButton(_a) {
    var getTransaction = _a.getTransaction, onShow = _a.onShow, onDuplicate = _a.onDuplicate, onDelete = _a.onDelete, onEdit = _a.onEdit, onLinkSchedule = _a.onLinkSchedule, onUnlinkSchedule = _a.onUnlinkSchedule, onCreateRule = _a.onCreateRule, onRunRules = _a.onRunRules, onSetTransfer = _a.onSetTransfer, onScheduleAction = _a.onScheduleAction, showMakeTransfer = _a.showMakeTransfer, onMakeAsSplitTransaction = _a.onMakeAsSplitTransaction, onMakeAsNonSplitTransactions = _a.onMakeAsNonSplitTransactions, onMergeTransactions = _a.onMergeTransactions;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var selectedIds = (0, react_1.useMemo)(function () { return __spreadArray([], selectedItems, true); }, [selectedItems]);
    var scheduleIds = (0, react_1.useMemo)(function () {
        return selectedIds
            .filter(function (id) { return (0, transactions_1.isPreviewId)(id); })
            .map(function (id) { return id.split('/')[1]; });
    }, [selectedIds]);
    var scheduleQuery = (0, react_1.useMemo)(function () {
        return (0, query_1.q)('schedules')
            .filter({ id: { $oneof: scheduleIds } })
            .select('*');
    }, [scheduleIds]);
    var selectedSchedules = (0, useSchedules_1.useSchedules)({
        query: scheduleQuery,
    }).schedules;
    var types = (0, react_1.useMemo)(function () {
        var items = selectedIds;
        return {
            preview: !!items.find(function (id) { return (0, transactions_1.isPreviewId)(id); }),
            trans: !!items.find(function (id) { return !(0, transactions_1.isPreviewId)(id); }),
        };
    }, [selectedIds]);
    var ambiguousDuplication = (0, react_1.useMemo)(function () {
        var transactions = selectedIds.map(function (id) { return getTransaction(id); });
        return transactions.some(function (tx) { return tx && tx.is_child; });
    }, [selectedIds, getTransaction]);
    var linked = (0, react_1.useMemo)(function () {
        return (!types.preview &&
            selectedIds.every(function (id) {
                var t = getTransaction(id);
                return t && t.schedule;
            }));
    }, [types.preview, selectedIds, getTransaction]);
    var twoTransactions = (0, react_1.useMemo)(function () {
        if ((selectedIds === null || selectedIds === void 0 ? void 0 : selectedIds.length) !== 2) {
            return undefined;
        }
        var _a = selectedIds.map(getTransaction), t0 = _a[0], t1 = _a[1];
        // previously selected transactions aren't always present in current transaction list
        if (!t0 || !t1) {
            return undefined;
        }
        return [t0, t1];
    }, [selectedIds, getTransaction]);
    var canBeTransfer = (0, react_1.useMemo)(function () {
        // only two selected
        if (!twoTransactions) {
            return false;
        }
        var fromTrans = twoTransactions[0], toTrans = twoTransactions[1];
        return (0, transfer_1.validForTransfer)(fromTrans, toTrans);
    }, [twoTransactions]);
    var canMerge = (0, react_1.useMemo)(function () {
        return Boolean(twoTransactions &&
            twoTransactions[0].amount === twoTransactions[1].amount);
    }, [twoTransactions]);
    var canBeSkipped = (0, react_1.useMemo)(function () {
        var recurringSchedules = selectedSchedules.filter(function (s) {
            var dateCond = (0, schedules_1.extractScheduleConds)(s._conditions).date;
            return (0, schedules_1.scheduleIsRecurring)(dateCond);
        });
        return recurringSchedules.length === selectedSchedules.length;
    }, [selectedSchedules]);
    var canBeCompleted = (0, react_1.useMemo)(function () {
        var singleSchedules = selectedSchedules.filter(function (s) {
            var dateCond = (0, schedules_1.extractScheduleConds)(s._conditions).date;
            return !(0, schedules_1.scheduleIsRecurring)(dateCond);
        });
        return singleSchedules.length === selectedSchedules.length;
    }, [selectedSchedules]);
    var canMakeAsSplitTransaction = (0, react_1.useMemo)(function () {
        if (selectedIds.length <= 1 || types.preview) {
            return false;
        }
        var transactions = selectedIds.map(function (id) { return getTransaction(id); });
        var firstTransaction = transactions[0];
        var areAllSameDateAndAccount = transactions.every(function (tx) {
            return tx &&
                tx.date === (firstTransaction === null || firstTransaction === void 0 ? void 0 : firstTransaction.date) &&
                tx.account === (firstTransaction === null || firstTransaction === void 0 ? void 0 : firstTransaction.account);
        });
        var areNoSplitTransactions = transactions.every(function (tx) { return tx && !tx.is_parent && !tx.is_child; });
        var areNoReconciledTransactions = transactions.every(function (tx) { return tx && !tx.reconciled; });
        return (areAllSameDateAndAccount &&
            areNoSplitTransactions &&
            areNoReconciledTransactions);
    }, [selectedIds, types, getTransaction]);
    var canUnsplitTransactions = (0, react_1.useMemo)(function () {
        if (selectedIds.length === 0 || types.preview) {
            return false;
        }
        var transactions = selectedIds.map(function (id) { return getTransaction(id); });
        var areNoReconciledTransactions = transactions.every(function (tx) { return tx && !tx.reconciled; });
        var areAllSplitTransactions = transactions.every(function (tx) { return tx && (tx.is_parent || tx.is_child); });
        return areNoReconciledTransactions && areAllSplitTransactions;
    }, [selectedIds, types, getTransaction]);
    function onViewSchedule() {
        var firstId = selectedIds[0];
        var scheduleId;
        if ((0, transactions_1.isPreviewId)(firstId)) {
            var parts = firstId.split('/');
            scheduleId = parts[1];
        }
        else {
            var trans = getTransaction(firstId);
            scheduleId = trans && trans.schedule;
        }
        if (scheduleId) {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: { name: 'schedule-edit', options: { id: scheduleId } },
            }));
        }
    }
    var hotKeyOptions = {
        enabled: types.trans,
        scopes: ['app'],
    };
    (0, react_hotkeys_hook_1.useHotkeys)('f', function () { return onShow(selectedIds); }, hotKeyOptions, [
        onShow,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('u', function () { return onDuplicate(selectedIds); }, hotKeyOptions, [
        onDuplicate,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('d', function () { return onDelete(selectedIds); }, hotKeyOptions, [
        onDelete,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('t', function () { return onEdit('date', selectedIds); }, hotKeyOptions, [
        onEdit,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('a', function () { return onEdit('account', selectedIds); }, hotKeyOptions, [
        onEdit,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('p', function () { return onEdit('payee', selectedIds); }, hotKeyOptions, [
        onEdit,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('n', function () { return onEdit('notes', selectedIds); }, hotKeyOptions, [
        onEdit,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('c', function () { return onEdit('category', selectedIds); }, hotKeyOptions, [
        onEdit,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('l', function () { return onEdit('cleared', selectedIds); }, hotKeyOptions, [
        onEdit,
        selectedIds,
    ]);
    (0, react_hotkeys_hook_1.useHotkeys)('s', function () {
        return !types.trans || linked ? onViewSchedule() : onLinkSchedule(selectedIds);
    }, {
        scopes: ['app'],
    }, [onLinkSchedule, onViewSchedule, linked, selectedIds]);
    // edit amount (only if we're not in a merge context)
    (0, react_hotkeys_hook_1.useHotkeys)('m', function () { return !canMerge && onEdit('amount', selectedIds); }, hotKeyOptions, [onEdit, selectedIds]);
    // merge
    (0, react_hotkeys_hook_1.useHotkeys)('m', function () { return canMerge && onMergeTransactions(selectedIds); }, hotKeyOptions, [onMergeTransactions, selectedIds]);
    return (<table_1.SelectedItemsButton id="transactions" name={function (count) { return t('{{count}} transactions', { count: count }); }} 
    // @ts-expect-error fix me
    items={__spreadArray([], (!types.trans
            ? [
                {
                    name: 'view-schedule',
                    text: t('View schedule'),
                    key: 'S',
                },
                {
                    name: 'post-transaction',
                    text: t('Post transaction'),
                },
                {
                    name: 'post-transaction-today',
                    text: t('Post transaction today'),
                },
                canBeSkipped &&
                    {
                        name: 'skip',
                        text: t('Skip next scheduled date'),
                    },
                canBeCompleted &&
                    { name: 'complete', text: t('Mark as completed') },
            ]
            : __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                { name: 'show', text: t('Show'), key: 'F' },
                {
                    name: 'duplicate',
                    text: t('Duplicate'),
                    key: 'U',
                    disabled: ambiguousDuplication,
                },
                { name: 'delete', text: t('Delete'), key: 'D' }
            ], (linked
                ? [
                    {
                        name: 'view-schedule',
                        text: t('View schedule'),
                        key: 'S',
                        disabled: selectedIds.length > 1,
                    },
                    {
                        name: 'unlink-schedule',
                        text: t('Unlink schedule'),
                    },
                ]
                : [
                    {
                        name: 'link-schedule',
                        text: t('Link schedule'),
                        key: 'S',
                    },
                    {
                        name: 'create-rule',
                        text: t('Create rule'),
                    },
                    {
                        name: 'run-rules',
                        text: t('Run Rules'),
                    },
                ]), true), (showMakeTransfer
                ? [
                    {
                        name: 'set-transfer',
                        text: t('Make transfer'),
                        disabled: !canBeTransfer,
                    },
                ]
                : []), true), (canMakeAsSplitTransaction
                ? [
                    {
                        name: 'make-as-split-transaction',
                        text: t('Make as split transaction'),
                    },
                ]
                : []), true), (canUnsplitTransactions
                ? [
                    {
                        name: 'unsplit-transactions',
                        text: t('Unsplit {{count}} transactions', {
                            count: selectedIds.length,
                        }),
                    },
                ]
                : []), true), (canMerge
                ? [
                    {
                        name: 'merge-transactions',
                        text: t('Merge'),
                        key: 'M',
                    },
                ]
                : []), true), [
                menu_1.Menu.line,
                { type: menu_1.Menu.label, name: t('Edit field'), text: '' },
                { name: 'date', text: t('Date'), key: 'T' },
                { name: 'account', text: t('Account'), key: 'A' },
                { name: 'payee', text: t('Payee'), key: 'P' },
                { name: 'notes', text: t('Notes'), key: 'N' },
                { name: 'category', text: t('Category'), key: 'C' },
                { name: 'amount', text: t('Amount'), key: 'M' },
                { name: 'cleared', text: t('Cleared'), key: 'L' },
            ], false)), true)} onSelect={function (name) {
            switch (name) {
                case 'show':
                    onShow(selectedIds);
                    break;
                case 'duplicate':
                    onDuplicate(selectedIds);
                    break;
                case 'delete':
                    onDelete(selectedIds);
                    break;
                case 'make-as-split-transaction':
                    onMakeAsSplitTransaction(selectedIds);
                    break;
                case 'unsplit-transactions':
                    onMakeAsNonSplitTransactions(selectedIds);
                    break;
                case 'merge-transactions':
                    onMergeTransactions(selectedIds);
                    break;
                case 'post-transaction':
                case 'post-transaction-today':
                case 'skip':
                case 'complete':
                    onScheduleAction(name, selectedIds);
                    break;
                case 'view-schedule':
                    onViewSchedule();
                    break;
                case 'link-schedule':
                    onLinkSchedule(selectedIds);
                    break;
                case 'unlink-schedule':
                    onUnlinkSchedule(selectedIds);
                    break;
                case 'create-rule':
                    onCreateRule(selectedIds);
                    break;
                case 'run-rules':
                    onRunRules(selectedIds);
                    break;
                case 'set-transfer':
                    onSetTransfer(selectedIds);
                    break;
                default:
                    // @ts-expect-error fix me
                    onEdit(name, selectedIds);
            }
        }}/>);
}
