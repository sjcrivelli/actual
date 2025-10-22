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
exports.Sidebar = Sidebar;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var re_resizable_1 = require("re-resizable");
var Platform = require("loot-core/shared/platform");
var Accounts_1 = require("./Accounts");
var BudgetName_1 = require("./BudgetName");
var PrimaryButtons_1 = require("./PrimaryButtons");
var SecondaryButtons_1 = require("./SecondaryButtons");
var SidebarProvider_1 = require("./SidebarProvider");
var ToggleButton_1 = require("./ToggleButton");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function Sidebar() {
    var hasWindowButtons = !Platform.isBrowser && Platform.OS === 'mac';
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var sidebar = (0, SidebarProvider_1.useSidebar)();
    var width = (0, useResponsive_1.useResponsive)().width;
    var _a = (0, useGlobalPref_1.useGlobalPref)('floatingSidebar'), _b = _a[0], isFloating = _b === void 0 ? false : _b, setFloatingSidebarPref = _a[1];
    var _c = (0, useLocalPref_1.useLocalPref)('sidebarWidth'), sidebarWidthLocalPref = _c[0], setSidebarWidthLocalPref = _c[1];
    var DEFAULT_SIDEBAR_WIDTH = 240;
    var MAX_SIDEBAR_WIDTH = width / 3;
    var MIN_SIDEBAR_WIDTH = 200;
    var _d = (0, react_1.useState)(Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, sidebarWidthLocalPref || DEFAULT_SIDEBAR_WIDTH))), sidebarWidth = _d[0], setSidebarWidth = _d[1];
    var onResizeStop = function () {
        setSidebarWidthLocalPref(sidebarWidth);
    };
    var onFloat = function () {
        setFloatingSidebarPref(!isFloating);
    };
    var onAddAccount = function () {
        dispatch((0, modalsSlice_1.replaceModal)({ modal: { name: 'add-account', options: {} } }));
    };
    var containerRef = (0, useResizeObserver_1.useResizeObserver)(function (rect) {
        setSidebarWidth(rect.width);
    });
    return (<re_resizable_1.Resizable defaultSize={{
            width: sidebarWidth,
            height: '100%',
        }} onResizeStop={onResizeStop} maxWidth={MAX_SIDEBAR_WIDTH} minWidth={MIN_SIDEBAR_WIDTH} enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
        }}>
      <view_1.View innerRef={containerRef} className={(0, css_1.css)(__assign({ color: theme_1.theme.sidebarItemText, height: '100%', backgroundColor: theme_1.theme.sidebarBackground, '& .float': {
                opacity: isFloating ? 1 : 0,
                transition: 'opacity .25s, width .25s',
                width: hasWindowButtons || isFloating ? null : 0,
            }, '&:hover .float': {
                opacity: 1,
                width: hasWindowButtons ? null : 'auto',
            }, flex: 1 }, styles_1.styles.darkScrollbar))}>
        <BudgetName_1.BudgetName>
          {!sidebar.alwaysFloats && (<ToggleButton_1.ToggleButton isFloating={isFloating} onFloat={onFloat}/>)}
        </BudgetName_1.BudgetName>

        <view_1.View style={{
            flexGrow: 1,
            '@media screen and (max-height: 480px)': {
                overflowY: 'auto',
            },
        }}>
          <PrimaryButtons_1.PrimaryButtons />

          <Accounts_1.Accounts />

          <SecondaryButtons_1.SecondaryButtons buttons={[
            { title: t('Add account'), Icon: v1_1.SvgAdd, onClick: onAddAccount },
        ]}/>
        </view_1.View>
      </view_1.View>
    </re_resizable_1.Resizable>);
}
