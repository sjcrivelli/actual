"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpMenu = void 0;
var react_1 = require("react");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var space_between_1 = require("@actual-app/components/space-between");
var usehooks_ts_1 = require("usehooks-ts");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var getPageDocs = function (page) {
    switch (page) {
        case '/budget':
            return 'https://actualbudget.org/docs/getting-started/envelope-budgeting';
        case '/reports':
            return 'https://actualbudget.org/docs/reports/';
        case '/schedules':
            return 'https://actualbudget.org/docs/schedules';
        case '/payees':
            return 'https://actualbudget.org/docs/transactions/payees';
        case '/rules':
            return 'https://actualbudget.org/docs/budgeting/rules';
        case '/settings':
            return 'https://actualbudget.org/docs/settings';
        default:
            // All pages under /accounts, plus any missing pages
            return 'https://actualbudget.org/docs';
    }
};
function openDocsForCurrentPage() {
    window.Actual.openURLInBrowser(getPageDocs(window.location.pathname));
}
var HelpButton = (0, react_1.forwardRef)(function (_a, ref) {
    var onPress = _a.onPress;
    var size = 15;
    return (<button_1.Button variant="bare" ref={ref} onPress={onPress} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
        }}>
        <v2_1.SvgHelp width={size} height={size}/>
        <react_i18next_1.Trans>Help</react_i18next_1.Trans>
      </button_1.Button>);
});
HelpButton.displayName = 'HelpButton';
var HelpMenu = function () {
    var showGoalTemplates = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, usehooks_ts_1.useToggle)(), isMenuOpen = _a[0], toggleMenuOpen = _a[1], setMenuOpen = _a[2];
    var menuButtonRef = (0, react_1.useRef)(null);
    var dispatch = (0, redux_1.useDispatch)();
    var page = (0, react_router_1.useLocation)().pathname;
    var handleItemSelect = function (item) {
        switch (item) {
            case 'docs':
                openDocsForCurrentPage();
                break;
            case 'discord':
                window.Actual.openURLInBrowser('https://discord.gg/pRYNYr4W5A');
                break;
            case 'keyboard-shortcuts':
                dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'keyboard-shortcuts' } }));
                break;
            case 'goal-templates':
                dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'goal-templates' } }));
                break;
        }
    };
    (0, react_hotkeys_hook_1.useHotkeys)('?', function () { return setMenuOpen(true); }, { useKey: true });
    return (<space_between_1.SpaceBetween>
      <HelpButton ref={menuButtonRef} onPress={toggleMenuOpen}/>

      <popover_1.Popover placement="bottom end" offset={8} triggerRef={menuButtonRef} isOpen={isMenuOpen} onOpenChange={function () { return setMenuOpen(false); }}>
        <menu_1.Menu onMenuSelect={function (item) {
            setMenuOpen(false);
            handleItemSelect(item);
        }} items={__spreadArray([
            {
                name: 'docs',
                text: t('Documentation'),
            },
            {
                name: 'discord',
                text: t('Community support (Discord)'),
            },
            { name: 'keyboard-shortcuts', text: t('Keyboard shortcuts') }
        ], (showGoalTemplates && page === '/budget'
            ? [{ name: 'goal-templates', text: t('Goal templates') }]
            : []), true)}/>
      </popover_1.Popover>
    </space_between_1.SpaceBetween>);
};
exports.HelpMenu = HelpMenu;
