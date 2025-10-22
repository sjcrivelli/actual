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
exports.accountNameStyle = void 0;
exports.Account = Account;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var space_between_1 = require("@actual-app/components/space-between");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var Platform = require("loot-core/shared/platform");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var BalanceHistoryGraph_1 = require("@desktop-client/components/accounts/BalanceHistoryGraph");
var Link_1 = require("@desktop-client/components/common/Link");
var Notes_1 = require("@desktop-client/components/Notes");
var sort_1 = require("@desktop-client/components/sort");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useDragRef_1 = require("@desktop-client/hooks/useDragRef");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
exports.accountNameStyle = __assign({ marginTop: -2, marginBottom: 2, paddingTop: 4, paddingBottom: 4, paddingRight: 15, paddingLeft: 10, textDecoration: 'none', color: theme_1.theme.sidebarItemText, ':hover': { backgroundColor: theme_1.theme.sidebarItemBackgroundHover } }, styles_1.styles.smallText);
function Account(_a) {
    var name = _a.name, account = _a.account, connected = _a.connected, _b = _a.pending, pending = _b === void 0 ? false : _b, failed = _a.failed, updated = _a.updated, to = _a.to, query = _a.query, style = _a.style, outerStyle = _a.outerStyle, onDragChange = _a.onDragChange, onDrop = _a.onDrop, titleAccount = _a.titleAccount;
    var t = (0, react_i18next_1.useTranslation)().t;
    var type = account
        ? account.closed
            ? 'account-closed'
            : account.offbudget
                ? 'account-offbudget'
                : 'account-onbudget'
        : 'title';
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _c.setMenuOpen, menuOpen = _c.menuOpen, handleContextMenu = _c.handleContextMenu, position = _c.position;
    var dragRef = (0, sort_1.useDraggable)({
        type: type,
        onDragChange: onDragChange,
        item: { id: account && account.id },
        canDrag: account != null,
    }).dragRef;
    var handleDragRef = (0, useDragRef_1.useDragRef)(dragRef);
    var _d = (0, sort_1.useDroppable)({
        types: account ? [type] : [],
        id: account && account.id,
        onDrop: onDrop,
    }), dropRef = _d.dropRef, dropPos = _d.dropPos;
    var _e = (0, useSyncedPref_1.useSyncedPref)("side-nav.show-balance-history-".concat(account === null || account === void 0 ? void 0 : account.id)), showBalanceHistory = _e[0], setShowBalanceHistory = _e[1];
    var dispatch = (0, redux_1.useDispatch)();
    var _f = (0, react_1.useState)(false), isEditing = _f[0], setIsEditing = _f[1];
    var accountNote = (0, useNotes_1.useNotes)("account-".concat(account === null || account === void 0 ? void 0 : account.id));
    var isTouchDevice = window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(pointer: coarse)').matches;
    var needsTooltip = !!(account === null || account === void 0 ? void 0 : account.id) && !isTouchDevice;
    var accountRow = (<view_1.View innerRef={dropRef} style={__assign({ flexShrink: 0 }, outerStyle)} onContextMenu={needsTooltip ? handleContextMenu : undefined}>
      <view_1.View innerRef={triggerRef}>
        <sort_1.DropHighlight pos={dropPos}/>
        <view_1.View innerRef={handleDragRef}>
          <Link_1.Link variant="internal" to={to} isDisabled={isEditing} style={__assign(__assign(__assign(__assign({}, exports.accountNameStyle), style), { position: 'relative', borderLeft: '4px solid transparent' }), (updated && { fontWeight: 700 }))} activeStyle={{
            borderColor: theme_1.theme.sidebarItemAccentSelected,
            color: theme_1.theme.sidebarItemTextSelected,
            // This is kind of a hack, but we don't ever want the account
            // that the user is looking at to be "bolded" which means it
            // has unread transactions. The system does mark is read and
            // unbolds it, but it still "flashes" bold so this just
            // ignores it if it's active
            fontWeight: (style && style.fontWeight) || 'normal',
            '& .dot': {
                backgroundColor: theme_1.theme.sidebarItemAccentSelected,
                transform: 'translateX(-4.5px)',
            },
        }}>
            <view_1.View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
              <div className={(0, css_1.cx)('dot', (0, css_1.css)({
            marginRight: 3,
            width: 5,
            height: 5,
            borderRadius: 5,
            backgroundColor: pending
                ? theme_1.theme.sidebarItemBackgroundPending
                : failed
                    ? theme_1.theme.sidebarItemBackgroundFailed
                    : theme_1.theme.sidebarItemBackgroundPositive,
            marginLeft: 2,
            transition: 'transform .3s',
            opacity: connected ? 1 : 0,
        }))}/>
            </view_1.View>

            <aligned_text_1.AlignedText style={titleAccount && {
            borderBottom: "1.5px solid rgba(255,255,255,0.4)",
            paddingBottom: '3px',
        }} left={isEditing ? (<initial_focus_1.InitialFocus>
                    <input_1.Input style={{
                padding: 0,
                width: '100%',
            }} onBlur={function () { return setIsEditing(false); }} onEnter={function (newAccountName) {
                if (newAccountName.trim() !== '') {
                    dispatch((0, accountsSlice_1.updateAccount)({
                        account: __assign(__assign({}, account), { name: newAccountName }),
                    }));
                }
                setIsEditing(false);
            }} onEscape={function () { return setIsEditing(false); }} defaultValue={name}/>
                  </initial_focus_1.InitialFocus>) : (name)} right={<CellValue_1.CellValue binding={query} type="financial"/>}/>
          </Link_1.Link>
          {account && (<popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ width: 200, margin: 1 }} isNonModal {...position}>
              <menu_1.Menu onMenuSelect={function (type) {
                switch (type) {
                    case 'close': {
                        dispatch((0, modalsSlice_1.openAccountCloseModal)({ accountId: account.id }));
                        break;
                    }
                    case 'reopen': {
                        dispatch((0, accountsSlice_1.reopenAccount)({ id: account.id }));
                        break;
                    }
                    case 'rename': {
                        setIsEditing(true);
                        break;
                    }
                }
                setMenuOpen(false);
            }} items={[
                { name: 'rename', text: t('Rename') },
                account.closed
                    ? { name: 'reopen', text: t('Reopen') }
                    : { name: 'close', text: t('Close') },
            ]}/>
            </popover_1.Popover>)}
        </view_1.View>
      </view_1.View>
    </view_1.View>);
    if (!needsTooltip || Platform.isPlaywright) {
        return accountRow;
    }
    return (<tooltip_1.Tooltip content={<view_1.View style={{
                padding: 10,
            }}>
          <space_between_1.SpaceBetween gap={5} style={{
                justifyContent: 'space-between',
                '& .hover-visible': {
                    opacity: 0,
                    transition: 'opacity .25s',
                },
                '&:hover .hover-visible': {
                    opacity: 1,
                },
            }}>
            <text_1.Text style={{
                fontWeight: 'bold',
            }}>
              {name}
            </text_1.Text>
            <button_1.Button aria-label={t('Toggle balance history')} variant="bare" onClick={function () {
                return setShowBalanceHistory(showBalanceHistory === 'true' ? 'false' : 'true');
            }} className="hover-visible">
              <space_between_1.SpaceBetween gap={3}>
                {showBalanceHistory === 'true' ? (<v2_1.SvgArrowButtonUp1 width={10} height={10}/>) : (<v2_1.SvgArrowButtonDown1 width={10} height={10}/>)}
              </space_between_1.SpaceBetween>
            </button_1.Button>
          </space_between_1.SpaceBetween>
          {showBalanceHistory === 'true' && account && (<BalanceHistoryGraph_1.BalanceHistoryGraph accountId={account.id} style={{ minWidth: 350, minHeight: 70 }}/>)}
          {accountNote && (<Notes_1.Notes getStyle={function () { return ({
                    borderTop: "1px solid ".concat(theme_1.theme.tableBorder),
                    padding: 0,
                    paddingTop: '0.5rem',
                    marginTop: '0.5rem',
                }); }} notes={accountNote}/>)}
        </view_1.View>} style={__assign(__assign({}, styles_1.styles.tooltip), { borderRadius: '0px 5px 5px 0px' })} placement="right top" triggerProps={{
            delay: 1000,
            closeDelay: 250,
            isDisabled: menuOpen,
        }}>
      {accountRow}
    </tooltip_1.Tooltip>);
}
