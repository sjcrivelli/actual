"use strict";
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
exports.TransactionMenu = TransactionMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var transactions_1 = require("loot-core/shared/transactions");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function TransactionMenu(_a) {
    var transaction = _a.transaction, getTransaction = _a.getTransaction, onDuplicate = _a.onDuplicate, onDelete = _a.onDelete, onLinkSchedule = _a.onLinkSchedule, onUnlinkSchedule = _a.onUnlinkSchedule, onCreateRule = _a.onCreateRule, onScheduleAction = _a.onScheduleAction, onMakeAsNonSplitTransactions = _a.onMakeAsNonSplitTransactions, closeMenu = _a.closeMenu, props = __rest(_a, ["transaction", "getTransaction", "onDuplicate", "onDelete", "onLinkSchedule", "onUnlinkSchedule", "onCreateRule", "onScheduleAction", "onMakeAsNonSplitTransactions", "closeMenu"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var selectedIds = (0, react_1.useMemo)(function () {
        var ids = selectedItems && selectedItems.size > 0
            ? selectedItems
            : [transaction.id];
        return Array.from(new Set(ids));
    }, [transaction, selectedItems]);
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
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'duplicate':
                    onDuplicate(selectedIds);
                    break;
                case 'delete':
                    onDelete(selectedIds);
                    break;
                case 'unsplit-transactions':
                    onMakeAsNonSplitTransactions(selectedIds);
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
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
            closeMenu();
        }} items={__spreadArray([], (!types.trans
            ? __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (selectedIds.length === 1
                ? [{ name: 'view-schedule', text: t('View schedule') }]
                : []), true), [
                { name: 'post-transaction', text: t('Post transaction') },
                {
                    name: 'post-transaction-today',
                    text: t('Post transaction today'),
                }
            ], false), (canBeSkipped
                ? [{ name: 'skip', text: t('Skip next scheduled date') }]
                : []), true), (canBeCompleted
                ? [{ name: 'complete', text: t('Mark as completed') }]
                : []), true) : __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (ambiguousDuplication
            ? []
            : [{ name: 'duplicate', text: t('Duplicate') }]), true), [
            { name: 'delete', text: t('Delete') }
        ], false), (linked
            ? __spreadArray(__spreadArray([], (selectedIds.length === 1
                ? [{ name: 'view-schedule', text: t('View schedule') }]
                : []), true), [
                { name: 'unlink-schedule', text: t('Unlink schedule') },
            ], false) : [
            {
                name: 'link-schedule',
                text: t('Link schedule'),
            },
            {
                name: 'create-rule',
                text: t('Create rule'),
            },
        ]), true), (canUnsplitTransactions
            ? [
                {
                    name: 'unsplit-transactions',
                    text: t('Unsplit {{count}} transactions', {
                        count: selectedIds.length,
                    }),
                },
            ]
            : []), true)), true)}/>);
}
