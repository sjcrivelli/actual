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
exports.Popover = void 0;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var css_1 = require("@emotion/css");
var styles_1 = require("./styles");
var Popover = function (_a) {
    var _b = _a.style, style = _b === void 0 ? {} : _b, shouldCloseOnInteractOutside = _a.shouldCloseOnInteractOutside, props = __rest(_a, ["style", "shouldCloseOnInteractOutside"]);
    var ref = (0, react_1.useRef)(null);
    var handleFocus = (0, react_1.useCallback)(function (e) {
        var _a, _b;
        if (!((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))) {
            (_b = props.onOpenChange) === null || _b === void 0 ? void 0 : _b.call(props, false);
        }
    }, [props]);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (!props.isNonModal)
            return;
        if (props.isOpen) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.addEventListener('focusout', handleFocus);
        }
        else {
            (_b = ref.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('focusout', handleFocus);
        }
    }, [handleFocus, props.isNonModal, props.isOpen]);
    return (<react_aria_components_1.Popover ref={ref} placement="bottom end" offset={1} className={(0, css_1.css)(__assign(__assign(__assign(__assign({}, styles_1.styles.tooltip), styles_1.styles.lightScrollbar), { padding: 0, userSelect: 'none' }), style))} shouldCloseOnInteractOutside={function (element) {
            if (shouldCloseOnInteractOutside) {
                return shouldCloseOnInteractOutside(element);
            }
            return true;
        }} {...props}/>);
};
exports.Popover = Popover;
