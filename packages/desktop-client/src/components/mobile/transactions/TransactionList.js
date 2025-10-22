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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionList = TransactionList;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var transactions_1 = require("loot-core/shared/transactions");
var transfer_1 = require("loot-core/shared/transfer");
var util_1 = require("loot-core/shared/util");
var TransactionListItem_1 = require("./TransactionListItem");
var FloatingActionBar_1 = require("@desktop-client/components/mobile/FloatingActionBar");
var ScrollProvider_1 = require("@desktop-client/components/ScrollProvider");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useTransactionBatchActions_1 = require("@desktop-client/hooks/useTransactionBatchActions");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var NOTIFICATION_BOTTOM_INSET = 75;
function Loading(_a) {
    var style = _a.style, ariaLabel = _a["aria-label"];
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View aria-label={ariaLabel || t('Loading...')} style={__assign({ backgroundColor: theme_1.theme.mobilePageBackground, flex: 1, justifyContent: 'center', alignItems: 'center' }, style)}>
      <AnimatedLoading_1.AnimatedLoading width={25} height={25}/>
    </view_1.View>);
}
function TransactionList(_a) {
    var isLoading = _a.isLoading, transactions = _a.transactions, onOpenTransaction = _a.onOpenTransaction, isLoadingMore = _a.isLoadingMore, onLoadMore = _a.onLoadMore, _b = _a.showMakeTransfer, showMakeTransfer = _b === void 0 ? false : _b;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var sections = (0, react_1.useMemo)(function () {
        // Group by date. We can assume transactions is ordered
        var sections = [];
        transactions.forEach(function (transaction) {
            if (sections.length === 0 ||
                transaction.date !== sections[sections.length - 1].date) {
                sections.push({
                    id: "".concat((0, transactions_1.isPreviewId)(transaction.id) ? 'preview/' : '').concat(transaction.date),
                    date: transaction.date,
                    transactions: [],
                });
            }
            sections[sections.length - 1].transactions.push(transaction);
        });
        return sections;
    }, [transactions]);
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var selectedTransactions = (0, useSelected_1.useSelectedItems)();
    var onTransactionPress = (0, react_1.useCallback)(function (transaction, isLongPress) {
        if (isLongPress === void 0) { isLongPress = false; }
        var isPreview = (0, transactions_1.isPreviewId)(transaction.id);
        if (!isPreview && (isLongPress || selectedTransactions.size > 0)) {
            dispatchSelected({ type: 'select', id: transaction.id });
        }
        else {
            onOpenTransaction === null || onOpenTransaction === void 0 ? void 0 : onOpenTransaction(transaction);
        }
    }, [dispatchSelected, onOpenTransaction, selectedTransactions]);
    (0, ScrollProvider_1.useScrollListener)((0, react_1.useCallback)(function (_a) {
        var hasScrolledToEnd = _a.hasScrolledToEnd;
        if (hasScrolledToEnd('down', 100)) {
            onLoadMore === null || onLoadMore === void 0 ? void 0 : onLoadMore();
        }
    }, [onLoadMore]));
    return (<>
      {isLoading && (<Loading style={{ paddingBottom: 8 }} aria-label={t('Loading transactions...')}/>)}
      <react_aria_components_1.ListBox aria-label={t('Transaction list')} selectionMode={selectedTransactions.size > 0 ? 'multiple' : 'single'} selectedKeys={selectedTransactions} dependencies={[selectedTransactions]} renderEmptyState={function () {
            return !isLoading && (<view_1.View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme_1.theme.mobilePageBackground,
                }}>
              <text_1.Text style={{ fontSize: 15 }}>
                <react_i18next_1.Trans>No transactions</react_i18next_1.Trans>
              </text_1.Text>
            </view_1.View>);
        }} items={sections}>
        {function (section) { return (<react_aria_components_1.ListBoxSection>
            <react_aria_components_1.Header style={__assign(__assign({}, styles_1.styles.smallText), { backgroundColor: theme_1.theme.pageBackground, color: theme_1.theme.tableHeaderText, display: 'flex', justifyContent: 'center', paddingBottom: 4, paddingTop: 4, position: 'sticky', top: '0', width: '100%', zIndex: 10 })}>
              {monthUtils.format(section.date, 'MMMM dd, yyyy', locale)}
            </react_aria_components_1.Header>
            <react_aria_components_1.Collection items={section.transactions.filter(function (t) { return !(0, transactions_1.isPreviewId)(t.id) || !t.is_child; })}>
              {function (transaction) { return (<TransactionListItem_1.TransactionListItem key={transaction.id} value={transaction} onPress={function (trans) { return onTransactionPress(trans); }} onLongPress={function (trans) { return onTransactionPress(trans, true); }}/>); }}
            </react_aria_components_1.Collection>
          </react_aria_components_1.ListBoxSection>); }}
      </react_aria_components_1.ListBox>

      {isLoadingMore && (<Loading aria-label={t('Loading more transactions...')} style={{
                // Same height as transaction list item
                height: TransactionListItem_1.ROW_HEIGHT,
            }}/>)}

      {selectedTransactions.size > 0 && (<SelectedTransactionsFloatingActionBar transactions={transactions} showMakeTransfer={showMakeTransfer}/>)}
    </>);
}
function SelectedTransactionsFloatingActionBar(_a) {
    var transactions = _a.transactions, _b = _a.style, style = _b === void 0 ? {} : _b, showMakeTransfer = _a.showMakeTransfer;
    var t = (0, react_i18next_1.useTranslation)().t;
    var editMenuTriggerRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), isEditMenuOpen = _c[0], setIsEditMenuOpen = _c[1];
    var moreOptionsMenuTriggerRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(false), isMoreOptionsMenuOpen = _d[0], setIsMoreOptionsMenuOpen = _d[1];
    var getMenuItemStyle = (0, react_1.useCallback)(function (item) { return (__assign(__assign(__assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.mobileHeaderText }), (item.disabled === true && { color: theme_1.theme.buttonBareDisabledText })), (item.name === 'delete' && { color: theme_1.theme.errorTextMenu }))); }, []);
    var selectedTransactions = (0, useSelected_1.useSelectedItems)();
    var selectedTransactionsArray = Array.from(selectedTransactions);
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var buttonProps = (0, react_1.useMemo)(function () { return ({
        style: __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: 'currentColor', height: styles_1.styles.mobileMinHeight }),
        activeStyle: {
            color: 'currentColor',
        },
        hoveredStyle: {
            color: 'currentColor',
        },
    }); }, []);
    var allTransactionsAreLinked = (0, react_1.useMemo)(function () {
        return transactions
            .filter(function (t) { return selectedTransactions.has(t.id); })
            .every(function (t) { return t.schedule; });
    }, [transactions, selectedTransactions]);
    var isMoreThanOne = selectedTransactions.size > 1;
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var _e = (0, useTransactionBatchActions_1.useTransactionBatchActions)(), onBatchEdit = _e.onBatchEdit, onBatchDuplicate = _e.onBatchDuplicate, onBatchDelete = _e.onBatchDelete, onBatchLinkSchedule = _e.onBatchLinkSchedule, onBatchUnlinkSchedule = _e.onBatchUnlinkSchedule, onSetTransfer = _e.onSetTransfer, onMerge = _e.onMerge;
    var navigate = (0, useNavigate_1.useNavigate)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var accountsById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(accounts); }, [accounts]);
    var payees = (0, usePayees_1.usePayees)();
    var payeesById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(payees); }, [payees]);
    var categories = (0, useCategories_1.useCategories)().list;
    var categoriesById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(categories); }, [categories]);
    var dispatch = (0, redux_1.useDispatch)();
    (0, react_1.useEffect)(function () {
        dispatch((0, notificationsSlice_1.setNotificationInset)({ inset: { bottom: NOTIFICATION_BOTTOM_INSET } }));
        return function () {
            dispatch((0, notificationsSlice_1.setNotificationInset)(null));
        };
    }, [dispatch]);
    var twoTransactions = (0, react_1.useMemo)(function () {
        // only two selected
        if (selectedTransactionsArray.length !== 2) {
            return undefined;
        }
        var _a = selectedTransactionsArray.map(function (id) {
            return transactions.find(function (t) { return t.id === id; });
        }), a = _a[0], b = _a[1];
        if (!a || !b) {
            return undefined;
        }
        return [a, b];
    }, [selectedTransactionsArray, transactions]);
    var canBeTransfer = (0, react_1.useMemo)(function () {
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
    var moreOptionsMenuItems = [
        {
            name: 'duplicate',
            text: t('Duplicate'),
        },
        {
            name: allTransactionsAreLinked ? 'unlink-schedule' : 'link-schedule',
            text: allTransactionsAreLinked
                ? t('Unlink schedule')
                : t('Link schedule'),
        },
        {
            name: 'delete',
            text: t('Delete'),
        },
        {
            name: 'merge',
            text: t('Merge'),
            disabled: !canMerge,
        },
    ];
    if (showMakeTransfer) {
        moreOptionsMenuItems.splice(2, 0, {
            name: 'transfer',
            text: t('Make transfer'),
            disabled: !canBeTransfer,
        });
    }
    return (<FloatingActionBar_1.FloatingActionBar style={style}>
      <view_1.View style={{
            flex: 1,
            padding: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        }}>
          <button_1.Button variant="bare" {...buttonProps} style={__assign(__assign({}, buttonProps.style), { marginRight: 4 })} onPress={function () {
            if (selectedTransactions.size > 0) {
                dispatchSelected({ type: 'select-none' });
            }
        }}>
            <v0_1.SvgDelete width={10} height={10}/>
          </button_1.Button>
          <text_1.Text style={styles_1.styles.mediumText}>
            {selectedTransactions.size}{' '}
            {isMoreThanOne ? 'transactions' : 'transaction'} selected
          </text_1.Text>
        </view_1.View>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
        }}>
          <button_1.Button variant="bare" ref={editMenuTriggerRef} aria-label={t('Edit fields')} onPress={function () {
            setIsEditMenuOpen(true);
        }} {...buttonProps}>
            <react_i18next_1.Trans>Edit</react_i18next_1.Trans>
          </button_1.Button>

          <popover_1.Popover triggerRef={editMenuTriggerRef} isOpen={isEditMenuOpen} onOpenChange={function () { return setIsEditMenuOpen(false); }} style={{ width: 200 }}>
            <menu_1.Menu getItemStyle={getMenuItemStyle} style={{ backgroundColor: theme_1.theme.floatingActionBarBackground }} onMenuSelect={function (name) {
            onBatchEdit === null || onBatchEdit === void 0 ? void 0 : onBatchEdit({
                name: name,
                ids: selectedTransactionsArray,
                onSuccess: function (ids, name, value, mode) {
                    var _a;
                    var _b, _c, _d, _e, _f, _g;
                    var displayValue;
                    switch (name) {
                        case 'account':
                            displayValue =
                                (_c = (_b = accountsById[String(value)]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : value;
                            break;
                        case 'category':
                            displayValue =
                                (_e = (_d = categoriesById[String(value)]) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : value;
                            break;
                        case 'payee':
                            displayValue = (_g = (_f = payeesById[String(value)]) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : value;
                            break;
                        case 'amount':
                            displayValue = Number.isNaN(Number(value))
                                ? value
                                : (0, util_1.integerToCurrency)(Number(value));
                            break;
                        case 'notes':
                            displayValue = "".concat(mode, " with ").concat(value);
                            break;
                        default:
                            displayValue = value;
                            break;
                    }
                    showUndoNotification({
                        message: "Successfully updated ".concat(name, " of ").concat(ids.length, " transaction").concat(ids.length > 1 ? 's' : '', " to [").concat(displayValue, "](#").concat(displayValue, ")."),
                        messageActions: (_a = {},
                            _a[String(displayValue)] = function () {
                                switch (name) {
                                    case 'account':
                                        navigate("/accounts/".concat(value));
                                        break;
                                    case 'category':
                                        navigate("/categories/".concat(value));
                                        break;
                                    case 'payee':
                                        navigate("/payees");
                                        break;
                                    default:
                                        break;
                                }
                            },
                            _a),
                    });
                },
            });
            setIsEditMenuOpen(false);
        }} items={[
            // Add support later on.
            // Pikaday doesn't play well will mobile.
            // We should consider switching to react-aria date picker.
            // {
            //   name: 'date',
            //   text: 'Date',
            // },
            {
                name: 'account',
                text: t('Account'),
            },
            {
                name: 'payee',
                text: t('Payee'),
            },
            {
                name: 'notes',
                text: t('Notes'),
            },
            {
                name: 'category',
                text: t('Category'),
            },
            // Add support later on until we have more user friendly amount input modal.
            // {
            //   name: 'amount',
            //   text: 'Amount',
            // },
            {
                name: 'cleared',
                text: t('Cleared'),
            },
        ]}/>
          </popover_1.Popover>

          <button_1.Button variant="bare" ref={moreOptionsMenuTriggerRef} aria-label={t('More options')} onPress={function () {
            setIsMoreOptionsMenuOpen(true);
        }} {...buttonProps}>
            <v1_1.SvgDotsHorizontalTriple width={16} height={16} style={{ color: 'currentColor' }}/>
          </button_1.Button>

          <popover_1.Popover triggerRef={moreOptionsMenuTriggerRef} isOpen={isMoreOptionsMenuOpen} onOpenChange={function () { return setIsMoreOptionsMenuOpen(false); }} style={{ width: 200 }}>
            <menu_1.Menu getItemStyle={getMenuItemStyle} style={{ backgroundColor: theme_1.theme.floatingActionBarBackground }} onMenuSelect={function (type) {
            if (type === 'duplicate') {
                onBatchDuplicate === null || onBatchDuplicate === void 0 ? void 0 : onBatchDuplicate({
                    ids: selectedTransactionsArray,
                    onSuccess: function (ids) {
                        showUndoNotification({
                            message: t('Successfully duplicated {{count}} transactions.', { count: ids.length }),
                        });
                    },
                });
            }
            else if (type === 'link-schedule') {
                onBatchLinkSchedule === null || onBatchLinkSchedule === void 0 ? void 0 : onBatchLinkSchedule({
                    ids: selectedTransactionsArray,
                    onSuccess: function (ids, schedule) {
                        // TODO: When schedule becomes available in mobile, update undo notification message
                        // with `messageActions` to open the schedule when the schedule name is clicked.
                        showUndoNotification({
                            message: t('Successfully linked {{count}} transactions to {{schedule}}.', { count: ids.length, schedule: schedule.name }),
                        });
                    },
                });
            }
            else if (type === 'unlink-schedule') {
                onBatchUnlinkSchedule === null || onBatchUnlinkSchedule === void 0 ? void 0 : onBatchUnlinkSchedule({
                    ids: selectedTransactionsArray,
                    onSuccess: function (ids) {
                        showUndoNotification({
                            message: t('Successfully unlinked {{count}} transactions from their respective schedules.', { count: ids.length }),
                        });
                    },
                });
            }
            else if (type === 'delete') {
                onBatchDelete === null || onBatchDelete === void 0 ? void 0 : onBatchDelete({
                    ids: selectedTransactionsArray,
                    onSuccess: function (ids) {
                        showUndoNotification({
                            type: 'warning',
                            message: t('Successfully deleted {{count}} transactions.', { count: ids.length }),
                        });
                    },
                });
            }
            else if (type === 'transfer') {
                onSetTransfer === null || onSetTransfer === void 0 ? void 0 : onSetTransfer(selectedTransactionsArray, payees, function (ids) {
                    return showUndoNotification({
                        message: t('Successfully marked {{count}} transactions as transfer.', {
                            count: ids.length,
                        }),
                    });
                });
            }
            else if (type === 'merge') {
                onMerge === null || onMerge === void 0 ? void 0 : onMerge(selectedTransactionsArray, function () {
                    return showUndoNotification({
                        message: t('Successfully merged transactions'),
                    });
                });
            }
            setIsMoreOptionsMenuOpen(false);
        }} items={moreOptionsMenuItems}/>
          </popover_1.Popover>
        </view_1.View>
      </view_1.View>
    </FloatingActionBar_1.FloatingActionBar>);
}
