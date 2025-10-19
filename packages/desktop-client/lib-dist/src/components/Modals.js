import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { EditSyncAccount } from './banksync/EditSyncAccount';
import { AccountAutocompleteModal } from './modals/AccountAutocompleteModal';
import { AccountMenuModal } from './modals/AccountMenuModal';
import { BudgetAutomationsModal } from './modals/BudgetAutomationsModal';
import { BudgetFileSelectionModal } from './modals/BudgetFileSelectionModal';
import { BudgetPageMenuModal } from './modals/BudgetPageMenuModal';
import { CategoryAutocompleteModal } from './modals/CategoryAutocompleteModal';
import { CategoryGroupMenuModal } from './modals/CategoryGroupMenuModal';
import { CategoryMenuModal } from './modals/CategoryMenuModal';
import { CloseAccountModal } from './modals/CloseAccountModal';
import { ConfirmCategoryDeleteModal } from './modals/ConfirmCategoryDeleteModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import { ConfirmTransactionEditModal } from './modals/ConfirmTransactionEditModal';
import { ConfirmUnlinkAccountModal } from './modals/ConfirmUnlinkAccountModal';
import { CoverModal } from './modals/CoverModal';
import { CreateAccountModal } from './modals/CreateAccountModal';
import { CreateEncryptionKeyModal } from './modals/CreateEncryptionKeyModal';
import { CreateLocalAccountModal } from './modals/CreateLocalAccountModal';
import { EditUserAccess } from './modals/EditAccess';
import { EditFieldModal } from './modals/EditFieldModal';
import { EditRuleModal } from './modals/EditRuleModal';
import { EditUserFinanceApp } from './modals/EditUser';
import { EnvelopeBalanceMenuModal } from './modals/EnvelopeBalanceMenuModal';
import { EnvelopeBudgetMenuModal } from './modals/EnvelopeBudgetMenuModal';
import { EnvelopeBudgetMonthMenuModal } from './modals/EnvelopeBudgetMonthMenuModal';
import { EnvelopeBudgetSummaryModal } from './modals/EnvelopeBudgetSummaryModal';
import { EnvelopeIncomeBalanceMenuModal } from './modals/EnvelopeIncomeBalanceMenuModal';
import { EnvelopeToBudgetMenuModal } from './modals/EnvelopeToBudgetMenuModal';
import { FixEncryptionKeyModal } from './modals/FixEncryptionKeyModal';
import { GoalTemplateModal } from './modals/GoalTemplateModal';
import { GoCardlessExternalMsgModal } from './modals/GoCardlessExternalMsgModal';
import { GoCardlessInitialiseModal } from './modals/GoCardlessInitialiseModal';
import { HoldBufferModal } from './modals/HoldBufferModal';
import { ImportTransactionsModal } from './modals/ImportTransactionsModal';
import { KeyboardShortcutModal } from './modals/KeyboardShortcutModal';
import { LoadBackupModal } from './modals/LoadBackupModal';
import { ConfirmChangeDocumentDirModal } from './modals/manager/ConfirmChangeDocumentDir';
import { DeleteFileModal } from './modals/manager/DeleteFileModal';
import { DuplicateFileModal } from './modals/manager/DuplicateFileModal';
import { FilesSettingsModal } from './modals/manager/FilesSettingsModal';
import { ImportActualModal } from './modals/manager/ImportActualModal';
import { ImportModal } from './modals/manager/ImportModal';
import { ImportYNAB4Modal } from './modals/manager/ImportYNAB4Modal';
import { ImportYNAB5Modal } from './modals/manager/ImportYNAB5Modal';
import { ManageRulesModal } from './modals/ManageRulesModal';
import { MergeUnusedPayeesModal } from './modals/MergeUnusedPayeesModal';
import { NewCategoryGroupModal } from './modals/NewCategoryGroupModal';
import { NewCategoryModal } from './modals/NewCategoryModal';
import { NotesModal } from './modals/NotesModal';
import { OpenIDEnableModal } from './modals/OpenIDEnableModal';
import { OutOfSyncMigrationsModal } from './modals/OutOfSyncMigrationsModal';
import { PasswordEnableModal } from './modals/PasswordEnableModal';
import { PayeeAutocompleteModal } from './modals/PayeeAutocompleteModal';
import { PluggyAiInitialiseModal } from './modals/PluggyAiInitialiseModal';
import { ScheduledTransactionMenuModal } from './modals/ScheduledTransactionMenuModal';
import { SelectLinkedAccountsModal } from './modals/SelectLinkedAccountsModal';
import { SimpleFinInitialiseModal } from './modals/SimpleFinInitialiseModal';
import { TrackingBalanceMenuModal } from './modals/TrackingBalanceMenuModal';
import { TrackingBudgetMenuModal } from './modals/TrackingBudgetMenuModal';
import { TrackingBudgetMonthMenuModal } from './modals/TrackingBudgetMonthMenuModal';
import { TrackingBudgetSummaryModal } from './modals/TrackingBudgetSummaryModal';
import { TransferModal } from './modals/TransferModal';
import { TransferOwnership } from './modals/TransferOwnership';
import { UnmigrateBudgetAutomationsModal } from './modals/UnmigrateBudgetAutomationsModal';
import { CategoryLearning } from './payees/CategoryLearning';
import { DiscoverSchedules } from './schedules/DiscoverSchedules';
import { PostsOfflineNotification } from './schedules/PostsOfflineNotification';
import { ScheduleDetails } from './schedules/ScheduleDetails';
import { ScheduleLink } from './schedules/ScheduleLink';
import { UpcomingLength } from './schedules/UpcomingLength';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useModalState } from '@desktop-client/hooks/useModalState';
import { SheetNameProvider } from '@desktop-client/hooks/useSheetName';
import { closeModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function Modals() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { modalStack } = useModalState();
    const [budgetId] = useMetadataPref('id');
    useEffect(() => {
        if (modalStack.length > 0) {
            dispatch(closeModal());
        }
    }, [location]);
    const modals = modalStack
        .map((modal, idx) => {
        const { name } = modal;
        const key = `${name}-${idx}`;
        switch (name) {
            case 'goal-templates':
                return budgetId ? _jsx(GoalTemplateModal, {}, key) : null;
            case 'category-automations-edit':
                return budgetId ? (_jsx(BudgetAutomationsModal, { ...modal.options }, name)) : null;
            case 'category-automations-unmigrate':
                return budgetId ? (_jsx(UnmigrateBudgetAutomationsModal, { ...modal.options }, name)) : null;
            case 'keyboard-shortcuts':
                // don't show the hotkey help modal when a budget is not open
                return budgetId ? _jsx(KeyboardShortcutModal, {}, key) : null;
            case 'import-transactions':
                return _jsx(ImportTransactionsModal, { ...modal.options }, key);
            case 'add-account':
                return _jsx(CreateAccountModal, { ...modal.options }, key);
            case 'add-local-account':
                return _jsx(CreateLocalAccountModal, {}, key);
            case 'close-account':
                return _jsx(CloseAccountModal, { ...modal.options }, key);
            case 'select-linked-accounts':
                return _jsx(SelectLinkedAccountsModal, { ...modal.options }, key);
            case 'confirm-category-delete':
                return _jsx(ConfirmCategoryDeleteModal, { ...modal.options }, key);
            case 'confirm-unlink-account':
                return _jsx(ConfirmUnlinkAccountModal, { ...modal.options }, key);
            case 'confirm-transaction-edit':
                return _jsx(ConfirmTransactionEditModal, { ...modal.options }, key);
            case 'confirm-delete':
                return _jsx(ConfirmDeleteModal, { ...modal.options }, key);
            case 'load-backup':
                return (_jsx(LoadBackupModal, { watchUpdates: true, ...modal.options, backupDisabled: false }, key));
            case 'manage-rules':
                return _jsx(ManageRulesModal, { ...modal.options }, key);
            case 'edit-rule':
                return _jsx(EditRuleModal, { ...modal.options }, key);
            case 'merge-unused-payees':
                return _jsx(MergeUnusedPayeesModal, { ...modal.options }, key);
            case 'gocardless-init':
                return _jsx(GoCardlessInitialiseModal, { ...modal.options }, key);
            case 'simplefin-init':
                return _jsx(SimpleFinInitialiseModal, { ...modal.options }, key);
            case 'pluggyai-init':
                return _jsx(PluggyAiInitialiseModal, { ...modal.options }, key);
            case 'gocardless-external-msg':
                return (_jsx(GoCardlessExternalMsgModal, { ...modal.options, onClose: () => {
                        modal.options.onClose?.();
                        send('gocardless-poll-web-token-stop');
                    } }, key));
            case 'create-encryption-key':
                return _jsx(CreateEncryptionKeyModal, { ...modal.options }, key);
            case 'fix-encryption-key':
                return _jsx(FixEncryptionKeyModal, { ...modal.options }, key);
            case 'edit-field':
                return _jsx(EditFieldModal, { ...modal.options }, key);
            case 'category-autocomplete':
                return _jsx(CategoryAutocompleteModal, { ...modal.options }, key);
            case 'account-autocomplete':
                return _jsx(AccountAutocompleteModal, { ...modal.options }, key);
            case 'payee-autocomplete':
                return _jsx(PayeeAutocompleteModal, { ...modal.options }, key);
            case 'payee-category-learning':
                return _jsx(CategoryLearning, {}, key);
            case 'new-category':
                return _jsx(NewCategoryModal, { ...modal.options }, key);
            case 'new-category-group':
                return _jsx(NewCategoryGroupModal, { ...modal.options }, key);
            case 'envelope-budget-summary':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(EnvelopeBudgetSummaryModal, { ...modal.options }, key) }, key));
            case 'tracking-budget-summary':
                return _jsx(TrackingBudgetSummaryModal, { ...modal.options }, key);
            case 'schedule-edit':
                return _jsx(ScheduleDetails, { ...modal.options }, key);
            case 'schedule-link':
                return _jsx(ScheduleLink, { ...modal.options }, key);
            case 'schedules-discover':
                return _jsx(DiscoverSchedules, {}, key);
            case 'schedules-upcoming-length':
                return _jsx(UpcomingLength, {}, key);
            case 'schedule-posts-offline-notification':
                return _jsx(PostsOfflineNotification, {}, key);
            case 'synced-account-edit':
                return _jsx(EditSyncAccount, { ...modal.options }, key);
            case 'account-menu':
                return _jsx(AccountMenuModal, { ...modal.options }, key);
            case 'category-menu':
                return _jsx(CategoryMenuModal, { ...modal.options }, key);
            case 'envelope-budget-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(EnvelopeBudgetMenuModal, { ...modal.options }) }, key));
            case 'tracking-budget-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(TrackingBudgetMenuModal, { ...modal.options }) }, key));
            case 'category-group-menu':
                return _jsx(CategoryGroupMenuModal, { ...modal.options }, key);
            case 'notes':
                return _jsx(NotesModal, { ...modal.options }, key);
            case 'envelope-balance-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(EnvelopeBalanceMenuModal, { ...modal.options }) }, key));
            case 'envelope-income-balance-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(EnvelopeIncomeBalanceMenuModal, { ...modal.options }) }, key));
            case 'envelope-summary-to-budget-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(EnvelopeToBudgetMenuModal, { ...modal.options }) }, key));
            case 'hold-buffer':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(HoldBufferModal, { ...modal.options }) }, key));
            case 'tracking-balance-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(TrackingBalanceMenuModal, { ...modal.options }) }, key));
            case 'transfer':
                return _jsx(TransferModal, { ...modal.options }, key);
            case 'cover':
                return _jsx(CoverModal, { ...modal.options }, key);
            case 'scheduled-transaction-menu':
                return _jsx(ScheduledTransactionMenuModal, { ...modal.options }, key);
            case 'budget-page-menu':
                return _jsx(BudgetPageMenuModal, { ...modal.options }, key);
            case 'envelope-budget-month-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(EnvelopeBudgetMonthMenuModal, { ...modal.options }) }, key));
            case 'tracking-budget-month-menu':
                return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(modal.options.month), children: _jsx(TrackingBudgetMonthMenuModal, { ...modal.options }) }, key));
            case 'budget-file-selection':
                return _jsx(BudgetFileSelectionModal, {}, name);
            case 'delete-budget':
                return _jsx(DeleteFileModal, { ...modal.options }, key);
            case 'duplicate-budget':
                return _jsx(DuplicateFileModal, { ...modal.options }, key);
            case 'import':
                return _jsx(ImportModal, {}, key);
            case 'files-settings':
                return _jsx(FilesSettingsModal, {}, key);
            case 'confirm-change-document-dir':
                return _jsx(ConfirmChangeDocumentDirModal, { ...modal.options }, key);
            case 'import-ynab4':
                return _jsx(ImportYNAB4Modal, {}, key);
            case 'import-ynab5':
                return _jsx(ImportYNAB5Modal, {}, key);
            case 'import-actual':
                return _jsx(ImportActualModal, {}, key);
            case 'out-of-sync-migrations':
                return _jsx(OutOfSyncMigrationsModal, {}, key);
            case 'edit-access':
                return _jsx(EditUserAccess, { ...modal.options }, key);
            case 'edit-user':
                return _jsx(EditUserFinanceApp, { ...modal.options }, key);
            case 'transfer-ownership':
                return _jsx(TransferOwnership, { ...modal.options }, key);
            case 'enable-openid':
                return _jsx(OpenIDEnableModal, { ...modal.options }, key);
            case 'enable-password-auth':
                return _jsx(PasswordEnableModal, { ...modal.options }, key);
            default:
                throw new Error('Unknown modal');
        }
    })
        .map((modal, idx) => (_jsx(React.Fragment, { children: modal }, `${modalStack[idx].name}-${idx}`)));
    // fragment needed per TS types
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return _jsx(_Fragment, { children: modals });
}
