"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalPrivacyFilter = ConditionalPrivacyFilter;
exports.PrivacyFilter = PrivacyFilter;
exports.mergeConditionalPrivacyFilterProps = mergeConditionalPrivacyFilterProps;
// @ts-strict-ignore
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var usePrivacyMode_1 = require("@desktop-client/hooks/usePrivacyMode");
function ConditionalPrivacyFilter(_a) {
    var children = _a.children, privacyFilter = _a.privacyFilter, defaultPrivacyFilterProps = _a.defaultPrivacyFilterProps;
    var renderPrivacyFilter = function (children, mergedProps) { return (<PrivacyFilter {...mergedProps}>{children}</PrivacyFilter>); };
    return privacyFilter ? (typeof privacyFilter === 'boolean' ? (<PrivacyFilter {...defaultPrivacyFilterProps}>{children}</PrivacyFilter>) : (renderPrivacyFilter(children, mergeConditionalPrivacyFilterProps(defaultPrivacyFilterProps, privacyFilter)))) : (<>{react_1.Children.toArray(children)}</>);
}
function PrivacyFilter(_a) {
    var activationFilters = _a.activationFilters, children = _a.children, props = __rest(_a, ["activationFilters", "children"]);
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    // Limit mobile support for now.
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var activate = privacyMode &&
        !isNarrowWidth &&
        (!activationFilters ||
            activationFilters.every(function (value) {
                return typeof value === 'boolean' ? value : value();
            }));
    return !activate ? (<>{react_1.Children.toArray(children)}</>) : (<PrivacyOverlay {...props}>{children}</PrivacyOverlay>);
}
function PrivacyOverlay(_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var style = props.style, restProps = __rest(props, ["style"]);
    return (<view_1.View className={(0, css_1.css)([
            {
                display: 'inline-flex',
                flexGrow: 1,
                position: 'relative',
                ' > div:first-child': {
                    opacity: 0,
                },
                ' > div:nth-child(2)': {
                    display: 'flex',
                },
                '&:hover': {
                    ' > div:first-child': {
                        opacity: 1,
                    },
                    ' > div:nth-child(2)': {
                        display: 'none',
                    },
                },
            },
        ], style)} {...restProps}>
      <div className={(0, css_1.css)([
            {
                display: 'flex',
                flexGrow: 1,
            },
        ])}>
        {children}
      </div>

      <div aria-hidden="true" className={(0, css_1.css)({
            flexDirection: 'column',
            fontFamily: 'Redacted Script',
            height: '100%',
            inset: 0,
            justifyContent: 'center',
            pointerEvents: 'none',
            position: 'absolute',
            width: '100%',
        })}>
        {children}
      </div>
    </view_1.View>);
}
function mergeConditionalPrivacyFilterProps(defaultPrivacyFilterProps, privacyFilter) {
    if (defaultPrivacyFilterProps === void 0) { defaultPrivacyFilterProps = {}; }
    if (privacyFilter == null || privacyFilter === false) {
        return privacyFilter;
    }
    if (privacyFilter === true) {
        return defaultPrivacyFilterProps;
    }
    return merge(defaultPrivacyFilterProps, privacyFilter);
}
function merge(initialValue) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    return objects.reduce(function (prev, current) {
        Object.keys(current).forEach(function (key) {
            var pValue = prev[key];
            var cValue = current[key];
            if (Array.isArray(pValue) && Array.isArray(cValue)) {
                prev[key] = pValue.concat.apply(pValue, cValue);
            }
            else if (isObject(pValue) && isObject(cValue)) {
                prev[key] = merge(pValue, cValue);
            }
            else {
                prev[key] = cValue;
            }
        });
        return prev;
    }, initialValue);
}
function isObject(obj) {
    return obj && typeof obj === 'object';
}
