"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSyncCheck = AccountSyncCheck;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var popover_1 = require("@actual-app/components/popover");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var gocardless_1 = require("@desktop-client/gocardless");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useFailedAccounts_1 = require("@desktop-client/hooks/useFailedAccounts");
var redux_1 = require("@desktop-client/redux");
function useErrorMessage() {
    var t = (0, react_i18next_1.useTranslation)().t;
    function getErrorMessage(type, code) {
        switch (type.toUpperCase()) {
            case 'ITEM_ERROR':
                switch (code.toUpperCase()) {
                    case 'NO_ACCOUNTS':
                        return t('No open accounts could be found. Did you close the account? If so, unlink the account.');
                    case 'ITEM_LOGIN_REQUIRED':
                        return t('Your password or something else has changed with your bank and you need to login again.');
                    default:
                }
                break;
            case 'INVALID_INPUT':
                switch (code.toUpperCase()) {
                    case 'INVALID_ACCESS_TOKEN':
                        return t('Item is no longer authorized. You need to login again.');
                    default:
                }
                break;
            case 'RATE_LIMIT_EXCEEDED':
                return t('Rate limit exceeded for this item. Please try again later.');
            case 'TIMED_OUT':
                return t('The request timed out. Please try again later.');
            case 'INVALID_ACCESS_TOKEN':
                return t('Your SimpleFIN Access Token is no longer valid. Please reset and generate a new token.');
            case 'ACCOUNT_NEEDS_ATTENTION':
                return (<react_i18next_1.Trans>
            The account needs your attention at{' '}
            <Link_1.Link variant="external" to="https://bridge.simplefin.org/auth/login">
              SimpleFIN
            </Link_1.Link>
            .
          </react_i18next_1.Trans>);
            default:
        }
        return (<react_i18next_1.Trans>
        An internal error occurred. Try to log in again, or get{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/contact/">
          in touch
        </Link_1.Link>{' '}
        for support.
      </react_i18next_1.Trans>);
    }
    return { getErrorMessage: getErrorMessage };
}
function AccountSyncCheck() {
    var accounts = (0, useAccounts_1.useAccounts)();
    var failedAccounts = (0, useFailedAccounts_1.useFailedAccounts)();
    var dispatch = (0, redux_1.useDispatch)();
    var id = (0, react_router_1.useParams)().id;
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var triggerRef = (0, react_1.useRef)(null);
    var getErrorMessage = useErrorMessage().getErrorMessage;
    var reauth = (0, react_1.useCallback)(function (acc) {
        setOpen(false);
        if (acc.account_id) {
            (0, gocardless_1.authorizeBank)(dispatch);
        }
    }, [dispatch]);
    var unlink = (0, react_1.useCallback)(function (acc) {
        if (acc.id) {
            dispatch((0, accountsSlice_1.unlinkAccount)({ id: acc.id }));
        }
        setOpen(false);
    }, [dispatch]);
    if (!failedAccounts || !id) {
        return null;
    }
    var error = failedAccounts.get(id);
    if (!error) {
        return null;
    }
    var account = accounts.find(function (account) { return account.id === id; });
    if (!account) {
        return null;
    }
    var type = error.type, code = error.code;
    var showAuth = (type === 'ITEM_ERROR' && code === 'ITEM_LOGIN_REQUIRED') ||
        (type === 'INVALID_INPUT' && code === 'INVALID_ACCESS_TOKEN');
    return (<view_1.View>
      <button_1.Button ref={triggerRef} variant="bare" style={{
            flexDirection: 'row',
            alignItems: 'center',
            color: theme_1.theme.errorText,
            backgroundColor: theme_1.theme.errorBackground,
            padding: '4px 8px',
            borderRadius: 4,
        }} onPress={function () { return setOpen(true); }}>
        <v1_1.SvgExclamationOutline style={{ width: 14, height: 14, marginRight: 5 }}/>{' '}
        <react_i18next_1.Trans>
          This account is experiencing connection problems. Let’s fix it.
        </react_i18next_1.Trans>
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={open} onOpenChange={function () { return setOpen(false); }} style={{ fontSize: 14, padding: 15, maxWidth: 400 }}>
        <div style={{ marginBottom: '1.15em' }}>
          <react_i18next_1.Trans>The server returned the following error:</react_i18next_1.Trans>
        </div>

        <div style={{ marginBottom: '1.25em', color: theme_1.theme.errorText }}>
          {getErrorMessage(error.type, error.code)}
        </div>

        <view_1.View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
          {showAuth ? (<>
              <button_1.Button onPress={function () { return unlink(account); }}>
                <react_i18next_1.Trans>Unlink</react_i18next_1.Trans>
              </button_1.Button>
              <button_1.Button variant="primary" autoFocus onPress={function () { return reauth(account); }} style={{ marginLeft: 5 }}>
                <react_i18next_1.Trans>Reauthorize</react_i18next_1.Trans>
              </button_1.Button>
            </>) : (<button_1.Button onPress={function () { return unlink(account); }}>
              <react_i18next_1.Trans>Unlink account</react_i18next_1.Trans>
            </button_1.Button>)}
        </view_1.View>
      </popover_1.Popover>
    </view_1.View>);
}
