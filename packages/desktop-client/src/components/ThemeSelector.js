"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSelector = ThemeSelector;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var style_1 = require("@desktop-client/style");
function ThemeSelector(_a) {
    var style = _a.style;
    var _b = (0, style_1.useTheme)(), theme = _b[0], switchTheme = _b[1];
    var _c = (0, react_1.useState)(false), menuOpen = _c[0], setMenuOpen = _c[1];
    var triggerRef = (0, react_1.useRef)(null);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var t = (0, react_i18next_1.useTranslation)().t;
    var themeIcons = {
        light: v2_1.SvgSun,
        dark: v2_1.SvgMoonStars,
        auto: v2_1.SvgSystem,
        midnight: v2_1.SvgMoonStars,
        development: v2_1.SvgMoonStars,
    };
    function onMenuSelect(newTheme) {
        setMenuOpen(false);
        switchTheme(newTheme);
    }
    var Icon = themeIcons[theme] || v2_1.SvgSun;
    if (isNarrowWidth) {
        return null;
    }
    return (<>
      <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Switch theme')} onPress={function () { return setMenuOpen(true); }} style={style}>
        <Icon style={{ width: 13, height: 13, color: 'inherit' }}/>
      </button_1.Button>

      <popover_1.Popover offset={8} triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }}>
        <menu_1.Menu onMenuSelect={onMenuSelect} items={style_1.themeOptions.map(function (_a) {
        var name = _a[0], text = _a[1];
        return ({ name: name, text: text });
    })}/>
      </popover_1.Popover>
    </>);
}
