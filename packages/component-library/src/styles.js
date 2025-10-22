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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = void 0;
var css_1 = require("@emotion/css");
var theme_1 = require("./theme");
var tokens_1 = require("./tokens");
var MOBILE_MIN_HEIGHT = 40;
var shadowLarge = {
    boxShadow: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.styles = {
    incomeHeaderHeight: 70,
    cardShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    monthRightPadding: 5,
    menuBorderRadius: 4,
    mobileMinHeight: MOBILE_MIN_HEIGHT,
    mobileMenuItem: {
        fontSize: 17,
        fontWeight: 400,
        paddingTop: 8,
        paddingBottom: 8,
        height: MOBILE_MIN_HEIGHT,
        minHeight: MOBILE_MIN_HEIGHT,
    },
    mobileEditingPadding: 12,
    altMenuMaxHeight: 250,
    altMenuText: {
        fontSize: 13,
    },
    altMenuHeaderText: {
        fontSize: 13,
        fontWeight: 700,
    },
    veryLargeText: {
        fontSize: 30,
        fontWeight: 600,
    },
    largeText: {
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: 0.5,
    },
    mediumText: {
        fontSize: 15,
        fontWeight: 500,
    },
    smallText: {
        fontSize: 13,
    },
    verySmallText: {
        fontSize: 12,
    },
    tinyText: {
        fontSize: 10,
    },
    page: (_a = {
            flex: 1,
            '@media (max-height: 550px)': {
                minHeight: 700, // ensure we can scroll on small screens
            },
            paddingTop: 8
        },
        _a["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
            paddingTop: 36,
        },
        _a),
    pageContent: (_b = {
            paddingLeft: 2,
            paddingRight: 2
        },
        _b["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
            paddingLeft: 20,
            paddingRight: 20,
        },
        _b),
    settingsPageContent: (_c = {
            padding: 20
        },
        _c["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
            padding: 'inherit',
        },
        _c),
    staticText: {
        cursor: 'default',
        userSelect: 'none',
    },
    shadow: {
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
    },
    shadowLarge: shadowLarge,
    tnum: {
        // eslint-disable-next-line actual/typography
        fontFeatureSettings: '"tnum"',
    },
    notFixed: { fontFeatureSettings: '' },
    text: {
        fontSize: 16,
        // lineHeight: 22.4 // TODO: This seems like trouble, but what's the right value?
    },
    delayedFadeIn: {
        animationName: (0, css_1.keyframes)({
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
        }),
        animationDuration: '1s',
        animationFillMode: 'both',
        animationDelay: '0.5s',
    },
    underlinedText: {
        borderBottom: "2px solid",
    },
    noTapHighlight: {
        WebkitTapHighlightColor: 'transparent',
        ':focus': {
            outline: 'none',
        },
    },
    lineClamp: function (lines) {
        return {
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
        };
    },
    tooltip: __assign(__assign({ padding: 5 }, shadowLarge), { borderWidth: 2, borderRadius: 4, borderStyle: 'solid', borderColor: theme_1.theme.tooltipBorder, backgroundColor: theme_1.theme.tooltipBackground, color: theme_1.theme.tooltipText, overflow: 'auto' }),
    popover: {
        border: 'none',
        backgroundColor: theme_1.theme.menuBackground,
        color: theme_1.theme.menuItemText,
    },
    // Dynamically set
    horizontalScrollbar: null,
    lightScrollbar: null,
    darkScrollbar: null,
    scrollbarWidth: null,
    editorPill: {
        color: theme_1.theme.pillText,
        backgroundColor: theme_1.theme.pillBackground,
        borderRadius: 4,
        padding: '3px 5px',
    },
    mobileListItem: {
        borderBottom: "1px solid ".concat(theme_1.theme.tableBorder),
        backgroundColor: theme_1.theme.tableBackground,
        padding: 16,
        cursor: 'pointer',
    },
};
