"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modals = Modals;
// @ts-strict-ignore
var react_1 = require("react");
var react_router_1 = require("react-router");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var EditSyncAccount_1 = require("./banksync/EditSyncAccount");
var AccountAutocompleteModal_1 = require("./modals/AccountAutocompleteModal");
var AccountMenuModal_1 = require("./modals/AccountMenuModal");
var BudgetAutomationsModal_1 = require("./modals/BudgetAutomationsModal");
var BudgetFileSelectionModal_1 = require("./modals/BudgetFileSelectionModal");
var BudgetPageMenuModal_1 = require("./modals/BudgetPageMenuModal");
var CategoryAutocompleteModal_1 = require("./modals/CategoryAutocompleteModal");
var CategoryGroupMenuModal_1 = require("./modals/CategoryGroupMenuModal");
var CategoryMenuModal_1 = require("./modals/CategoryMenuModal");
var CloseAccountModal_1 = require("./modals/CloseAccountModal");
var ConfirmCategoryDeleteModal_1 = require("./modals/ConfirmCategoryDeleteModal");
var ConfirmDeleteModal_1 = require("./modals/ConfirmDeleteModal");
var ConfirmTransactionEditModal_1 = require("./modals/ConfirmTransactionEditModal");
var ConfirmUnlinkAccountModal_1 = require("./modals/ConfirmUnlinkAccountModal");
var CoverModal_1 = require("./modals/CoverModal");
var CreateAccountModal_1 = require("./modals/CreateAccountModal");
var CreateEncryptionKeyModal_1 = require("./modals/CreateEncryptionKeyModal");
var CreateLocalAccountModal_1 = require("./modals/CreateLocalAccountModal");
var EditAccess_1 = require("./modals/EditAccess");
var EditFieldModal_1 = require("./modals/EditFieldModal");
var EditRuleModal_1 = require("./modals/EditRuleModal");
var EditUser_1 = require("./modals/EditUser");
var EnvelopeBalanceMenuModal_1 = require("./modals/EnvelopeBalanceMenuModal");
var EnvelopeBudgetMenuModal_1 = require("./modals/EnvelopeBudgetMenuModal");
var EnvelopeBudgetMonthMenuModal_1 = require("./modals/EnvelopeBudgetMonthMenuModal");
var EnvelopeBudgetSummaryModal_1 = require("./modals/EnvelopeBudgetSummaryModal");
var EnvelopeIncomeBalanceMenuModal_1 = require("./modals/EnvelopeIncomeBalanceMenuModal");
var EnvelopeToBudgetMenuModal_1 = require("./modals/EnvelopeToBudgetMenuModal");
var FixEncryptionKeyModal_1 = require("./modals/FixEncryptionKeyModal");
var GoalTemplateModal_1 = require("./modals/GoalTemplateModal");
var GoCardlessExternalMsgModal_1 = require("./modals/GoCardlessExternalMsgModal");
var GoCardlessInitialiseModal_1 = require("./modals/GoCardlessInitialiseModal");
var HoldBufferModal_1 = require("./modals/HoldBufferModal");
var ImportTransactionsModal_1 = require("./modals/ImportTransactionsModal");
var KeyboardShortcutModal_1 = require("./modals/KeyboardShortcutModal");
var LoadBackupModal_1 = require("./modals/LoadBackupModal");
var ConfirmChangeDocumentDir_1 = require("./modals/manager/ConfirmChangeDocumentDir");
var DeleteFileModal_1 = require("./modals/manager/DeleteFileModal");
var DuplicateFileModal_1 = require("./modals/manager/DuplicateFileModal");
var FilesSettingsModal_1 = require("./modals/manager/FilesSettingsModal");
var ImportActualModal_1 = require("./modals/manager/ImportActualModal");
var ImportModal_1 = require("./modals/manager/ImportModal");
var ImportYNAB4Modal_1 = require("./modals/manager/ImportYNAB4Modal");
var ImportYNAB5Modal_1 = require("./modals/manager/ImportYNAB5Modal");
var ManageRulesModal_1 = require("./modals/ManageRulesModal");
var MergeUnusedPayeesModal_1 = require("./modals/MergeUnusedPayeesModal");
var NewCategoryGroupModal_1 = require("./modals/NewCategoryGroupModal");
var NewCategoryModal_1 = require("./modals/NewCategoryModal");
var NotesModal_1 = require("./modals/NotesModal");
var OpenIDEnableModal_1 = require("./modals/OpenIDEnableModal");
var OutOfSyncMigrationsModal_1 = require("./modals/OutOfSyncMigrationsModal");
var PasswordEnableModal_1 = require("./modals/PasswordEnableModal");
var PayeeAutocompleteModal_1 = require("./modals/PayeeAutocompleteModal");
var PluggyAiInitialiseModal_1 = require("./modals/PluggyAiInitialiseModal");
var ScheduledTransactionMenuModal_1 = require("./modals/ScheduledTransactionMenuModal");
var SelectLinkedAccountsModal_1 = require("./modals/SelectLinkedAccountsModal");
var SimpleFinInitialiseModal_1 = require("./modals/SimpleFinInitialiseModal");
var TrackingBalanceMenuModal_1 = require("./modals/TrackingBalanceMenuModal");
var TrackingBudgetMenuModal_1 = require("./modals/TrackingBudgetMenuModal");
var TrackingBudgetMonthMenuModal_1 = require("./modals/TrackingBudgetMonthMenuModal");
var TrackingBudgetSummaryModal_1 = require("./modals/TrackingBudgetSummaryModal");
var TransferModal_1 = require("./modals/TransferModal");
var TransferOwnership_1 = require("./modals/TransferOwnership");
var UnmigrateBudgetAutomationsModal_1 = require("./modals/UnmigrateBudgetAutomationsModal");
var CategoryLearning_1 = require("./payees/CategoryLearning");
var DiscoverSchedules_1 = require("./schedules/DiscoverSchedules");
var PostsOfflineNotification_1 = require("./schedules/PostsOfflineNotification");
var ScheduleDetails_1 = require("./schedules/ScheduleDetails");
var ScheduleLink_1 = require("./schedules/ScheduleLink");
var UpcomingLength_1 = require("./schedules/UpcomingLength");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useModalState_1 = require("@desktop-client/hooks/useModalState");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function Modals() {
    var location = (0, react_router_1.useLocation)();
    var dispatch = (0, redux_1.useDispatch)();
    var modalStack = (0, useModalState_1.useModalState)().modalStack;
    var budgetId = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    (0, react_1.useEffect)(function () {
        if (modalStack.length > 0) {
            dispatch((0, modalsSlice_1.closeModal)());
        }
    }, [location]);
    var modals = modalStack
        .map(function (modal, idx) {
        var name = modal.name;
        var key = "".concat(name, "-").concat(idx);
        switch (name) {
            case 'goal-templates':
                return budgetId ? <GoalTemplateModal_1.GoalTemplateModal key={key}/> : null;
            case 'category-automations-edit':
                return budgetId ? (<BudgetAutomationsModal_1.BudgetAutomationsModal key={name} {...modal.options}/>) : null;
            case 'category-automations-unmigrate':
                return budgetId ? (<UnmigrateBudgetAutomationsModal_1.UnmigrateBudgetAutomationsModal key={name} {...modal.options}/>) : null;
            case 'keyboard-shortcuts':
                // don't show the hotkey help modal when a budget is not open
                return budgetId ? <KeyboardShortcutModal_1.KeyboardShortcutModal key={key}/> : null;
            case 'import-transactions':
                return <ImportTransactionsModal_1.ImportTransactionsModal key={key} {...modal.options}/>;
            case 'add-account':
                return <CreateAccountModal_1.CreateAccountModal key={key} {...modal.options}/>;
            case 'add-local-account':
                return <CreateLocalAccountModal_1.CreateLocalAccountModal key={key}/>;
            case 'close-account':
                return <CloseAccountModal_1.CloseAccountModal key={key} {...modal.options}/>;
            case 'select-linked-accounts':
                return <SelectLinkedAccountsModal_1.SelectLinkedAccountsModal key={key} {...modal.options}/>;
            case 'confirm-category-delete':
                return <ConfirmCategoryDeleteModal_1.ConfirmCategoryDeleteModal key={key} {...modal.options}/>;
            case 'confirm-unlink-account':
                return <ConfirmUnlinkAccountModal_1.ConfirmUnlinkAccountModal key={key} {...modal.options}/>;
            case 'confirm-transaction-edit':
                return <ConfirmTransactionEditModal_1.ConfirmTransactionEditModal key={key} {...modal.options}/>;
            case 'confirm-delete':
                return <ConfirmDeleteModal_1.ConfirmDeleteModal key={key} {...modal.options}/>;
            case 'load-backup':
                return (<LoadBackupModal_1.LoadBackupModal key={key} watchUpdates {...modal.options} backupDisabled={false}/>);
            case 'manage-rules':
                return <ManageRulesModal_1.ManageRulesModal key={key} {...modal.options}/>;
            case 'edit-rule':
                return <EditRuleModal_1.EditRuleModal key={key} {...modal.options}/>;
            case 'merge-unused-payees':
                return <MergeUnusedPayeesModal_1.MergeUnusedPayeesModal key={key} {...modal.options}/>;
            case 'gocardless-init':
                return <GoCardlessInitialiseModal_1.GoCardlessInitialiseModal key={key} {...modal.options}/>;
            case 'simplefin-init':
                return <SimpleFinInitialiseModal_1.SimpleFinInitialiseModal key={key} {...modal.options}/>;
            case 'pluggyai-init':
                return <PluggyAiInitialiseModal_1.PluggyAiInitialiseModal key={key} {...modal.options}/>;
            case 'gocardless-external-msg':
                return (<GoCardlessExternalMsgModal_1.GoCardlessExternalMsgModal key={key} {...modal.options} onClose={function () {
                        var _a, _b;
                        (_b = (_a = modal.options).onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
                        (0, fetch_1.send)('gocardless-poll-web-token-stop');
                    }}/>);
            case 'create-encryption-key':
                return <CreateEncryptionKeyModal_1.CreateEncryptionKeyModal key={key} {...modal.options}/>;
            case 'fix-encryption-key':
                return <FixEncryptionKeyModal_1.FixEncryptionKeyModal key={key} {...modal.options}/>;
            case 'edit-field':
                return <EditFieldModal_1.EditFieldModal key={key} {...modal.options}/>;
            case 'category-autocomplete':
                return <CategoryAutocompleteModal_1.CategoryAutocompleteModal key={key} {...modal.options}/>;
            case 'account-autocomplete':
                return <AccountAutocompleteModal_1.AccountAutocompleteModal key={key} {...modal.options}/>;
            case 'payee-autocomplete':
                return <PayeeAutocompleteModal_1.PayeeAutocompleteModal key={key} {...modal.options}/>;
            case 'payee-category-learning':
                return <CategoryLearning_1.CategoryLearning key={key}/>;
            case 'new-category':
                return <NewCategoryModal_1.NewCategoryModal key={key} {...modal.options}/>;
            case 'new-category-group':
                return <NewCategoryGroupModal_1.NewCategoryGroupModal key={key} {...modal.options}/>;
            case 'envelope-budget-summary':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <EnvelopeBudgetSummaryModal_1.EnvelopeBudgetSummaryModal key={key} {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'tracking-budget-summary':
                return <TrackingBudgetSummaryModal_1.TrackingBudgetSummaryModal key={key} {...modal.options}/>;
            case 'schedule-edit':
                return <ScheduleDetails_1.ScheduleDetails key={key} {...modal.options}/>;
            case 'schedule-link':
                return <ScheduleLink_1.ScheduleLink key={key} {...modal.options}/>;
            case 'schedules-discover':
                return <DiscoverSchedules_1.DiscoverSchedules key={key}/>;
            case 'schedules-upcoming-length':
                return <UpcomingLength_1.UpcomingLength key={key}/>;
            case 'schedule-posts-offline-notification':
                return <PostsOfflineNotification_1.PostsOfflineNotification key={key}/>;
            case 'synced-account-edit':
                return <EditSyncAccount_1.EditSyncAccount key={key} {...modal.options}/>;
            case 'account-menu':
                return <AccountMenuModal_1.AccountMenuModal key={key} {...modal.options}/>;
            case 'category-menu':
                return <CategoryMenuModal_1.CategoryMenuModal key={key} {...modal.options}/>;
            case 'envelope-budget-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <EnvelopeBudgetMenuModal_1.EnvelopeBudgetMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'tracking-budget-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <TrackingBudgetMenuModal_1.TrackingBudgetMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'category-group-menu':
                return <CategoryGroupMenuModal_1.CategoryGroupMenuModal key={key} {...modal.options}/>;
            case 'notes':
                return <NotesModal_1.NotesModal key={key} {...modal.options}/>;
            case 'envelope-balance-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <EnvelopeBalanceMenuModal_1.EnvelopeBalanceMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'envelope-income-balance-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <EnvelopeIncomeBalanceMenuModal_1.EnvelopeIncomeBalanceMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'envelope-summary-to-budget-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <EnvelopeToBudgetMenuModal_1.EnvelopeToBudgetMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'hold-buffer':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <HoldBufferModal_1.HoldBufferModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'tracking-balance-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <TrackingBalanceMenuModal_1.TrackingBalanceMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'transfer':
                return <TransferModal_1.TransferModal key={key} {...modal.options}/>;
            case 'cover':
                return <CoverModal_1.CoverModal key={key} {...modal.options}/>;
            case 'scheduled-transaction-menu':
                return <ScheduledTransactionMenuModal_1.ScheduledTransactionMenuModal key={key} {...modal.options}/>;
            case 'budget-page-menu':
                return <BudgetPageMenuModal_1.BudgetPageMenuModal key={key} {...modal.options}/>;
            case 'envelope-budget-month-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <EnvelopeBudgetMonthMenuModal_1.EnvelopeBudgetMonthMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'tracking-budget-month-menu':
                return (<useSheetName_1.SheetNameProvider key={key} name={monthUtils.sheetForMonth(modal.options.month)}>
              <TrackingBudgetMonthMenuModal_1.TrackingBudgetMonthMenuModal {...modal.options}/>
            </useSheetName_1.SheetNameProvider>);
            case 'budget-file-selection':
                return <BudgetFileSelectionModal_1.BudgetFileSelectionModal key={name}/>;
            case 'delete-budget':
                return <DeleteFileModal_1.DeleteFileModal key={key} {...modal.options}/>;
            case 'duplicate-budget':
                return <DuplicateFileModal_1.DuplicateFileModal key={key} {...modal.options}/>;
            case 'import':
                return <ImportModal_1.ImportModal key={key}/>;
            case 'files-settings':
                return <FilesSettingsModal_1.FilesSettingsModal key={key}/>;
            case 'confirm-change-document-dir':
                return <ConfirmChangeDocumentDir_1.ConfirmChangeDocumentDirModal key={key} {...modal.options}/>;
            case 'import-ynab4':
                return <ImportYNAB4Modal_1.ImportYNAB4Modal key={key}/>;
            case 'import-ynab5':
                return <ImportYNAB5Modal_1.ImportYNAB5Modal key={key}/>;
            case 'import-actual':
                return <ImportActualModal_1.ImportActualModal key={key}/>;
            case 'out-of-sync-migrations':
                return <OutOfSyncMigrationsModal_1.OutOfSyncMigrationsModal key={key}/>;
            case 'edit-access':
                return <EditAccess_1.EditUserAccess key={key} {...modal.options}/>;
            case 'edit-user':
                return <EditUser_1.EditUserFinanceApp key={key} {...modal.options}/>;
            case 'transfer-ownership':
                return <TransferOwnership_1.TransferOwnership key={key} {...modal.options}/>;
            case 'enable-openid':
                return <OpenIDEnableModal_1.OpenIDEnableModal key={key} {...modal.options}/>;
            case 'enable-password-auth':
                return <PasswordEnableModal_1.PasswordEnableModal key={key} {...modal.options}/>;
            default:
                throw new Error('Unknown modal');
        }
    })
        .map(function (modal, idx) { return (<react_1.default.Fragment key={"".concat(modalStack[idx].name, "-").concat(idx)}>
        {modal}
      </react_1.default.Fragment>); });
    // fragment needed per TS types
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{modals}</>;
}
