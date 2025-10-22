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
exports.AccountMenuModal = AccountMenuModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
var Notes_1 = require("@desktop-client/components/Notes");
var accountValidation_1 = require("@desktop-client/components/util/accountValidation");
var useAccount_1 = require("@desktop-client/hooks/useAccount");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
function AccountMenuModal(_a) {
    var accountId = _a.accountId, onSave = _a.onSave, onCloseAccount = _a.onCloseAccount, onReopenAccount = _a.onReopenAccount, onEditNotes = _a.onEditNotes, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var account = (0, useAccount_1.useAccount)(accountId);
    var accounts = (0, useAccounts_1.useAccounts)();
    var originalNotes = (0, useNotes_1.useNotes)("account-".concat(accountId));
    var _b = (0, react_1.useState)(''), accountNameError = _b[0], setAccountNameError = _b[1];
    var _c = (0, react_1.useState)((account === null || account === void 0 ? void 0 : account.name) || t('New Account')), currentAccountName = _c[0], setCurrentAccountName = _c[1];
    var onRename = function (newName) {
        newName = newName.trim();
        if (!account) {
            return;
        }
        if (!newName) {
            setCurrentAccountName(t('Account'));
        }
        else {
            setCurrentAccountName(newName);
        }
        if (newName !== account.name) {
            var renameAccountError = (0, accountValidation_1.validateAccountName)(newName, accountId, accounts);
            if (renameAccountError) {
                setAccountNameError(renameAccountError);
            }
            else {
                setAccountNameError('');
                onSave === null || onSave === void 0 ? void 0 : onSave(__assign(__assign({}, account), { name: newName }));
            }
        }
    };
    var _onEditNotes = function () {
        if (!account) {
            return;
        }
        onEditNotes === null || onEditNotes === void 0 ? void 0 : onEditNotes(account.id);
    };
    var buttonStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight, color: theme_1.theme.formLabelText, 
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%' });
    if (!account) {
        return null;
    }
    return (<Modal_1.Modal name="account-menu" onClose={onClose} containerProps={{
            style: {
                height: '45vh',
            },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader leftContent={<AdditionalAccountMenu account={account} onClose={onCloseAccount} onReopen={onReopenAccount}/>} title={<react_1.Fragment>
                <Modal_1.ModalTitle isEditable title={currentAccountName} onTitleUpdate={onRename}/>
                {accountNameError && (<view_1.View style={{ color: theme_1.theme.warningText }}>
                    {accountNameError}
                  </view_1.View>)}
              </react_1.Fragment>} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
            <view_1.View style={{
                    overflowY: 'auto',
                    flex: 1,
                }}>
              <Notes_1.Notes notes={originalNotes && originalNotes.length > 0
                    ? originalNotes
                    : t('No notes')} editable={false} focused={false} getStyle={function () { return (__assign({ borderRadius: 6 }, ((!originalNotes || originalNotes.length === 0) && {
                    justifySelf: 'center',
                    alignSelf: 'center',
                    color: theme_1.theme.pageTextSubdued,
                }))); }}/>
            </view_1.View>
            <view_1.View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignContent: 'space-between',
                    paddingTop: 10,
                }}>
              <button_1.Button style={buttonStyle} onPress={_onEditNotes}>
                <v2_1.SvgNotesPaper width={20} height={20} style={{ paddingRight: 5 }}/>
                <react_i18next_1.Trans>Edit notes</react_i18next_1.Trans>
              </button_1.Button>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
function AdditionalAccountMenu(_a) {
    var account = _a.account, onClose = _a.onClose, onReopen = _a.onReopen;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var itemStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight });
    var getItemStyle = function (item) { return (__assign(__assign({}, itemStyle), (item.name === 'close' && { color: theme_1.theme.errorTextMenu }))); };
    return (<view_1.View>
      <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={function () {
            setMenuOpen(true);
        }}>
        <v1_1.SvgDotsHorizontalTriple width={17} height={17} style={{ color: 'currentColor' }}/>
        <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} placement="bottom start" onOpenChange={function () { return setMenuOpen(false); }}>
          <menu_1.Menu getItemStyle={getItemStyle} items={[
            account.closed
                ? {
                    name: 'reopen',
                    text: t('Reopen account'),
                    icon: v1_1.SvgLockOpen,
                    iconSize: 15,
                }
                : {
                    name: 'close',
                    text: t('Close account'),
                    icon: v1_1.SvgClose,
                    iconSize: 15,
                },
        ]} onMenuSelect={function (name) {
            setMenuOpen(false);
            switch (name) {
                case 'close':
                    onClose === null || onClose === void 0 ? void 0 : onClose(account.id);
                    break;
                case 'reopen':
                    onReopen === null || onReopen === void 0 ? void 0 : onReopen(account.id);
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
        }}/>
        </popover_1.Popover>
      </button_1.Button>
    </view_1.View>);
}
