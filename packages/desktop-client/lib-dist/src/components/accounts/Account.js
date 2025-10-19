import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PureComponent, createRef, useMemo, useEffect, } from 'react';
import { Trans } from 'react-i18next';
import { Navigate, useParams, useLocation } from 'react-router';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { t } from 'i18next';
import debounce from 'lodash/debounce';
import { v4 as uuidv4 } from 'uuid';
import { send, listen } from 'loot-core/platform/client/fetch';
import * as undo from 'loot-core/platform/client/undo';
import { currentDay } from 'loot-core/shared/months';
import { q } from 'loot-core/shared/query';
import { updateTransaction, realizeTempTransactions, ungroupTransaction, ungroupTransactions, makeChild, makeAsNonChildTransactions, } from 'loot-core/shared/transactions';
import { applyChanges } from 'loot-core/shared/util';
import { AccountEmptyMessage } from './AccountEmptyMessage';
import { AccountHeader } from './Header';
import { unlinkAccount, reopenAccount, updateAccount, markAccountRead, } from '@desktop-client/accounts/accountsSlice';
import { syncAndDownload } from '@desktop-client/app/appSlice';
import { TransactionList } from '@desktop-client/components/transactions/TransactionList';
import { validateAccountName } from '@desktop-client/components/util/accountValidation';
import { useAccountPreviewTransactions } from '@desktop-client/hooks/useAccountPreviewTransactions';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { SchedulesProvider } from '@desktop-client/hooks/useCachedSchedules';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFailedAccounts } from '@desktop-client/hooks/useFailedAccounts';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { getSchedulesQuery } from '@desktop-client/hooks/useSchedules';
import { SelectedProviderWithItems, } from '@desktop-client/hooks/useSelected';
import { SplitsExpandedProvider, useSplitsExpanded, } from '@desktop-client/hooks/useSplitsExpanded';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useTransactionBatchActions } from '@desktop-client/hooks/useTransactionBatchActions';
import { useTransactionFilters } from '@desktop-client/hooks/useTransactionFilters';
import { calculateRunningBalancesBottomUp } from '@desktop-client/hooks/useTransactions';
import { openAccountCloseModal, pushModal, replaceModal, } from '@desktop-client/modals/modalsSlice';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { createPayee, getPayees } from '@desktop-client/payees/payeesSlice';
import * as queries from '@desktop-client/queries';
import { aqlQuery } from '@desktop-client/queries/aqlQuery';
import { pagedQuery, } from '@desktop-client/queries/pagedQuery';
import { useSelector, useDispatch } from '@desktop-client/redux';
import { updateNewTransactions } from '@desktop-client/transactions/transactionsSlice';
function isTransactionFilterEntity(filter) {
    return 'id' in filter;
}
function AllTransactions({ account, transactions, balances, showBalances, filtered, children, }) {
    const accountId = account?.id;
    const { dispatch: splitsExpandedDispatch } = useSplitsExpanded();
    const { previewTransactions, isLoading: isPreviewTransactionsLoading } = useAccountPreviewTransactions({ accountId });
    useEffect(() => {
        if (!isPreviewTransactionsLoading) {
            splitsExpandedDispatch({
                type: 'close-splits',
                ids: previewTransactions.filter(t => t.is_parent).map(t => t.id),
            });
        }
    }, [
        isPreviewTransactionsLoading,
        previewTransactions,
        splitsExpandedDispatch,
    ]);
    transactions ?? (transactions = []);
    const runningBalance = useMemo(() => {
        if (!showBalances) {
            return 0;
        }
        return balances && transactions?.length > 0
            ? (balances[transactions[0].id] ?? 0)
            : 0;
    }, [showBalances, balances, transactions]);
    const prependBalances = useMemo(() => {
        if (!showBalances) {
            return null;
        }
        return Object.fromEntries(calculateRunningBalancesBottomUp(previewTransactions, 'all', runningBalance));
    }, [showBalances, previewTransactions, runningBalance]);
    const allTransactions = useMemo(() => {
        // Don't prepend scheduled transactions if we are filtering
        if (!filtered && previewTransactions.length > 0) {
            return previewTransactions.concat(transactions);
        }
        return transactions;
    }, [filtered, previewTransactions, transactions]);
    const allBalances = useMemo(() => {
        // Don't prepend scheduled transactions if we are filtering
        if (!filtered && prependBalances && balances) {
            return { ...prependBalances, ...balances };
        }
        return balances;
    }, [filtered, prependBalances, balances]);
    if (!previewTransactions?.length || filtered) {
        return children(transactions, balances);
    }
    return children(allTransactions, allBalances);
}
function getField(field) {
    if (!field) {
        return 'date';
    }
    switch (field) {
        case 'account':
            return 'account.name';
        case 'payee':
            return 'payee.name';
        case 'category':
            return 'category.name';
        case 'payment':
            return 'amount';
        case 'deposit':
            return 'amount';
        default:
            return field;
    }
}
class AccountInternal extends PureComponent {
    constructor(props) {
        super(props);
        this.fetchAllIds = async () => {
            if (!this.paged) {
                return [];
            }
            const { data } = await aqlQuery(this.paged.query.select('id'));
            // Remember, this is the `grouped` split type so we need to deal
            // with the `subtransactions` property
            return data.reduce((arr, t) => {
                arr.push(t.id);
                t.subtransactions?.forEach(sub => arr.push(sub.id));
                return arr;
            }, []);
        };
        this.refetchTransactions = async () => {
            this.paged?.run();
        };
        this.fetchTransactions = (filterConditions) => {
            const query = this.makeRootTransactionsQuery();
            this.rootQuery = this.currentQuery = query;
            if (filterConditions)
                this.applyFilters(filterConditions);
            else
                this.updateQuery(query);
            if (this.props.accountId) {
                this.props.dispatch(markAccountRead({ id: this.props.accountId }));
            }
        };
        this.makeRootTransactionsQuery = () => {
            const accountId = this.props.accountId;
            return queries.transactions(accountId);
        };
        this.onSearch = (value) => {
            this.paged?.unsubscribe();
            this.setState({ search: value }, this.onSearchDone);
        };
        this.onSearchDone = debounce(() => {
            if (this.state.search === '') {
                this.updateQuery(this.currentQuery, this.state.filterConditions.length > 0);
            }
            else {
                this.updateQuery(queries.transactionsSearch(this.currentQuery, this.state.search, this.props.dateFormat), true);
            }
        }, 150);
        this.onSync = async () => {
            const accountId = this.props.accountId;
            const account = this.props.accounts.find(acct => acct.id === accountId);
            await this.props.dispatch(syncAndDownload({ accountId: account ? account.id : accountId }));
        };
        this.onImport = async () => {
            const accountId = this.props.accountId;
            const account = this.props.accounts.find(acct => acct.id === accountId);
            if (account) {
                const res = await window.Actual.openFileDialog({
                    filters: [
                        {
                            name: t('Financial files'),
                            extensions: ['qif', 'ofx', 'qfx', 'csv', 'tsv', 'xml'],
                        },
                    ],
                });
                if (res) {
                    if (accountId && res?.length > 0) {
                        this.props.dispatch(pushModal({
                            modal: {
                                name: 'import-transactions',
                                options: {
                                    accountId,
                                    filename: res[0],
                                    onImported: (didChange) => {
                                        if (didChange) {
                                            this.fetchTransactions();
                                        }
                                    },
                                },
                            },
                        }));
                    }
                }
            }
        };
        this.onExport = async (accountName) => {
            const exportedTransactions = await send('transactions-export-query', {
                query: this.currentQuery.serialize(),
            });
            const normalizedName = accountName && accountName.replace(/[()]/g, '').replace(/\s+/g, '-');
            const filename = `${normalizedName || 'transactions'}.csv`;
            window.Actual.saveFile(exportedTransactions, filename, t('Export transactions'));
        };
        this.onTransactionsChange = (updatedTransaction) => {
            // Apply changes to pagedQuery data
            this.paged?.optimisticUpdate(data => {
                if (updatedTransaction._deleted) {
                    return data.filter(t => t.id !== updatedTransaction.id);
                }
                else {
                    return data.map(t => {
                        return t.id === updatedTransaction.id ? updatedTransaction : t;
                    });
                }
            });
            this.props.dispatch(updateNewTransactions({ id: updatedTransaction.id }));
        };
        this.canCalculateBalance = () => {
            const accountId = this.props.accountId;
            const account = this.props.accounts.find(account => account.id === accountId);
            if (!account)
                return false;
            if (this.state.search !== '')
                return false;
            if (this.state.filterConditions.length > 0)
                return false;
            if (this.state.sort === null) {
                return true;
            }
            else {
                return (this.state.sort.field === 'date' && this.state.sort.ascDesc === 'desc');
            }
        };
        this.onRunRules = async (ids) => {
            try {
                this.setState({ workingHard: true });
                // Bulk fetch transactions
                const transactions = this.state.transactions.filter(trans => ids.includes(trans.id));
                const changedTransactions = [];
                for (const transaction of transactions) {
                    const res = await send('rules-run', {
                        transaction,
                    });
                    if (res) {
                        changedTransactions.push(...ungroupTransaction(res));
                    }
                }
                // If we have changed transactions, update them in the database
                if (changedTransactions.length > 0) {
                    await send('transactions-batch-update', {
                        updated: changedTransactions,
                    });
                }
                // Fetch updated transactions once at the end
                this.fetchTransactions();
            }
            catch (error) {
                console.error('Error applying rules:', error);
                this.props.dispatch(addNotification({
                    notification: {
                        type: 'error',
                        message: 'Failed to apply rules to transactions',
                    },
                }));
            }
            finally {
                this.setState({ workingHard: false });
            }
        };
        this.onAddTransaction = () => {
            this.setState({ isAdding: true });
        };
        this.onSaveName = (name) => {
            const accountNameError = validateAccountName(name, this.props.accountId ?? '', this.props.accounts);
            if (accountNameError) {
                this.setState({ nameError: accountNameError });
            }
            else {
                const account = this.props.accounts.find(account => account.id === this.props.accountId);
                if (!account) {
                    throw new Error(`Account with ID ${this.props.accountId} not found.`);
                }
                this.props.dispatch(updateAccount({ account: { ...account, name } }));
                this.setState({ nameError: '' });
            }
        };
        this.onToggleExtraBalances = () => {
            this.props.setShowExtraBalances(!this.props.showExtraBalances);
        };
        this.onMenuSelect = async (item) => {
            const accountId = this.props.accountId;
            const account = this.props.accounts.find(account => account.id === accountId);
            switch (item) {
                case 'link':
                    this.props.dispatch(pushModal({
                        modal: {
                            name: 'add-account',
                            options: {
                                upgradingAccountId: accountId,
                            },
                        },
                    }));
                    break;
                case 'unlink':
                    this.props.dispatch(pushModal({
                        modal: {
                            name: 'confirm-unlink-account',
                            options: {
                                accountName: account.name,
                                isViewBankSyncSettings: false,
                                onUnlink: () => {
                                    this.props.dispatch(unlinkAccount({ id: accountId }));
                                },
                            },
                        },
                    }));
                    break;
                case 'close':
                    this.props.dispatch(openAccountCloseModal({ accountId }));
                    break;
                case 'reopen':
                    this.props.dispatch(reopenAccount({ id: accountId }));
                    break;
                case 'export':
                    const accountName = this.getAccountTitle(account, accountId);
                    this.onExport(accountName);
                    break;
                case 'toggle-balance':
                    if (this.state.showBalances) {
                        this.props.setShowBalances(false);
                        this.setState({ showBalances: false, balances: null });
                    }
                    else {
                        this.props.setShowBalances(true);
                        this.setState({
                            transactions: [],
                            transactionCount: 0,
                            filterConditions: [],
                            search: '',
                            sort: null,
                            showBalances: true,
                        }, () => {
                            this.fetchTransactions();
                        });
                    }
                    break;
                case 'remove-sorting': {
                    this.setState({ sort: null }, () => {
                        const filterConditions = this.state.filterConditions;
                        if (filterConditions.length > 0) {
                            this.applyFilters([...filterConditions]);
                        }
                        else {
                            this.fetchTransactions();
                        }
                        if (this.state.search !== '') {
                            this.onSearch(this.state.search);
                        }
                    });
                    break;
                }
                case 'toggle-cleared':
                    if (this.state.showCleared) {
                        this.props.setShowCleared(false);
                        this.setState({ showCleared: false });
                    }
                    else {
                        this.props.setShowCleared(true);
                        this.setState({ showCleared: true });
                    }
                    break;
                case 'toggle-reconciled':
                    if (this.state.showReconciled) {
                        this.props.setShowReconciled(false);
                        this.setState({ showReconciled: false }, () => this.fetchTransactions(this.state.filterConditions));
                    }
                    else {
                        this.props.setShowReconciled(true);
                        this.setState({ showReconciled: true }, () => this.fetchTransactions(this.state.filterConditions));
                    }
                    break;
                case 'toggle-net-worth-chart':
                    if (this.props.showNetWorthChart) {
                        this.props.setShowNetWorthChart(false);
                    }
                    else {
                        this.props.setShowNetWorthChart(true);
                    }
                    break;
                default:
            }
        };
        this.getFilteredAmount = async () => {
            if (!this.paged) {
                return 0;
            }
            const { data: amount } = await aqlQuery(this.paged.query.calculate({ $sum: '$amount' }));
            return amount;
        };
        this.isNew = (id) => {
            return this.props.newTransactions.includes(id);
        };
        this.isMatched = (id) => {
            return this.props.matchedTransactions.includes(id);
        };
        this.onCreatePayee = async (name) => {
            const trimmed = name.trim();
            if (trimmed !== '') {
                return this.props.dispatch(createPayee({ name })).unwrap();
            }
            return null;
        };
        this.lockTransactions = async () => {
            this.setState({ workingHard: true });
            const { accountId } = this.props;
            const { data } = await aqlQuery(q('transactions')
                .filter({ cleared: true, reconciled: false, account: accountId })
                .select('*')
                .options({ splits: 'grouped' }));
            let transactions = ungroupTransactions(data);
            const changes = {
                updated: [],
            };
            transactions.forEach(trans => {
                const { diff } = updateTransaction(transactions, {
                    ...trans,
                    reconciled: true,
                });
                transactions = applyChanges(diff, transactions);
                changes.updated = changes.updated
                    ? changes.updated.concat(diff.updated)
                    : diff.updated;
            });
            await send('transactions-batch-update', changes);
            await this.refetchTransactions();
        };
        this.onReconcile = async (amount) => {
            this.setState(({ showCleared }) => ({
                reconcileAmount: amount,
                showCleared: true,
                prevShowCleared: showCleared,
            }));
        };
        this.onDoneReconciling = async () => {
            const { accountId } = this.props;
            const account = this.props.accounts.find(account => account.id === accountId);
            if (!account) {
                throw new Error(`Account with ID ${accountId} not found.`);
            }
            const { reconcileAmount } = this.state;
            const { data } = await aqlQuery(q('transactions')
                .filter({ cleared: true, account: accountId })
                .select('*')
                .options({ splits: 'grouped' }));
            const transactions = ungroupTransactions(data);
            let cleared = 0;
            transactions.forEach(trans => {
                if (!trans.is_parent) {
                    cleared += trans.amount;
                }
            });
            const targetDiff = (reconcileAmount || 0) - cleared;
            if (targetDiff === 0) {
                await this.lockTransactions();
            }
            const lastReconciled = new Date().getTime().toString();
            this.props.dispatch(updateAccount({
                account: { ...account, last_reconciled: lastReconciled },
            }));
            this.setState({
                reconcileAmount: null,
                showCleared: this.state.prevShowCleared,
            });
        };
        this.onCreateReconciliationTransaction = async (diff) => {
            // Create a new reconciliation transaction
            const reconciliationTransactions = realizeTempTransactions([
                {
                    id: 'temp',
                    account: this.props.accountId,
                    cleared: true,
                    reconciled: false,
                    amount: diff,
                    date: currentDay(),
                    notes: t('Reconciliation balance adjustment'),
                },
            ]);
            // Optimistic UI: update the transaction list before sending the data to the database
            this.setState({
                transactions: [...reconciliationTransactions, ...this.state.transactions],
            });
            // run rules on the reconciliation transaction
            const ruledTransactions = await Promise.all(reconciliationTransactions.map(transaction => send('rules-run', { transaction })));
            // sync the reconciliation transaction
            await send('transactions-batch-update', {
                added: ruledTransactions.filter(trans => !trans.tombstone),
                deleted: ruledTransactions.filter(trans => trans.tombstone),
            });
            await this.refetchTransactions();
        };
        this.onShowTransactions = async (ids) => {
            this.onApplyFilter({
                customName: t('Selected transactions'),
                queryFilter: { id: { $oneof: ids } },
            });
        };
        this.onBatchEdit = (name, ids) => {
            this.props.onBatchEdit({
                name,
                ids,
                onSuccess: updatedIds => {
                    this.refetchTransactions();
                    if (this.table.current) {
                        this.table.current.edit(updatedIds[0], 'select', false);
                    }
                },
            });
        };
        this.onBatchDuplicate = (ids) => {
            this.props.onBatchDuplicate({ ids, onSuccess: this.refetchTransactions });
        };
        this.onBatchDelete = (ids) => {
            this.props.onBatchDelete({ ids, onSuccess: this.refetchTransactions });
        };
        this.onMakeAsSplitTransaction = async (ids) => {
            this.setState({ workingHard: true });
            const { data } = await aqlQuery(q('transactions')
                .filter({ id: { $oneof: ids } })
                .select('*')
                .options({ splits: 'none' }));
            const transactions = data;
            if (!transactions || transactions.length === 0) {
                return;
            }
            const [firstTransaction] = transactions;
            const parentTransaction = {
                id: uuidv4(),
                is_parent: true,
                cleared: transactions.every(t => !!t.cleared),
                date: firstTransaction.date,
                account: firstTransaction.account,
                amount: transactions
                    .map(t => t.amount)
                    .reduce((total, amount) => total + amount, 0),
            };
            const childTransactions = transactions.map(t => makeChild(parentTransaction, t));
            await send('transactions-batch-update', {
                added: [parentTransaction],
                updated: childTransactions,
            });
            this.refetchTransactions();
        };
        this.onMakeAsNonSplitTransactions = async (ids) => {
            this.setState({ workingHard: true });
            const { data } = await aqlQuery(q('transactions')
                .filter({ id: { $oneof: ids } })
                .select('*')
                .options({ splits: 'grouped' }));
            const groupedTransactions = data;
            let changes = {
                updated: [],
                deleted: [],
            };
            const groupedTransactionsToUpdate = groupedTransactions.filter(t => t.is_parent);
            for (const groupedTransaction of groupedTransactionsToUpdate) {
                const transactions = ungroupTransaction(groupedTransaction);
                const [parentTransaction, ...childTransactions] = transactions;
                if (ids.includes(parentTransaction.id)) {
                    // Unsplit all child transactions.
                    const diff = makeAsNonChildTransactions(childTransactions, transactions);
                    changes = {
                        updated: [...changes.updated, ...diff.updated],
                        deleted: [...changes.deleted, ...diff.deleted],
                    };
                    // Already processed the child transactions above, no need to process them below.
                    continue;
                }
                // Unsplit selected child transactions.
                const selectedChildTransactions = childTransactions.filter(t => ids.includes(t.id));
                if (selectedChildTransactions.length === 0) {
                    continue;
                }
                const diff = makeAsNonChildTransactions(selectedChildTransactions, transactions);
                changes = {
                    updated: [...changes.updated, ...diff.updated],
                    deleted: [...changes.deleted, ...diff.deleted],
                };
            }
            await send('transactions-batch-update', changes);
            this.refetchTransactions();
            const transactionsToSelect = changes.updated.map(t => t.id);
            this.dispatchSelected?.({
                type: 'select-all',
                ids: transactionsToSelect,
            });
        };
        this.onMergeTransactions = async (ids) => {
            const keptId = await send('transactions-merge', ids.map(id => ({ id })));
            await this.refetchTransactions();
            this.dispatchSelected?.({
                type: 'select-all',
                ids: [keptId],
            });
        };
        this.checkForReconciledTransactions = async (ids, confirmReason, onConfirm) => {
            const { data } = await aqlQuery(q('transactions')
                .filter({ id: { $oneof: ids }, reconciled: true })
                .select('*')
                .options({ splits: 'grouped' }));
            const transactions = ungroupTransactions(data);
            if (transactions.length > 0) {
                this.props.dispatch(pushModal({
                    modal: {
                        name: 'confirm-transaction-edit',
                        options: {
                            onConfirm: () => {
                                onConfirm(ids);
                            },
                            confirmReason,
                        },
                    },
                }));
            }
            else {
                onConfirm(ids);
            }
        };
        this.onBatchLinkSchedule = (ids) => {
            this.props.onBatchLinkSchedule({
                ids,
                account: this.props.accounts.find(a => a.id === this.props.accountId),
                onSuccess: this.refetchTransactions,
            });
        };
        this.onBatchUnlinkSchedule = (ids) => {
            this.props.onBatchUnlinkSchedule({
                ids,
                onSuccess: this.refetchTransactions,
            });
        };
        this.onCreateRule = async (ids) => {
            const { data } = await aqlQuery(q('transactions')
                .filter({ id: { $oneof: ids } })
                .select('*')
                .options({ splits: 'grouped' }));
            const transactions = ungroupTransactions(data);
            const ruleTransaction = transactions[0];
            const childTransactions = transactions.filter(t => t.parent_id === ruleTransaction.id);
            const payeeCondition = ruleTransaction.imported_payee
                ? {
                    field: 'imported_payee',
                    op: 'is',
                    value: ruleTransaction.imported_payee,
                    type: 'string',
                }
                : {
                    field: 'payee',
                    op: 'is',
                    value: ruleTransaction.payee,
                    type: 'id',
                };
            const amountCondition = {
                field: 'amount',
                op: 'isapprox',
                value: ruleTransaction.amount,
                type: 'number',
            };
            const rule = {
                stage: null,
                conditionsOp: 'and',
                conditions: [payeeCondition, amountCondition],
                actions: [
                    ...(childTransactions.length === 0
                        ? [
                            {
                                op: 'set',
                                field: 'category',
                                value: ruleTransaction.category,
                                type: 'id',
                                options: {
                                    splitIndex: 0,
                                },
                            },
                        ]
                        : []),
                    ...childTransactions.flatMap((sub, index) => [
                        {
                            op: 'set-split-amount',
                            value: sub.amount,
                            options: {
                                splitIndex: index + 1,
                                method: 'fixed-amount',
                            },
                        },
                        {
                            op: 'set',
                            field: 'category',
                            value: sub.category,
                            type: 'id',
                            options: {
                                splitIndex: index + 1,
                            },
                        },
                    ]),
                ],
            };
            this.props.dispatch(pushModal({ modal: { name: 'edit-rule', options: { rule } } }));
        };
        this.onSetTransfer = async (ids) => {
            this.setState({ workingHard: true });
            await this.props.onSetTransfer(ids, this.props.payees, this.refetchTransactions);
        };
        this.onConditionsOpChange = (value) => {
            this.setState({ filterConditionsOp: value });
            this.setState({
                filterId: { ...this.state.filterId, status: 'changed' },
            });
            this.applyFilters([...this.state.filterConditions]);
            if (this.state.search !== '') {
                this.onSearch(this.state.search);
            }
        };
        this.onReloadSavedFilter = (savedFilter, item) => {
            if (item === 'reload') {
                const [savedFilter] = this.props.savedFilters.filter(f => f.id === this.state.filterId?.id);
                this.setState({ filterConditionsOp: savedFilter.conditionsOp ?? 'and' });
                this.applyFilters([...savedFilter.conditions]);
            }
            else {
                if (savedFilter.status) {
                    this.setState({
                        filterConditionsOp: savedFilter.conditionsOp ?? 'and',
                    });
                    this.applyFilters([...(savedFilter.conditions ?? [])]);
                }
            }
            this.setState({ filterId: { ...this.state.filterId, ...savedFilter } });
        };
        this.onClearFilters = () => {
            this.setState({ filterConditionsOp: 'and' });
            this.setState({ filterId: undefined });
            this.applyFilters([]);
            if (this.state.search !== '') {
                this.onSearch(this.state.search);
            }
        };
        this.onUpdateFilter = (oldCondition, updatedCondition) => {
            this.applyFilters(this.state.filterConditions.map(c => c === oldCondition ? updatedCondition : c));
            this.setState({
                filterId: {
                    ...this.state.filterId,
                    status: this.state.filterId && 'changed',
                },
            });
            if (this.state.search !== '') {
                this.onSearch(this.state.search);
            }
        };
        this.onDeleteFilter = (condition) => {
            this.applyFilters(this.state.filterConditions.filter(c => c !== condition));
            if (this.state.filterConditions.length === 1) {
                this.setState({ filterId: undefined });
                this.setState({ filterConditionsOp: 'and' });
            }
            else {
                this.setState({
                    filterId: {
                        ...this.state.filterId,
                        status: this.state.filterId && 'changed',
                    },
                });
            }
            if (this.state.search !== '') {
                this.onSearch(this.state.search);
            }
        };
        this.onApplyFilter = async (conditionOrSavedFilter) => {
            let filterConditions = this.state.filterConditions;
            if ('customName' in conditionOrSavedFilter &&
                conditionOrSavedFilter.customName) {
                filterConditions = filterConditions.filter(c => !isTransactionFilterEntity(c) &&
                    c.customName !== conditionOrSavedFilter.customName);
            }
            if (isTransactionFilterEntity(conditionOrSavedFilter)) {
                // A saved filter was passed in.
                const savedFilter = conditionOrSavedFilter;
                this.setState({
                    filterId: { ...savedFilter, status: 'saved' },
                });
                this.setState({ filterConditionsOp: savedFilter.conditionsOp });
                this.applyFilters([...savedFilter.conditions]);
            }
            else {
                // A condition was passed in.
                const condition = conditionOrSavedFilter;
                this.setState({
                    filterId: {
                        ...this.state.filterId,
                        status: this.state.filterId && 'changed',
                    },
                });
                this.applyFilters([...filterConditions, condition]);
            }
            if (this.state.search !== '') {
                this.onSearch(this.state.search);
            }
        };
        this.onScheduleAction = async (name, ids) => {
            const scheduleIds = ids.map(id => id.split('/')[1]);
            switch (name) {
                case 'post-transaction':
                    for (const id of scheduleIds) {
                        await send('schedule/post-transaction', { id });
                    }
                    this.refetchTransactions();
                    break;
                case 'post-transaction-today':
                    for (const id of scheduleIds) {
                        await send('schedule/post-transaction', { id, today: true });
                    }
                    this.refetchTransactions();
                    break;
                case 'skip':
                    for (const id of scheduleIds) {
                        await send('schedule/skip-next-date', { id });
                    }
                    break;
                case 'complete':
                    for (const id of scheduleIds) {
                        await send('schedule/update', { schedule: { id, completed: true } });
                    }
                    break;
                default:
            }
        };
        this.applyFilters = async (conditions) => {
            if (conditions.length > 0) {
                const filteredCustomQueryFilters = conditions.filter(cond => !isTransactionFilterEntity(cond));
                const customQueryFilters = filteredCustomQueryFilters.map(f => f.queryFilter);
                const { filters: queryFilters } = await send('make-filters-from-conditions', {
                    conditions: conditions.filter(cond => isTransactionFilterEntity(cond) || !cond.customName),
                });
                const conditionsOpKey = this.state.filterConditionsOp === 'or' ? '$or' : '$and';
                this.currentQuery = this.rootQuery.filter({
                    [conditionsOpKey]: [...queryFilters, ...customQueryFilters],
                });
                this.setState({
                    filterConditions: conditions,
                }, () => {
                    this.updateQuery(this.currentQuery, true);
                });
            }
            else {
                this.setState({
                    transactions: [],
                    transactionCount: 0,
                    filterConditions: conditions,
                }, () => {
                    this.fetchTransactions();
                });
            }
            if (this.state.sort !== null) {
                this.applySort();
            }
        };
        this.applySort = (field, ascDesc, prevField, prevAscDesc) => {
            const filterConditions = this.state.filterConditions;
            const isFiltered = filterConditions.length > 0;
            const sortField = getField(!field ? this.state.sort?.field : field);
            const sortAscDesc = !ascDesc ? this.state.sort?.ascDesc : ascDesc;
            const sortPrevField = getField(!prevField ? this.state.sort?.prevField : prevField);
            const sortPrevAscDesc = !prevField
                ? this.state.sort?.prevAscDesc
                : prevAscDesc;
            const sortCurrentQuery = function (that, sortField, sortAscDesc) {
                if (sortField === 'cleared') {
                    that.currentQuery = that.currentQuery.orderBy({
                        reconciled: sortAscDesc,
                    });
                }
                that.currentQuery = that.currentQuery.orderBy({
                    [sortField]: sortAscDesc,
                });
            };
            const sortRootQuery = function (that, sortField, sortAscDesc) {
                if (sortField === 'cleared') {
                    that.currentQuery = that.rootQuery.orderBy({
                        reconciled: sortAscDesc,
                    });
                    that.currentQuery = that.currentQuery.orderBy({
                        cleared: sortAscDesc,
                    });
                }
                else {
                    that.currentQuery = that.rootQuery.orderBy({
                        [sortField]: sortAscDesc,
                    });
                }
            };
            // sort by previously used sort field, if any
            const maybeSortByPreviousField = function (that, sortPrevField, sortPrevAscDesc) {
                if (!sortPrevField) {
                    return;
                }
                if (sortPrevField === 'cleared') {
                    that.currentQuery = that.currentQuery.orderBy({
                        reconciled: sortPrevAscDesc,
                    });
                }
                that.currentQuery = that.currentQuery.orderBy({
                    [sortPrevField]: sortPrevAscDesc,
                });
            };
            switch (true) {
                // called by applyFilters to sort an already filtered result
                case !field:
                    sortCurrentQuery(this, sortField, sortAscDesc);
                    break;
                // called directly from UI by sorting a column.
                // active filters need to be applied before sorting
                case isFiltered:
                    this.applyFilters([...filterConditions]);
                    sortCurrentQuery(this, sortField, sortAscDesc);
                    break;
                // called directly from UI by sorting a column.
                // no active filters, start a new root query.
                case !isFiltered:
                    sortRootQuery(this, sortField, sortAscDesc);
                    break;
                default:
            }
            maybeSortByPreviousField(this, sortPrevField, sortPrevAscDesc);
            this.updateQuery(this.currentQuery, isFiltered);
        };
        this.onSort = (headerClicked, ascDesc) => {
            let prevField;
            let prevAscDesc;
            //if staying on same column but switching asc/desc
            //then keep prev the same
            if (headerClicked === this.state.sort?.field) {
                prevField = this.state.sort.prevField;
                prevAscDesc = this.state.sort.prevAscDesc;
                this.setState({
                    sort: {
                        ...this.state.sort,
                        ascDesc,
                    },
                });
            }
            else {
                //if switching to new column then capture state
                //of current sort column as prev
                prevField = this.state.sort?.field;
                prevAscDesc = this.state.sort?.ascDesc;
                this.setState({
                    sort: {
                        field: headerClicked,
                        ascDesc,
                        prevField: this.state.sort?.field,
                        prevAscDesc: this.state.sort?.ascDesc,
                    },
                });
            }
            this.applySort(headerClicked, ascDesc, prevField, prevAscDesc);
            if (this.state.search !== '') {
                this.onSearch(this.state.search);
            }
        };
        this.paged = null;
        this.table = createRef();
        this.state = {
            search: '',
            filterConditions: props.filterConditions || [],
            filterId: undefined,
            filterConditionsOp: 'and',
            loading: true,
            workingHard: false,
            reconcileAmount: null,
            transactions: [],
            transactionCount: 0,
            showBalances: props.showBalances,
            balances: null,
            showCleared: props.showCleared,
            showReconciled: props.showReconciled,
            nameError: '',
            isAdding: false,
            sort: null,
            filteredAmount: null,
        };
    }
    async componentDidMount() {
        const maybeRefetch = (tables) => {
            if (tables.includes('transactions') ||
                tables.includes('category_mapping') ||
                tables.includes('payee_mapping')) {
                return this.refetchTransactions();
            }
        };
        const onUndo = async ({ tables, messages }) => {
            await maybeRefetch(tables);
            // If all the messages are dealing with transactions, find the
            // first message referencing a non-deleted row so that we can
            // highlight the row
            //
            let focusId = null;
            if (messages.every(msg => msg.dataset === 'transactions') &&
                !messages.find(msg => msg.column === 'tombstone')) {
                const focusableMsgs = messages.filter(msg => msg.dataset === 'transactions' && !(msg.column === 'tombstone'));
                focusId = focusableMsgs.length === 1 ? focusableMsgs[0].row : null;
                // Highlight the transactions
                // this.table && this.table.highlight(focusableMsgs.map(msg => msg.row));
            }
            if (this.table.current) {
                this.table.current.edit(null);
                // Focus a transaction if applicable. There is a chance if the
                // user navigated away that focusId is a transaction that has
                // been "paged off" and we won't focus it. That's ok, we just
                // do our best.
                if (focusId) {
                    this.table.current.scrollTo(focusId);
                }
            }
            undo.setUndoState('undoEvent', null);
        };
        const unlistens = [listen('undo-event', onUndo)];
        this.unlisten = () => {
            unlistens.forEach(unlisten => unlisten());
        };
        // Important that any async work happens last so that the
        // listeners are set up synchronously
        await this.props.dispatch(getPayees());
        await this.fetchTransactions(this.state.filterConditions);
        // If there is a pending undo, apply it immediately (this happens
        // when an undo changes the location to this page)
        const lastUndoEvent = undo.getUndoState('undoEvent');
        if (lastUndoEvent) {
            onUndo(lastUndoEvent);
        }
    }
    componentDidUpdate(prevProps) {
        // If the active account changes - close the transaction entry mode
        if (this.state.isAdding && this.props.accountId !== prevProps.accountId) {
            this.setState({ isAdding: false });
        }
        // If the user was on a different screen and is now coming back to
        // the transactions, automatically refresh the transaction to make
        // sure we have updated state
        if (prevProps.modalShowing && !this.props.modalShowing) {
            // This is clearly a hack. Need a better way to track which
            // things are listening to transactions and refetch
            // automatically (use ActualQL?)
            setTimeout(() => {
                this.refetchTransactions();
            }, 100);
        }
        //Resest sort/filter/search on account change
        if (this.props.accountId !== prevProps.accountId) {
            this.setState({ sort: null, search: '', filterConditions: [] });
        }
    }
    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
        }
        if (this.paged) {
            this.paged.unsubscribe();
        }
    }
    updateQuery(query, isFiltered = false) {
        if (this.paged) {
            this.paged.unsubscribe();
        }
        // Filter out reconciled transactions if they are hidden
        // and we're not showing balances.
        if (!this.state.showReconciled &&
            (!this.state.showBalances || !this.canCalculateBalance())) {
            query = query.filter({ reconciled: { $eq: false } });
        }
        this.paged = pagedQuery(query.select('*'), {
            onData: async (groupedData, prevData) => {
                const data = ungroupTransactions([...groupedData]);
                const firstLoad = prevData == null;
                if (firstLoad) {
                    this.table.current?.setRowAnimation(false);
                    if (isFiltered) {
                        this.props.splitsExpandedDispatch({
                            type: 'set-mode',
                            mode: 'collapse',
                        });
                    }
                    else {
                        this.props.splitsExpandedDispatch({
                            type: 'set-mode',
                            mode: this.props.expandSplits ? 'expand' : 'collapse',
                        });
                    }
                }
                this.setState({
                    transactions: data,
                    transactionCount: this.paged?.totalCount ?? 0,
                    transactionsFiltered: isFiltered,
                    loading: false,
                    workingHard: false,
                    balances: this.state.showBalances
                        ? await this.calculateBalances()
                        : null,
                    filteredAmount: await this.getFilteredAmount(),
                }, () => {
                    if (firstLoad) {
                        this.table.current?.scrollToTop();
                    }
                    setTimeout(() => {
                        this.table.current?.setRowAnimation(true);
                    }, 0);
                });
            },
            options: {
                pageCount: 150,
                onlySync: true,
            },
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.accountId !== nextProps.accountId) {
            this.setState({
                loading: true,
                search: '',
                showBalances: nextProps.showBalances,
                balances: null,
                showCleared: nextProps.showCleared,
                showReconciled: nextProps.showReconciled,
                reconcileAmount: null,
            }, () => {
                this.fetchTransactions();
            });
        }
    }
    async calculateBalances() {
        if (!this.canCalculateBalance() || !this.paged) {
            return null;
        }
        const { data } = await aqlQuery(this.paged.query
            .options({ splits: 'none' })
            .select([{ balance: { $sumOver: '$amount' } }]));
        return data.reduce((balances, row) => {
            balances[row.id] = row.balance;
            return balances;
        }, {});
    }
    getAccountTitle(account, id) {
        const { filterName } = this.props.location.state || {};
        if (filterName) {
            return filterName;
        }
        if (!account) {
            if (id === 'onbudget') {
                return t('On Budget Accounts');
            }
            else if (id === 'offbudget') {
                return t('Off Budget Accounts');
            }
            else if (id === 'uncategorized') {
                return t('Uncategorized');
            }
            else if (!id) {
                return t('All Accounts');
            }
            return null;
        }
        return account.name;
    }
    getBalanceQuery(id) {
        return {
            name: `balance-query-${id}`,
            query: this.makeRootTransactionsQuery().calculate({ $sum: '$amount' }),
        };
    }
    render() {
        const { accounts, categoryGroups, payees, dateFormat, hideFraction, accountsSyncing, failedAccounts, showExtraBalances, accountId, categoryId, } = this.props;
        const { transactions, loading, workingHard, filterId, reconcileAmount, transactionsFiltered, showBalances, balances, showCleared, showReconciled, filteredAmount, } = this.state;
        const account = accounts.find(account => account.id === accountId);
        const accountName = this.getAccountTitle(account, accountId);
        if (!accountName && !loading) {
            // This is probably an account that was deleted, so redirect to
            // all accounts
            return _jsx(Navigate, { to: "/accounts", replace: true });
        }
        const category = categoryGroups
            .flatMap(g => g.categories)
            .find(category => category?.id === categoryId);
        const showEmptyMessage = !loading && !accountId && accounts.length === 0;
        const isNameEditable = accountId
            ? accountId !== 'onbudget' &&
                accountId !== 'offbudget' &&
                accountId !== 'uncategorized'
            : false;
        const balanceQuery = this.getBalanceQuery(accountId);
        const selectAllFilter = (item) => {
            if (item.is_parent) {
                const children = transactions.filter(t => t.parent_id === item.id);
                return children.every(t => selectAllFilter(t));
            }
            return !item._unmatched;
        };
        return (_jsx(AllTransactions, { account: account, transactions: transactions, balances: balances, showBalances: showBalances, filtered: transactionsFiltered, children: (allTransactions, allBalances) => (_jsx(SelectedProviderWithItems, { name: "transactions", items: allTransactions, fetchAllIds: this.fetchAllIds, registerDispatch: dispatch => (this.dispatchSelected = dispatch), selectAllFilter: selectAllFilter, children: _jsxs(View, { style: styles.page, children: [_jsx(AccountHeader, { tableRef: this.table, isNameEditable: isNameEditable ?? false, workingHard: workingHard ?? false, accountId: accountId, account: account, filterId: filterId, savedFilters: this.props.savedFilters, accountName: accountName, accountsSyncing: accountsSyncing, failedAccounts: failedAccounts, accounts: accounts, transactions: transactions, showBalances: showBalances ?? false, showExtraBalances: showExtraBalances ?? false, showCleared: showCleared ?? false, showReconciled: showReconciled ?? false, showEmptyMessage: showEmptyMessage ?? false, balanceQuery: balanceQuery, canCalculateBalance: this?.canCalculateBalance ?? undefined, filteredAmount: filteredAmount, isFiltered: transactionsFiltered ?? false, isSorted: this.state.sort !== null, reconcileAmount: reconcileAmount, search: this.state.search, 
                            // @ts-expect-error fix me
                            filterConditions: this.state.filterConditions, filterConditionsOp: this.state.filterConditionsOp, onSearch: this.onSearch, onShowTransactions: this.onShowTransactions, onMenuSelect: this.onMenuSelect, onAddTransaction: this.onAddTransaction, onToggleExtraBalances: this.onToggleExtraBalances, onSaveName: this.onSaveName, saveNameError: this.state.nameError, onReconcile: this.onReconcile, onDoneReconciling: this.onDoneReconciling, onCreateReconciliationTransaction: this.onCreateReconciliationTransaction, onSync: this.onSync, onImport: this.onImport, onBatchDelete: this.onBatchDelete, onBatchDuplicate: this.onBatchDuplicate, onRunRules: this.onRunRules, onBatchEdit: this.onBatchEdit, onBatchLinkSchedule: this.onBatchLinkSchedule, onBatchUnlinkSchedule: this.onBatchUnlinkSchedule, onCreateRule: this.onCreateRule, onUpdateFilter: this.onUpdateFilter, onClearFilters: this.onClearFilters, onReloadSavedFilter: this.onReloadSavedFilter, onConditionsOpChange: this.onConditionsOpChange, onDeleteFilter: this.onDeleteFilter, onApplyFilter: this.onApplyFilter, onScheduleAction: this.onScheduleAction, onSetTransfer: this.onSetTransfer, onMakeAsSplitTransaction: this.onMakeAsSplitTransaction, onMakeAsNonSplitTransactions: this.onMakeAsNonSplitTransactions, onMergeTransactions: this.onMergeTransactions }), _jsx(View, { style: { flex: 1 }, children: _jsx(TransactionList, { headerContent: undefined, 
                                // @ts-ignore TODO
                                tableRef: this.table, account: account, transactions: transactions, allTransactions: allTransactions, loadMoreTransactions: () => this.paged && this.paged.fetchNext(), accounts: accounts, category: category, categoryGroups: categoryGroups, payees: payees, balances: allBalances, showBalances: !!allBalances, showReconciled: showReconciled, showCleared: !!showCleared, showAccount: !accountId ||
                                    accountId === 'offbudget' ||
                                    accountId === 'onbudget' ||
                                    accountId === 'uncategorized', isAdding: this.state.isAdding, isNew: this.isNew, isMatched: this.isMatched, isFiltered: transactionsFiltered, dateFormat: dateFormat, hideFraction: hideFraction, renderEmpty: () => showEmptyMessage ? (_jsx(AccountEmptyMessage, { onAdd: () => this.props.dispatch(replaceModal({
                                        modal: { name: 'add-account', options: {} },
                                    })) })) : !loading ? (_jsx(View, { style: {
                                        color: theme.tableText,
                                        marginTop: 20,
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                    }, children: _jsx(Trans, { children: "No transactions" }) })) : null, onSort: this.onSort, sortField: this.state.sort?.field ?? '', ascDesc: this.state.sort?.ascDesc ?? 'asc', onChange: this.onTransactionsChange, onBatchDelete: this.onBatchDelete, onBatchDuplicate: this.onBatchDuplicate, onBatchLinkSchedule: this.onBatchLinkSchedule, onBatchUnlinkSchedule: this.onBatchUnlinkSchedule, onCreateRule: this.onCreateRule, onScheduleAction: this.onScheduleAction, onMakeAsNonSplitTransactions: this.onMakeAsNonSplitTransactions, onRefetch: this.refetchTransactions, onCloseAddTransaction: () => this.setState({ isAdding: false }), onCreatePayee: this.onCreatePayee, onApplyFilter: this.onApplyFilter }) })] }) })) }));
    }
}
function AccountHack(props) {
    const { dispatch: splitsExpandedDispatch } = useSplitsExpanded();
    const dispatch = useDispatch();
    const { onBatchEdit, onBatchDuplicate, onBatchLinkSchedule, onBatchUnlinkSchedule, onBatchDelete, onSetTransfer, } = useTransactionBatchActions();
    return (_jsx(AccountInternal, { dispatch: dispatch, splitsExpandedDispatch: splitsExpandedDispatch, onBatchEdit: onBatchEdit, onBatchDuplicate: onBatchDuplicate, onBatchLinkSchedule: onBatchLinkSchedule, onBatchUnlinkSchedule: onBatchUnlinkSchedule, onBatchDelete: onBatchDelete, onSetTransfer: onSetTransfer, ...props }));
}
export function Account() {
    const params = useParams();
    const location = useLocation();
    const { grouped: categoryGroups } = useCategories();
    const newTransactions = useSelector(state => state.transactions.newTransactions);
    const matchedTransactions = useSelector(state => state.transactions.matchedTransactions);
    const accounts = useAccounts();
    const payees = usePayees();
    const failedAccounts = useFailedAccounts();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const [hideFraction] = useSyncedPref('hideFraction');
    const [expandSplits] = useLocalPref('expand-splits');
    const [showBalances, setShowBalances] = useSyncedPref(`show-balances-${params.id}`);
    const [showNetWorthChart, setShowNetWorthChart] = useSyncedPref(`show-account-${params.id}-net-worth-chart`);
    const [hideCleared, setHideCleared] = useSyncedPref(`hide-cleared-${params.id}`);
    const [hideReconciled, setHideReconciled] = useSyncedPref(`hide-reconciled-${params.id}`);
    const [showExtraBalances, setShowExtraBalances] = useSyncedPref(`show-extra-balances-${params.id || 'all-accounts'}`);
    const modalShowing = useSelector(state => state.modals.modalStack.length > 0);
    const accountsSyncing = useSelector(state => state.account.accountsSyncing);
    const filterConditions = location?.state?.filterConditions || [];
    const savedFiters = useTransactionFilters();
    const schedulesQuery = useMemo(() => getSchedulesQuery(params.id), [params.id]);
    return (_jsx(SchedulesProvider, { query: schedulesQuery, children: _jsx(SplitsExpandedProvider, { initialMode: expandSplits ? 'collapse' : 'expand', children: _jsx(AccountHack, { newTransactions: newTransactions, matchedTransactions: matchedTransactions, accounts: accounts, failedAccounts: failedAccounts, dateFormat: dateFormat, hideFraction: String(hideFraction) === 'true', expandSplits: expandSplits, showBalances: String(showBalances) === 'true', setShowBalances: showBalances => setShowBalances(String(showBalances)), showNetWorthChart: String(showNetWorthChart) === 'true', setShowNetWorthChart: val => setShowNetWorthChart(String(val)), showCleared: String(hideCleared) !== 'true', setShowCleared: val => setHideCleared(String(!val)), showReconciled: String(hideReconciled) !== 'true', setShowReconciled: val => setHideReconciled(String(!val)), showExtraBalances: String(showExtraBalances) === 'true', setShowExtraBalances: extraBalances => setShowExtraBalances(String(extraBalances)), payees: payees, modalShowing: modalShowing, accountsSyncing: accountsSyncing, filterConditions: filterConditions, categoryGroups: categoryGroups, accountId: params.id, categoryId: location?.state?.categoryId, location: location, savedFilters: savedFiters }) }) }));
}
