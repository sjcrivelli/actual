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
exports.darkThemeOptions = exports.themeOptions = void 0;
exports.useTheme = useTheme;
exports.usePreferredDarkTheme = usePreferredDarkTheme;
exports.ThemeStyle = ThemeStyle;
var react_1 = require("react");
var environment_1 = require("loot-core/shared/environment");
var darkTheme = require("./themes/dark");
var developmentTheme = require("./themes/development");
var lightTheme = require("./themes/light");
var midnightTheme = require("./themes/midnight");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var themes = __assign({ light: { name: 'Light', colors: lightTheme }, dark: { name: 'Dark', colors: darkTheme }, midnight: { name: 'Midnight', colors: midnightTheme }, auto: { name: 'System default', colors: darkTheme } }, ((0, environment_1.isNonProductionEnvironment)() && {
    development: { name: 'Development', colors: developmentTheme },
}));
exports.themeOptions = Object.entries(themes).map(function (_a) {
    var key = _a[0], name = _a[1].name;
    return [key, name];
});
exports.darkThemeOptions = Object.entries({
    dark: themes.dark,
    midnight: themes.midnight,
}).map(function (_a) {
    var key = _a[0], name = _a[1].name;
    return [key, name];
});
function useTheme() {
    var _a = (0, useGlobalPref_1.useGlobalPref)('theme'), _b = _a[0], theme = _b === void 0 ? 'auto' : _b, setThemePref = _a[1];
    return [theme, setThemePref];
}
function usePreferredDarkTheme() {
    var _a = (0, useGlobalPref_1.useGlobalPref)('preferredDarkTheme'), _b = _a[0], darkTheme = _b === void 0 ? 'dark' : _b, setDarkTheme = _a[1];
    return [darkTheme, setDarkTheme];
}
function ThemeStyle() {
    var activeTheme = useTheme()[0];
    var darkThemePreference = usePreferredDarkTheme()[0];
    var _a = (0, react_1.useState)(undefined), themeColors = _a[0], setThemeColors = _a[1];
    (0, react_1.useEffect)(function () {
        var _a;
        if (activeTheme === 'auto') {
            var darkTheme_1 = themes[darkThemePreference];
            function darkThemeMediaQueryListener(event) {
                if (event.matches) {
                    setThemeColors(darkTheme_1.colors);
                }
                else {
                    setThemeColors(themes['light'].colors);
                }
            }
            var darkThemeMediaQuery_1 = window.matchMedia('(prefers-color-scheme: dark)');
            darkThemeMediaQuery_1.addEventListener('change', darkThemeMediaQueryListener);
            if (darkThemeMediaQuery_1.matches) {
                setThemeColors(darkTheme_1.colors);
            }
            else {
                setThemeColors(themes['light'].colors);
            }
            return function () {
                darkThemeMediaQuery_1.removeEventListener('change', darkThemeMediaQueryListener);
            };
        }
        else {
            setThemeColors((_a = themes[activeTheme]) === null || _a === void 0 ? void 0 : _a.colors);
        }
    }, [activeTheme, darkThemePreference]);
    if (!themeColors)
        return null;
    var css = Object.entries(themeColors)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "  --color-".concat(key, ": ").concat(value, ";");
    })
        .join('\n');
    return <style>{":root {\n".concat(css, "}")}</style>;
}
