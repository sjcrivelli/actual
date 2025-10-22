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
exports.AccountHeader = AccountHeader;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var util_1 = require("loot-core/shared/util");
var Balance_1 = require("./Balance");
var BalanceHistoryGraph_1 = require("./BalanceHistoryGraph");
var Reconcile_1 = require("./Reconcile");
var AnimatedRefresh_1 = require("@desktop-client/components/AnimatedRefresh");
var Search_1 = require("@desktop-client/components/common/Search");
var FiltersMenu_1 = require("@desktop-client/components/filters/FiltersMenu");
var FiltersStack_1 = require("@desktop-client/components/filters/FiltersStack");
var NotesButton_1 = require("@desktop-client/components/NotesButton");
var SelectedTransactionsButton_1 = require("@desktop-client/components/transactions/SelectedTransactionsButton");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useSplitsExpanded_1 = require("@desktop-client/hooks/useSplitsExpanded");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useSyncServerStatus_1 = require("@desktop-client/hooks/useSyncServerStatus");
function AccountHeader(_a) {
    var _b;
    var tableRef = _a.tableRef, isNameEditable = _a.isNameEditable, workingHard = _a.workingHard, accountName = _a.accountName, accountId = _a.accountId, account = _a.account, filterId = _a.filterId, savedFilters = _a.savedFilters, accountsSyncing = _a.accountsSyncing, failedAccounts = _a.failedAccounts, accounts = _a.accounts, transactions = _a.transactions, showBalances = _a.showBalances, showExtraBalances = _a.showExtraBalances, showCleared = _a.showCleared, showReconciled = _a.showReconciled, showEmptyMessage = _a.showEmptyMessage, balanceQuery = _a.balanceQuery, reconcileAmount = _a.reconcileAmount, canCalculateBalance = _a.canCalculateBalance, isFiltered = _a.isFiltered, filteredAmount = _a.filteredAmount, isSorted = _a.isSorted, search = _a.search, filterConditions = _a.filterConditions, filterConditionsOp = _a.filterConditionsOp, onSearch = _a.onSearch, onAddTransaction = _a.onAddTransaction, onShowTransactions = _a.onShowTransactions, onDoneReconciling = _a.onDoneReconciling, onCreateReconciliationTransaction = _a.onCreateReconciliationTransaction, onToggleExtraBalances = _a.onToggleExtraBalances, onSaveName = _a.onSaveName, saveNameError = _a.saveNameError, onSync = _a.onSync, onImport = _a.onImport, onMenuSelect = _a.onMenuSelect, onReconcile = _a.onReconcile, onBatchDelete = _a.onBatchDelete, onBatchDuplicate = _a.onBatchDuplicate, onBatchEdit = _a.onBatchEdit, onBatchLinkSchedule = _a.onBatchLinkSchedule, onBatchUnlinkSchedule = _a.onBatchUnlinkSchedule, onCreateRule = _a.onCreateRule, onApplyFilter = _a.onApplyFilter, onUpdateFilter = _a.onUpdateFilter, onClearFilters = _a.onClearFilters, onReloadSavedFilter = _a.onReloadSavedFilter, onConditionsOpChange = _a.onConditionsOpChange, onDeleteFilter = _a.onDeleteFilter, onScheduleAction = _a.onScheduleAction, onSetTransfer = _a.onSetTransfer, onRunRules = _a.onRunRules, onMakeAsSplitTransaction = _a.onMakeAsSplitTransaction, onMakeAsNonSplitTransactions = _a.onMakeAsNonSplitTransactions, onMergeTransactions = _a.onMergeTransactions;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _c = (0, react_1.useState)(false), reconcileOpen = _c[0], setReconcileOpen = _c[1];
    var searchInput = (0, react_1.useRef)(null);
    var reconcileRef = (0, react_1.useRef)(null);
    var splitsExpanded = (0, useSplitsExpanded_1.useSplitsExpanded)();
    var syncServerStatus = (0, useSyncServerStatus_1.useSyncServerStatus)();
    var isUsingServer = syncServerStatus !== 'no-server';
    var isServerOffline = syncServerStatus === 'offline';
    var _d = (0, useLocalPref_1.useLocalPref)('expand-splits'), _ = _d[0], setExpandSplitsPref = _d[1];
    var _e = (0, useSyncedPref_1.useSyncedPref)("show-account-".concat(accountId, "-net-worth-chart")), showNetWorthChartPref = _e[0], _setShowNetWorthChartPref = _e[1];
    var showNetWorthChart = showNetWorthChartPref === 'true';
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var locale = (0, useLocale_1.useLocale)();
    var canSync = !!((account === null || account === void 0 ? void 0 : account.account_id) && isUsingServer);
    if (!account) {
        // All accounts - check for any syncable account
        canSync = !!accounts.find(function (account) { return !!account.account_id; }) && isUsingServer;
    }
    // Only show the ability to make linked transfers on multi-account views.
    var showMakeTransfer = !account;
    function onToggleSplits() {
        if (tableRef.current) {
            splitsExpanded.dispatch({
                type: 'switch-mode',
                id: tableRef.current.getScrolledItem(),
            });
            setExpandSplitsPref(!(splitsExpanded.state.mode === 'expand'));
        }
    }
    var graphRef = (0, react_1.useRef)(null);
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+f, cmd+f, meta+f', function () {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }, {
        enableOnFormTags: true,
        preventDefault: true,
        scopes: ['app'],
    }, [searchInput]);
    (0, react_hotkeys_hook_1.useHotkeys)('t', function () { return onAddTransaction(); }, {
        preventDefault: true,
        scopes: ['app'],
    }, [onAddTransaction]);
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+i, cmd+i, meta+i', function () { return onImport(); }, {
        scopes: ['app'],
    }, [onImport]);
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+b, cmd+b, meta+b', function () { return onSync(); }, {
        enabled: canSync && !isServerOffline,
        preventDefault: true,
        scopes: ['app'],
    }, [onSync]);
    return (<>
      <view_1.View style={__assign(__assign({}, styles_1.styles.pageContent), { paddingBottom: 10, flexShrink: 0 })}>
        <view_1.View style={{
            flexDirection: 'column',
            marginTop: 2,
            justifyContent: 'space-between',
            gap: 10,
        }}>
          <view_1.View style={{
            flexGrow: 1,
            alignItems: 'flex-start',
            gap: 10,
        }}>
            <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
        }}>
              {!!(account === null || account === void 0 ? void 0 : account.bank) && (<AccountSyncSidebar account={account} failedAccounts={failedAccounts} accountsSyncing={accountsSyncing}/>)}
              <AccountNameField account={account} accountName={accountName} isNameEditable={isNameEditable} saveNameError={saveNameError} onSaveName={onSaveName}/>
            </view_1.View>

            <Balance_1.Balances balanceQuery={balanceQuery} showExtraBalances={showExtraBalances} onToggleExtraBalances={onToggleExtraBalances} account={account} isFiltered={isFiltered} filteredAmount={filteredAmount}/>
          </view_1.View>

          <BalanceHistoryGraph_1.BalanceHistoryGraph ref={graphRef} accountId={accountId} style={{
            height: 'calc(5vh + 5vw)',
            margin: 0,
            display: showNetWorthChart ? 'flex' : 'none',
        }}/>
        </view_1.View>
        <stack_1.Stack spacing={2} direction="row" align="center" style={{ marginTop: 12 }}>
          {canSync && (<button_1.Button variant="bare" onPress={onSync} isDisabled={isServerOffline}>
              <AnimatedRefresh_1.AnimatedRefresh width={13} height={13} animating={account
                ? accountsSyncing.includes(account.id)
                : accountsSyncing.length > 0}/>{' '}
              {isServerOffline ? t('Bank Sync Offline') : t('Bank Sync')}
            </button_1.Button>)}

          {account && !account.closed && (<button_1.Button variant="bare" onPress={onImport}>
              <v2_1.SvgDownloadThickBottom width={13} height={13} style={{ marginRight: 4 }}/>{' '}
              <react_i18next_1.Trans>Import</react_i18next_1.Trans>
            </button_1.Button>)}

          {!showEmptyMessage && (<button_1.Button variant="bare" onPress={onAddTransaction}>
              <v1_1.SvgAdd width={10} height={10} style={{ marginRight: 3 }}/>
              <react_i18next_1.Trans>Add New</react_i18next_1.Trans>
            </button_1.Button>)}
          <view_1.View style={{ flexShrink: 0 }}>
            {/* @ts-expect-error fix me */}
            <FiltersMenu_1.FilterButton onApply={onApplyFilter}/>
          </view_1.View>
          <view_1.View style={{ flex: 1 }}/>
          <Search_1.Search placeholder={t('Search')} value={search} onChange={onSearch} inputRef={searchInput} 
    // Remove marginRight magically being added by Stack...
    // We need to refactor the Stack component
    style={{ marginRight: 0 }}/>
          {workingHard ? (<view_1.View>
              <AnimatedLoading_1.AnimatedLoading style={{ width: 16, height: 16 }}/>
            </view_1.View>) : (<SelectedTransactionsButton_1.SelectedTransactionsButton getTransaction={function (id) { return transactions.find(function (t) { return t.id === id; }); }} onShow={onShowTransactions} onDuplicate={onBatchDuplicate} onDelete={onBatchDelete} onEdit={onBatchEdit} onRunRules={onRunRules} onLinkSchedule={onBatchLinkSchedule} onUnlinkSchedule={onBatchUnlinkSchedule} onCreateRule={onCreateRule} onSetTransfer={onSetTransfer} onScheduleAction={onScheduleAction} showMakeTransfer={showMakeTransfer} onMakeAsSplitTransaction={onMakeAsSplitTransaction} onMakeAsNonSplitTransactions={onMakeAsNonSplitTransactions} onMergeTransactions={onMergeTransactions}/>)}
          <view_1.View style={{ flex: '0 0 auto', marginLeft: 10 }}>
            {account && (<tooltip_1.Tooltip style={__assign(__assign({}, styles_1.styles.tooltip), { marginBottom: 10 })} content={(account === null || account === void 0 ? void 0 : account.last_reconciled)
                ? t('Reconciled {{ relativeTimeAgo }} ({{ absoluteDate }})', {
                    relativeTimeAgo: (0, util_1.tsToRelativeTime)(account.last_reconciled, locale),
                    absoluteDate: (0, date_fns_1.format)(new Date(parseInt((_b = account.last_reconciled) !== null && _b !== void 0 ? _b : '0', 10)), dateFormat, { locale: locale }),
                })
                : t('Not yet reconciled')} placement="top" triggerProps={{
                isDisabled: reconcileOpen,
            }}>
                <button_1.Button ref={reconcileRef} variant="bare" aria-label={t('Reconcile')} style={{ padding: 6 }} onPress={function () {
                setReconcileOpen(true);
            }}>
                  <view_1.View>
                    <v2_1.SvgLockClosed width={14} height={14}/>
                  </view_1.View>
                </button_1.Button>
                <popover_1.Popover placement="bottom" triggerRef={reconcileRef} style={{ width: 275 }} isOpen={reconcileOpen} onOpenChange={function () { return setReconcileOpen(false); }}>
                  <Reconcile_1.ReconcileMenu account={account} onClose={function () { return setReconcileOpen(false); }} onReconcile={onReconcile}/>
                </popover_1.Popover>
              </tooltip_1.Tooltip>)}
          </view_1.View>
          <button_1.Button variant="bare" aria-label={splitsExpanded.state.mode === 'collapse'
            ? t('Collapse split transactions')
            : t('Expand split transactions')} style={{ padding: 6 }} onPress={onToggleSplits}>
            <view_1.View title={splitsExpanded.state.mode === 'collapse'
            ? t('Collapse split transactions')
            : t('Expand split transactions')}>
              {splitsExpanded.state.mode === 'collapse' ? (<v2_1.SvgArrowsShrink3 style={{ width: 14, height: 14 }}/>) : (<v2_1.SvgArrowsExpand3 style={{ width: 14, height: 14 }}/>)}
            </view_1.View>
          </button_1.Button>
          {account ? (<view_1.View style={{ flex: '0 0 auto' }}>
              <react_aria_components_1.DialogTrigger>
                <button_1.Button variant="bare" aria-label={t('Account menu')}>
                  <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
                </button_1.Button>

                <popover_1.Popover style={{ minWidth: 275 }}>
                  <react_aria_components_1.Dialog>
                    <AccountMenu account={account} canSync={canSync} showNetWorthChart={showNetWorthChart} canShowBalances={canCalculateBalance ? canCalculateBalance() : false} isSorted={isSorted} showBalances={showBalances} showCleared={showCleared} showReconciled={showReconciled} onMenuSelect={onMenuSelect}/>
                  </react_aria_components_1.Dialog>
                </popover_1.Popover>
              </react_aria_components_1.DialogTrigger>
            </view_1.View>) : (<view_1.View style={{ flex: '0 0 auto' }}>
              <react_aria_components_1.DialogTrigger>
                <button_1.Button variant="bare" aria-label={t('Account menu')}>
                  <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
                </button_1.Button>

                <popover_1.Popover>
                  <react_aria_components_1.Dialog>
                    <menu_1.Menu slot="close" onMenuSelect={onMenuSelect} items={__spreadArray(__spreadArray([], (isSorted
                ? [
                    {
                        name: 'remove-sorting',
                        text: t('Remove all sorting'),
                    },
                ]
                : []), true), [
                { name: 'export', text: t('Export') },
                {
                    name: 'toggle-net-worth-chart',
                    text: showNetWorthChart
                        ? t('Hide balance chart')
                        : t('Show balance chart'),
                },
            ], false)}/>
                  </react_aria_components_1.Dialog>
                </popover_1.Popover>
              </react_aria_components_1.DialogTrigger>
            </view_1.View>)}
        </stack_1.Stack>
        {(filterConditions === null || filterConditions === void 0 ? void 0 : filterConditions.length) > 0 && (<FiltersStack_1.FiltersStack conditions={filterConditions} conditionsOp={filterConditionsOp} onUpdateFilter={onUpdateFilter} onDeleteFilter={onDeleteFilter} onClearFilters={onClearFilters} onReloadSavedFilter={onReloadSavedFilter} filterId={filterId} savedFilters={savedFilters} onConditionsOpChange={onConditionsOpChange}/>)}
      </view_1.View>
      {reconcileAmount != null && (<Reconcile_1.ReconcilingMessage targetBalance={reconcileAmount} balanceQuery={balanceQuery} onDone={onDoneReconciling} onCreateTransaction={onCreateReconciliationTransaction}/>)}
    </>);
}
function AccountSyncSidebar(_a) {
    var account = _a.account, failedAccounts = _a.failedAccounts, accountsSyncing = _a.accountsSyncing;
    return (<view_1.View style={{
            backgroundColor: accountsSyncing.includes(account.id)
                ? theme_1.theme.sidebarItemBackgroundPending
                : failedAccounts.has(account.id)
                    ? theme_1.theme.sidebarItemBackgroundFailed
                    : theme_1.theme.sidebarItemBackgroundPositive,
            marginRight: '4px',
            width: 8,
            height: 8,
            borderRadius: 8,
        }}/>);
}
function AccountNameField(_a) {
    var account = _a.account, accountName = _a.accountName, isNameEditable = _a.isNameEditable, saveNameError = _a.saveNameError, onSaveName = _a.onSaveName;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(false), editingName = _b[0], setEditingName = _b[1];
    var handleSave = function (newName) {
        onSaveName(newName);
        setEditingName(false);
    };
    return (<view_1.View style={{ flexShrink: 0, alignItems: 'center' }}>
      {editingName ? (<>
          <initial_focus_1.InitialFocus>
            <input_1.Input defaultValue={accountName} onEnter={handleSave} onUpdate={handleSave} onEscape={function () { return setEditingName(false); }} style={{
                fontSize: 25,
                fontWeight: 500,
                marginTop: -3,
                marginBottom: -4,
                marginLeft: -6,
                paddingTop: 2,
                paddingBottom: 2,
                width: Math.max(20, accountName.length) + 'ch',
            }}/>
          </initial_focus_1.InitialFocus>
          {saveNameError && (<view_1.View style={{ color: theme_1.theme.warningText }}>{saveNameError}</view_1.View>)}
        </>) : (<view_1.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                gap: 3,
                '& .hover-visible': {
                    opacity: 0,
                    transition: 'opacity .25s',
                },
                '&:hover .hover-visible': {
                    opacity: 1,
                },
            }}>
          <view_1.View style={{
                fontSize: 25,
                fontWeight: 500,
                marginRight: 5,
                marginBottom: -1,
            }} data-testid="account-name">
            {account && account.closed
                ? t('Closed: {{ accountName }}', { accountName: accountName })
                : accountName}
          </view_1.View>

          <view_1.View style={{ flexDirection: 'row', width: 50 }}>
            {isNameEditable && account && (<NotesButton_1.NotesButton id={"account-".concat(account.id)} defaultColor={theme_1.theme.pageTextSubdued}/>)}
            {isNameEditable && (<button_1.Button variant="bare" aria-label={t('Edit account name')} className="hover-visible" onPress={function () { return setEditingName(true); }}>
                <v2_1.SvgPencil1 style={{
                    width: 11,
                    height: 11,
                    color: theme_1.theme.pageTextSubdued,
                }}/>
              </button_1.Button>)}
          </view_1.View>
        </view_1.View>)}
    </view_1.View>);
}
function AccountMenu(_a) {
    var account = _a.account, canSync = _a.canSync, showNetWorthChart = _a.showNetWorthChart, showBalances = _a.showBalances, canShowBalances = _a.canShowBalances, showCleared = _a.showCleared, showReconciled = _a.showReconciled, isSorted = _a.isSorted, onMenuSelect = _a.onMenuSelect;
    var t = (0, react_i18next_1.useTranslation)().t;
    var syncServerStatus = (0, useSyncServerStatus_1.useSyncServerStatus)();
    return (<menu_1.Menu slot="close" onMenuSelect={function (item) {
            onMenuSelect(item);
        }} items={__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (isSorted
            ? [
                {
                    name: 'remove-sorting',
                    text: t('Remove all sorting'),
                },
            ]
            : []), true), (canShowBalances
            ? [
                {
                    name: 'toggle-balance',
                    text: showBalances
                        ? t('Hide running balance')
                        : t('Show running balance'),
                },
            ]
            : []), true), [
            {
                name: 'toggle-net-worth-chart',
                text: showNetWorthChart
                    ? t('Hide balance chart')
                    : t('Show balance chart'),
            },
            {
                name: 'toggle-cleared',
                text: showCleared
                    ? t('Hide “cleared” checkboxes')
                    : t('Show “cleared” checkboxes'),
            },
            {
                name: 'toggle-reconciled',
                text: showReconciled
                    ? t('Hide reconciled transactions')
                    : t('Show reconciled transactions'),
            },
            { name: 'export', text: t('Export') }
        ], false), (account && !account.closed
            ? canSync
                ? [
                    {
                        name: 'unlink',
                        text: t('Unlink account'),
                    },
                ]
                : syncServerStatus === 'online'
                    ? [
                        {
                            name: 'link',
                            text: t('Link account'),
                        },
                    ]
                    : []
            : []), true), (account.closed
            ? [{ name: 'reopen', text: t('Reopen account') }]
            : [{ name: 'close', text: t('Close account') }]), true)}/>);
}
