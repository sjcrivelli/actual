"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyLoadFailedError = void 0;
exports.getUploadError = getUploadError;
exports.getDownloadError = getDownloadError;
exports.getCreateKeyError = getCreateKeyError;
exports.getTestKeyError = getTestKeyError;
exports.getSyncError = getSyncError;
exports.getBankSyncError = getBankSyncError;
exports.getUserAccessErrors = getUserAccessErrors;
exports.getSecretsError = getSecretsError;
exports.getOpenIdErrors = getOpenIdErrors;
// @ts-strict-ignore
const i18next_1 = require("i18next");
function getUploadError({ reason, meta, }) {
    switch (reason) {
        case 'unauthorized':
            return (0, i18next_1.t)('You are not logged in.');
        case 'encrypt-failure':
            if (meta.isMissingKey) {
                return (0, i18next_1.t)('Encrypting your file failed because you are missing your encryption key. Create your key in the next step.');
            }
            return (0, i18next_1.t)('Encrypting the file failed. You have the correct key so this is an internal bug. To fix this, generate a new key in the next step.');
        case 'file-has-reset':
            // Something really weird happened - during reset a sanity
            // check on the server failed. The user just needs to
            // restart the whole process.
            return (0, i18next_1.t)('Something went wrong while resetting your file. Please try again.');
        case 'file-has-new-key':
            return (0, i18next_1.t)('Unable to encrypt your data because you are missing the key. Create the latest key in the next step.');
        case 'network':
            return (0, i18next_1.t)('Uploading the file failed. Check your network connection.');
        default:
            return (0, i18next_1.t)('An internal error occurred, sorry! Visit https://actualbudget.org/contact/ for support. (ref: {{reason}})', { reason });
    }
}
function getDownloadError({ reason, meta, fileName, }) {
    switch (reason) {
        case 'network':
        case 'download-failure':
            return (0, i18next_1.t)('Downloading the file failed. Check your network connection.');
        case 'not-zip-file':
        case 'invalid-zip-file':
        case 'invalid-meta-file':
            return (0, i18next_1.t)('Downloaded file is invalid, sorry! Visit https://actualbudget.org/contact/ for support.');
        case 'decrypt-failure':
            return ('Unable to decrypt file ' +
                (fileName || '(unknown)') +
                '. To change your key, first ' +
                'download this file with the proper password.');
        case 'out-of-sync-migrations':
            return (0, i18next_1.t)('This budget cannot be loaded with this version of the app. Make sure the app is up-to-date.');
        default:
            const info = meta && typeof meta === 'object' && 'fileId' in meta && meta.fileId
                ? `, fileId: ${meta.fileId}`
                : '';
            return (0, i18next_1.t)('Something went wrong trying to download that file, sorry! Visit https://actualbudget.org/contact/ for support. reason: {{reason}}{{info}}', { reason, info });
    }
}
function getCreateKeyError(error) {
    return getUploadError(error);
}
function getTestKeyError({ reason }) {
    switch (reason) {
        case 'network':
            return (0, i18next_1.t)('Unable to connect to the server. We need to access the server to get some information about your keys.');
        case 'old-key-style':
            return (0, i18next_1.t)('This file is encrypted with an old unsupported key style. Recreate the key on a device where the file is available, or use an older version of Actual to download it.');
        case 'decrypt-failure':
            return (0, i18next_1.t)('Unable to decrypt file with this password. Please try again.');
        default:
            return (0, i18next_1.t)('Something went wrong trying to create a key, sorry! Visit https://actualbudget.org/contact/ for support.');
    }
}
function getSyncError(error, id) {
    if (error === 'out-of-sync-migrations' || error === 'out-of-sync-data') {
        return (0, i18next_1.t)('This budget cannot be loaded with this version of the app.');
    }
    else if (error === 'budget-not-found') {
        return (0, i18next_1.t)('Budget “{{id}}” not found. Check the ID of your budget in the Advanced section of the settings page.', { id });
    }
    else {
        return (0, i18next_1.t)('We had an unknown problem opening “{{id}}”.', { id });
    }
}
function getBankSyncError(error) {
    return error.message || (0, i18next_1.t)('We had an unknown problem syncing the account.');
}
class LazyLoadFailedError extends Error {
    type = 'app-init-failure';
    meta = {};
    constructor(name, cause) {
        super(`Error: failed loading lazy-loaded module ${name}`);
        this.meta = { name };
        this.cause = cause;
    }
}
exports.LazyLoadFailedError = LazyLoadFailedError;
function getUserAccessErrors(reason) {
    switch (reason) {
        case 'unauthorized':
            return (0, i18next_1.t)('You are not logged in.');
        case 'token-expired':
            return (0, i18next_1.t)('Login expired, please log in again.');
        case 'user-cant-be-empty':
            return (0, i18next_1.t)('Please select a user.');
        case 'invalid-file-id':
            return (0, i18next_1.t)('This file is invalid.');
        case 'file-denied':
            return (0, i18next_1.t)('You don`t have permissions over this file.');
        case 'user-already-have-access':
            return (0, i18next_1.t)('User already has access.');
        default:
            return (0, i18next_1.t)('An internal error occurred, sorry! Visit https://actualbudget.org/contact/ for support. (ref: {{reason}})', { reason });
    }
}
function getSecretsError(error, reason) {
    switch (reason) {
        case 'unauthorized':
            return (0, i18next_1.t)('You are not logged in.');
        case 'not-admin':
            return (0, i18next_1.t)('You have to be admin to set secrets');
        default:
            return error;
    }
}
function getOpenIdErrors(reason) {
    switch (reason) {
        case 'unauthorized':
            return (0, i18next_1.t)('You are not logged in.');
        case 'configuration-error':
            return (0, i18next_1.t)('This configuration is not valid. Please check it again.');
        case 'unable-to-change-file-config-enabled':
            return (0, i18next_1.t)('Unable to enable OpenID. Please update the config.json file in this case.');
        default:
            return (0, i18next_1.t)('An internal error occurred, sorry! Visit https://actualbudget.org/contact/ for support. (ref: {{reason}})', { reason });
    }
}
//# sourceMappingURL=errors.js.map