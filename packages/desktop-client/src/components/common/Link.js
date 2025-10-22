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
exports.Link = Link;
var react_1 = require("react");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var externalLinkColors = {
    purple: theme_1.theme.pageTextPositive,
    blue: theme_1.theme.pageTextLink,
    muted: 'inherit',
};
var ExternalLink = function (_a) {
    var children = _a.children, to = _a.to, _b = _a.linkColor, linkColor = _b === void 0 ? 'blue' : _b;
    return (
    // we can’t use <ExternalLink /> here for obvious reasons
    // eslint-disable-next-line no-restricted-syntax
    <a href={to !== null && to !== void 0 ? to : ''} target="_blank" rel="noopener noreferrer" style={{ color: externalLinkColors[linkColor] }}>
      {children}
    </a>);
};
var TextLink = function (_a) {
    var style = _a.style, onClick = _a.onClick, children = _a.children, props = __rest(_a, ["style", "onClick", "children"]);
    return (<text_1.Text style={__assign({ backgroundColor: 'transparent', display: 'inline', border: 0, cursor: 'pointer', textDecoration: 'underline', ':hover': {
                boxShadow: 'none',
            } }, style)} {...props} onClick={onClick}>
      {children}
    </text_1.Text>);
};
var ButtonLink = function (_a) {
    var to = _a.to, style = _a.style, activeStyle = _a.activeStyle, props = __rest(_a, ["to", "style", "activeStyle"]);
    var navigate = (0, useNavigate_1.useNavigate)();
    var path = to !== null && to !== void 0 ? to : '';
    var match = (0, react_router_1.useMatch)({ path: path });
    return (<button_1.Button className={function () {
            return String((0, css_1.css)(__assign(__assign(__assign({}, style), { '&[data-pressed]': activeStyle }), (match ? activeStyle : {}))));
        }} {...props} variant={props.buttonVariant} onPress={function (e) {
            var _a;
            (_a = props.onPress) === null || _a === void 0 ? void 0 : _a.call(props, e);
            navigate(path);
        }}/>);
};
var InternalLink = function (_a) {
    var to = _a.to, style = _a.style, activeStyle = _a.activeStyle, children = _a.children, isDisabled = _a.isDisabled;
    var path = to !== null && to !== void 0 ? to : '';
    var match = (0, react_router_1.useMatch)({ path: path });
    return (<react_router_1.NavLink to={path} className={(0, css_1.css)([styles_1.styles.smallText, style, match ? activeStyle : null])} onClick={function (e) {
            if (isDisabled) {
                e.preventDefault();
            }
        }}>
      {children}
    </react_router_1.NavLink>);
};
function Link(props) {
    switch (props.variant) {
        case 'internal': {
            var _1 = props.variant, internalProps = __rest(props, ["variant"]);
            return <InternalLink {...internalProps}/>;
        }
        case 'external': {
            var _2 = props.variant, externalProps = __rest(props, ["variant"]);
            return <ExternalLink {...externalProps}/>;
        }
        case 'button': {
            var _3 = props.variant, buttonProps = __rest(props, ["variant"]);
            return <ButtonLink {...buttonProps}/>;
        }
        case 'text': {
            var _4 = props.variant, textProps = __rest(props, ["variant"]);
            return <TextLink {...textProps}/>;
        }
        default:
            throw new Error("Unrecognised Link variant.");
    }
}
