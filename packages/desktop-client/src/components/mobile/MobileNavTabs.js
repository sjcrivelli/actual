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
exports.MOBILE_NAV_HEIGHT = void 0;
exports.MobileNavTabs = MobileNavTabs;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var react_spring_1 = require("react-spring");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var react_2 = require("@use-gesture/react");
var ScrollProvider_1 = require("@desktop-client/components/ScrollProvider");
var COLUMN_COUNT = 3;
var PILL_HEIGHT = 15;
var ROW_HEIGHT = 70;
var TOTAL_HEIGHT = ROW_HEIGHT * COLUMN_COUNT;
var OPEN_FULL_Y = 1;
var OPEN_DEFAULT_Y = TOTAL_HEIGHT - ROW_HEIGHT;
var HIDDEN_Y = TOTAL_HEIGHT;
exports.MOBILE_NAV_HEIGHT = ROW_HEIGHT + PILL_HEIGHT;
function MobileNavTabs() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _a = (0, react_1.useState)('default'), navbarState = _a[0], setNavbarState = _a[1];
    var navTabStyle = {
        flex: "1 1 ".concat(100 / COLUMN_COUNT, "%"),
        height: ROW_HEIGHT,
        padding: 10,
        maxWidth: "".concat(100 / COLUMN_COUNT, "%"),
    };
    var _b = (0, react_spring_1.useSpring)(function () { return ({ y: OPEN_DEFAULT_Y }); }), y = _b[0].y, api = _b[1];
    var openFull = (0, react_1.useCallback)(function (_a) {
        var canceled = _a.canceled;
        // when cancel is true, it means that the user passed the upwards threshold
        // so we change the spring config to create a nice wobbly effect
        setNavbarState('open');
        api.start({
            y: OPEN_FULL_Y,
            immediate: false,
            config: canceled ? react_spring_1.config.wobbly : react_spring_1.config.stiff,
        });
    }, [api, OPEN_FULL_Y]);
    var openDefault = (0, react_1.useCallback)(function (velocity) {
        if (velocity === void 0) { velocity = 0; }
        setNavbarState('default');
        api.start({
            y: OPEN_DEFAULT_Y,
            immediate: false,
            config: __assign(__assign({}, react_spring_1.config.stiff), { velocity: velocity }),
        });
    }, [api, OPEN_DEFAULT_Y]);
    var hide = (0, react_1.useCallback)(function (velocity) {
        if (velocity === void 0) { velocity = 0; }
        setNavbarState('hidden');
        api.start({
            y: HIDDEN_Y,
            immediate: false,
            config: __assign(__assign({}, react_spring_1.config.stiff), { velocity: velocity }),
        });
    }, [api, HIDDEN_Y]);
    var navTabs = [
        {
            name: t('Budget'),
            path: '/budget',
            style: navTabStyle,
            Icon: v1_1.SvgWallet,
        },
        {
            name: t('Transaction'),
            path: '/transactions/new',
            style: navTabStyle,
            Icon: v1_1.SvgAdd,
        },
        {
            name: t('Accounts'),
            path: '/accounts',
            style: navTabStyle,
            Icon: v1_1.SvgPiggyBank,
        },
        {
            name: t('Reports'),
            path: '/reports',
            style: navTabStyle,
            Icon: v1_1.SvgReports,
        },
        {
            name: t('Schedules (Soon)'),
            path: '/schedules/soon',
            style: navTabStyle,
            Icon: v2_1.SvgCalendar3,
        },
        {
            name: t('Payees'),
            path: '/payees',
            style: navTabStyle,
            Icon: v1_1.SvgStoreFront,
        },
        {
            name: t('Rules'),
            path: '/rules',
            style: navTabStyle,
            Icon: v1_1.SvgTuning,
        },
        {
            name: t('Settings'),
            path: '/settings',
            style: navTabStyle,
            Icon: v1_1.SvgCog,
        },
    ].map(function (tab) { return (<NavTab key={tab.path} onClick={function () { return openDefault(); }} {...tab}/>); });
    var bufferTabsCount = COLUMN_COUNT - (navTabs.length % COLUMN_COUNT);
    var bufferTabs = Array.from({ length: bufferTabsCount }).map(function (_, idx) { return (<div key={idx} style={navTabStyle}/>); });
    (0, ScrollProvider_1.useScrollListener)((0, react_1.useCallback)(function (_a) {
        var isScrolling = _a.isScrolling, hasScrolledToEnd = _a.hasScrolledToEnd;
        if (isScrolling('down') && !hasScrolledToEnd('up')) {
            hide();
        }
        else if (isScrolling('up') && !hasScrolledToEnd('down')) {
            openDefault();
        }
    }, [hide, openDefault]));
    var bind = (0, react_2.useDrag)(function (_a) {
        var last = _a.last, _b = _a.velocity, vy = _b[1], _c = _a.direction, dy = _c[1], _d = _a.offset, oy = _d[1], cancel = _a.cancel, canceled = _a.canceled;
        // if the user drags up passed a threshold, then we cancel
        // the drag so that the sheet resets to its open position
        if (oy < 0) {
            cancel();
        }
        // when the user releases the sheet, we check whether it passed
        // the threshold for it to close, or if we reset it to its open position
        if (last) {
            if (oy > ROW_HEIGHT * 0.5 || (vy > 0.5 && dy > 0)) {
                openDefault(vy);
            }
            else {
                openFull({ canceled: canceled });
            }
        }
        else {
            // when the user keeps dragging, we just move the sheet according to
            // the cursor position
            api.start({ y: oy, immediate: true });
        }
    }, {
        from: function () { return [0, y.get()]; },
        filterTaps: true,
        bounds: { top: -TOTAL_HEIGHT, bottom: TOTAL_HEIGHT - ROW_HEIGHT },
        axis: 'y',
        rubberband: true,
    });
    return (<react_spring_1.animated.div role="navigation" {...bind()} style={__assign(__assign(__assign({ y: y, touchAction: 'pan-x', backgroundColor: theme_1.theme.mobileNavBackground, borderTop: "1px solid ".concat(theme_1.theme.menuBorder) }, styles_1.styles.shadow), { height: TOTAL_HEIGHT + PILL_HEIGHT, width: '100%', position: 'fixed', zIndex: 100, bottom: 0 }), (!isNarrowWidth && { display: 'none' }))} data-navbar-state={navbarState}>
      <view_1.View>
        <div style={{
            backgroundColor: theme_1.theme.pillBorder,
            borderRadius: 10,
            width: 30,
            marginTop: 5,
            marginBottom: 5,
            padding: 2,
            alignSelf: 'center',
        }}/>
        <view_1.View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            height: TOTAL_HEIGHT,
            width: '100%',
        }}>
          {[navTabs, bufferTabs]}
        </view_1.View>
      </view_1.View>
    </react_spring_1.animated.div>);
}
function NavTab(_a) {
    var TabIcon = _a.Icon, name = _a.name, path = _a.path, style = _a.style, onClick = _a.onClick;
    return (<react_router_1.NavLink to={path} style={function (_a) {
            var isActive = _a.isActive;
            return (__assign(__assign(__assign({}, styles_1.styles.noTapHighlight), { alignItems: 'center', color: isActive ? theme_1.theme.mobileNavItemSelected : theme_1.theme.mobileNavItem, display: 'flex', flexDirection: 'column', textDecoration: 'none', textAlign: 'center', textWrap: 'balance', userSelect: 'none' }), style));
        }} onClick={onClick}>
      <TabIcon width={22} height={22} style={{ minHeight: '22px' }}/>
      {name}
    </react_router_1.NavLink>);
}
