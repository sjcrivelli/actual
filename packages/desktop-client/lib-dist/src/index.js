import { jsx as _jsx } from "react/jsx-runtime";
import './version-shim';
// @ts-strict-ignore
// This file will initialize the app if we are in a real browser
// environment (not electron)
import './browser-preload.browser.js';
import './fonts.scss';
import './i18n';
import { Provider } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { createRoot } from 'react-dom/client';
import { send } from 'loot-core/platform/client/fetch';
import { q } from 'loot-core/shared/query';
import * as accountsSlice from './accounts/accountsSlice';
import * as appSlice from './app/appSlice';
import { AuthProvider } from './auth/AuthProvider';
import * as budgetSlice from './budget/budgetSlice';
import * as budgetfilesSlice from './budgetfiles/budgetfilesSlice';
import { App } from './components/App';
import { ServerProvider } from './components/ServerContext';
import * as modalsSlice from './modals/modalsSlice';
import * as notificationsSlice from './notifications/notificationsSlice';
import * as payeesSlice from './payees/payeesSlice';
import * as prefsSlice from './prefs/prefsSlice';
import { aqlQuery } from './queries/aqlQuery';
import { store } from './redux/store';
import * as tagsSlice from './tags/tagsSlice';
import * as transactionsSlice from './transactions/transactionsSlice';
import { redo, undo } from './undo';
import * as usersSlice from './users/usersSlice';
const boundActions = bindActionCreators({
    ...accountsSlice.actions,
    ...appSlice.actions,
    ...budgetSlice.actions,
    ...budgetfilesSlice.actions,
    ...modalsSlice.actions,
    ...notificationsSlice.actions,
    ...payeesSlice.actions,
    ...prefsSlice.actions,
    ...transactionsSlice.actions,
    ...tagsSlice.actions,
    ...usersSlice.actions,
}, store.dispatch);
async function appFocused() {
    await send('app-focused');
}
async function uploadFile(filename, contents) {
    send('upload-file-web', {
        filename,
        contents,
    });
}
function inputFocused(e) {
    const target = e.target;
    return (target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true);
}
// Expose this to the main process to menu items can access it
window.__actionsForMenu = {
    ...boundActions,
    undo,
    redo,
    appFocused,
    uploadFile,
};
// Expose send for fun!
window.$send = send;
window.$query = aqlQuery;
window.$q = q;
const container = document.getElementById('root');
const root = createRoot(container);
root.render(_jsx(Provider, { store: store, children: _jsx(ServerProvider, { children: _jsx(AuthProvider, { children: _jsx(App, {}) }) }) }));
document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey) {
        // Cmd/Ctrl+o
        if (e.key === 'o') {
            e.preventDefault();
            window.__actionsForMenu.closeBudget();
        }
        // Cmd/Ctrl+z
        else if (e.key.toLowerCase() === 'z') {
            if (inputFocused(e)) {
                return;
            }
            e.preventDefault();
            if (e.shiftKey) {
                // Redo
                window.__actionsForMenu.redo();
            }
            else {
                // Undo
                window.__actionsForMenu.undo();
            }
        }
    }
});
