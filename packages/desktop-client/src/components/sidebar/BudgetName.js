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
exports.BudgetName = BudgetName;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var environment_1 = require("loot-core/shared/environment");
var Platform = require("loot-core/shared/platform");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function BudgetName(_a) {
    var children = _a.children;
    var hasWindowButtons = !Platform.isBrowser && Platform.OS === 'mac';
    return (<view_1.View style={__assign({ paddingTop: 35, height: 30, flexDirection: 'row', alignItems: 'center', margin: '0 8px 23px 20px', userSelect: 'none', transition: 'padding .4s' }, (hasWindowButtons
            ? {
                paddingTop: 20,
                justifyContent: 'flex-start',
            }
            : {}))}>
      <EditableBudgetName />

      <view_1.View style={{ flex: 1, flexDirection: 'row' }}/>

      {children}
    </view_1.View>);
}
function EditableBudgetName() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, useMetadataPref_1.useMetadataPref)('budgetName'), budgetName = _a[0], setBudgetNamePref = _a[1];
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), editing = _b[0], setEditing = _b[1];
    var _c = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _c.setMenuOpen, menuOpen = _c.menuOpen, handleContextMenu = _c.handleContextMenu, resetPosition = _c.resetPosition, position = _c.position;
    function onMenuSelect(type) {
        setMenuOpen(false);
        switch (type) {
            case 'rename':
                setEditing(true);
                break;
            case 'settings':
                navigate('/settings');
                break;
            case 'loadBackup':
                if ((0, environment_1.isElectron)()) {
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: { name: 'load-backup', options: {} },
                    }));
                }
                break;
            case 'close':
                dispatch((0, budgetfilesSlice_1.closeBudget)());
                break;
            default:
        }
    }
    var items = [
        { name: 'rename', text: t('Rename budget') },
        { name: 'settings', text: t('Settings') },
        (0, environment_1.isElectron)() ? { name: 'loadBackup', text: t('Load Backup…') } : null,
        { name: 'close', text: t('Switch file') },
    ].filter(function (item) { return item !== null; });
    if (editing) {
        return (<initial_focus_1.InitialFocus>
        <input_1.Input style={{
                maxWidth: 'calc(100% - 23px)',
                fontSize: 16,
                fontWeight: 500,
            }} defaultValue={budgetName} onEnter={function (newBudgetName) {
                if (newBudgetName.trim() !== '') {
                    setBudgetNamePref(newBudgetName);
                    setEditing(false);
                }
            }} onBlur={function () { return setEditing(false); }}/>
      </initial_focus_1.InitialFocus>);
    }
    return (<view_1.View onContextMenu={handleContextMenu}>
      <button_1.Button ref={triggerRef} variant="bare" style={{
            color: theme_1.theme.buttonNormalBorder,
            fontSize: 16,
            fontWeight: 500,
            marginLeft: -5,
            flex: '0 auto',
        }} onPress={function () {
            resetPosition();
            setMenuOpen(true);
        }}>
        <text_1.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {budgetName || t('Unnamed')}
        </text_1.Text>
        <v0_1.SvgExpandArrow width={7} height={7} style={{ flexShrink: 0, marginLeft: 5 }}/>
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ margin: 1 }} {...position}>
        <menu_1.Menu onMenuSelect={onMenuSelect} items={items}/>
      </popover_1.Popover>
    </view_1.View>);
}
