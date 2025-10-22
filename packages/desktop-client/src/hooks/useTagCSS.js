"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTagCSS = useTagCSS;
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var useTags_1 = require("./useTags");
var style_1 = require("@desktop-client/style");
function useTagCSS() {
    var tags = (0, useTags_1.useTags)();
    var theme = (0, style_1.useTheme)()[0];
    return (0, react_1.useCallback)(function (tag, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        var _c = getTagCSSColors(theme, 
        // fallback strategy: options color > tag color > default color > theme color (undefined)
        (_a = options.color) !== null && _a !== void 0 ? _a : (_b = tags.find(function (t) { return t.tag === tag; })) === null || _b === void 0 ? void 0 : _b.color), color = _c[0], backgroundColor = _c[1], backgroundColorHovered = _c[2];
        return (0, css_1.css)({
            display: 'inline-flex',
            padding: options.compact ? '0px 7px' : '3px 7px',
            borderRadius: 16,
            userSelect: 'none',
            backgroundColor: backgroundColor,
            color: color,
            cursor: 'pointer',
            '&[data-hovered]': {
                backgroundColor: backgroundColorHovered,
            },
            '&[data-pressed]': {
                backgroundColor: backgroundColorHovered,
            },
        });
    }, [theme, tags]);
}
function getContrastedColor(hexcolor) {
    // see: https://www.w3.org/TR/AERT/#color-contrast
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var brightnessDiff = (r * 299 + g * 587 + b * 114) / 1000;
    return brightnessDiff >= 125 ? 'black' : 'white';
}
function getTagCSSColors(theme, color) {
    if (!color) {
        return [
            theme_1.theme.noteTagText,
            theme_1.theme.noteTagBackground,
            theme_1.theme.noteTagBackgroundHover,
        ];
    }
    if (theme === 'auto') {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
    }
    if (theme === 'light') {
        return [
            "".concat(color, " !important"),
            "color-mix(in srgb, ".concat(color, " 15%, white)"),
            "color-mix(in srgb, ".concat(color, " 25%, white)"),
        ];
    }
    else {
        return [
            getContrastedColor(color),
            color,
            "color-mix(in srgb, ".concat(color, " 85%, white)"),
        ];
    }
}
