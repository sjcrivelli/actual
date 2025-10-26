import * as undo from "@desktop-client/undo";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGlobalEvents = handleGlobalEvents;
// @ts-strict-ignore
var fetch_1 = require("loot-core/platform/client/fetch");
var accountsSlice_1 = require("./accounts/accountsSlice");
var appSlice_1 = require("./app/appSlice");
var budgetSlice_1 = require("./budget/budgetSlice");
var budgetfilesSlice_1 = require("./budgetfiles/budgetfilesSlice");
var modalsSlice_1 = require("./modals/modalsSlice");
var notificationsSlice_1 = require("./notifications/notificationsSlice");
var payeesSlice_1 = require("./payees/payeesSlice");
var prefsSlice_1 = require("./prefs/prefsSlice");
var syncEvents = require("./sync-events");
function handleGlobalEvents(store) {
    var unlistenServerError = (0, fetch_1.listen)('server-error', function () {
        store.dispatch((0, notificationsSlice_1.addGenericErrorNotification)());
    });
    var unlistenOrphanedPayees = (0, fetch_1.listen)('orphaned-payees', function (_a) {
        var orphanedIds = _a.orphanedIds, updatedPayeeIds = _a.updatedPayeeIds;
        // Right now, it prompts to merge into the first payee
        store.dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'merge-unused-payees',
                options: {
                    payeeIds: orphanedIds,
                    targetPayeeId: updatedPayeeIds[0],
                },
            },
        }));
    });
    var unlistenSchedulesOffline = (0, fetch_1.listen)('schedules-offline', function () {
        store.dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'schedule-posts-offline-notification' } }));
    });
    var unlistenSync = syncEvents.listenForSyncEvent(store);
    var unlistenUndo = (0, fetch_1.listen)('undo-event', function (undoState) {
        var tables = undoState.tables, undoTag = undoState.undoTag;
        var promises = [];
        if (tables.includes('categories') ||
            tables.includes('category_groups') ||
            tables.includes('category_mapping')) {
            promises.push(store.dispatch((0, budgetSlice_1.reloadCategories)()));
        }
        if (tables.includes('accounts') ||
            tables.includes('payees') ||
            tables.includes('payee_mapping')) {
            promises.push(store.dispatch((0, payeesSlice_1.reloadPayees)()));
        }
        if (tables.includes('accounts')) {
            promises.push(store.dispatch((0, accountsSlice_1.reloadAccounts)()));
        }
        var tagged = undo.getTaggedState(undoTag);
        if (tagged) {
            Promise.all(promises).then(function () {
                undo.setUndoState('undoEvent', undoState);
                // If a modal has been tagged, open it instead of navigating
                if (tagged.openModal) {
                    var modalStack = store.getState().modals.modalStack;
                    if (modalStack.length === 0 ||
                        modalStack[modalStack.length - 1].name !== tagged.openModal.name) {
                        store.dispatch((0, modalsSlice_1.replaceModal)({ modal: tagged.openModal }));
                    }
                }
                else {
                    store.dispatch((0, modalsSlice_1.closeModal)());
                    if (window.location.href.replace(window.location.origin, '') !==
                        tagged.url) {
                        window.__navigate(tagged.url);
                        // This stops propagation of the undo event, which is
                        // important because if we are changing URLs any existing
                        // undo listeners on the current page don't need to be run
                        return true;
                    }
                }
            });
        }
    });
    var unlistenFallbackWriteError = (0, fetch_1.listen)('fallback-write-error', function () {
        store.dispatch((0, notificationsSlice_1.addNotification)({
            notification: {
                type: 'error',
                title: 'Unable to save changes',
                sticky: true,
                message: 'This browser only supports using the app in one tab at a time, ' +
                    'and another tab has opened the app. No changes will be saved ' +
                    'from this tab; please close it and continue working in the other one.',
            },
        }));
    });
    var unlistenStartLoad = (0, fetch_1.listen)('start-load', function () {
        store.dispatch((0, budgetfilesSlice_1.closeBudgetUI)());
        store.dispatch((0, appSlice_1.setAppState)({ loadingText: '' }));
    });
    var unlistenFinishLoad = (0, fetch_1.listen)('finish-load', function () {
        store.dispatch((0, modalsSlice_1.closeModal)());
        store.dispatch((0, appSlice_1.setAppState)({ loadingText: null }));
        store.dispatch((0, prefsSlice_1.loadPrefs)());
    });
    var unlistenStartImport = (0, fetch_1.listen)('start-import', function () {
        store.dispatch((0, budgetfilesSlice_1.closeBudgetUI)());
    });
    var unlistenFinishImport = (0, fetch_1.listen)('finish-import', function () {
        store.dispatch((0, modalsSlice_1.closeModal)());
        store.dispatch((0, appSlice_1.setAppState)({ loadingText: null }));
        store.dispatch((0, prefsSlice_1.loadPrefs)());
    });
    var unlistenShowBudgets = (0, fetch_1.listen)('show-budgets', function () {
        store.dispatch((0, budgetfilesSlice_1.closeBudgetUI)());
        store.dispatch((0, appSlice_1.setAppState)({ loadingText: null }));
    });
    var unlistenApiFetchRedirected = (0, fetch_1.listen)('api-fetch-redirected', function () {
        window.Actual.reload();
    });
    return function () {
        unlistenServerError();
        unlistenOrphanedPayees();
        unlistenSchedulesOffline();
        unlistenSync();
        unlistenUndo();
        unlistenFallbackWriteError();
        unlistenStartLoad();
        unlistenFinishLoad();
        unlistenStartImport();
        unlistenFinishImport();
        unlistenShowBudgets();
        unlistenApiFetchRedirected();
    };
}
