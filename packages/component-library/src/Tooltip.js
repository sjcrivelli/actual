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
exports.Tooltip = void 0;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var styles_1 = require("./styles");
var View_1 = require("./View");
var Tooltip = function (_a) {
    var children = _a.children, content = _a.content, _b = _a.triggerProps, triggerProps = _b === void 0 ? {} : _b, props = __rest(_a, ["children", "content", "triggerProps"]);
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), isHovered = _c[0], setIsHover = _c[1];
    var hoverTimeoutRef = (0, react_1.useRef)(null);
    var closeTimeoutRef = (0, react_1.useRef)(null);
    var handlePointerEnter = (0, react_1.useCallback)(function () {
        var _a;
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        var timeout = setTimeout(function () {
            setIsHover(true);
        }, (_a = triggerProps.delay) !== null && _a !== void 0 ? _a : 300);
        hoverTimeoutRef.current = timeout;
    }, [triggerProps.delay]);
    var handlePointerLeave = (0, react_1.useCallback)(function () {
        var _a;
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(function () {
            setIsHover(false);
        }, (_a = triggerProps.closeDelay) !== null && _a !== void 0 ? _a : 0);
    }, [triggerProps.closeDelay]);
    // Force closing the tooltip whenever the disablement state changes
    (0, react_1.useEffect)(function () {
        setIsHover(false);
    }, [triggerProps.isDisabled]);
    return (<View_1.View style={{ minHeight: 'auto', flexShrink: 0, maxWidth: '100%' }} ref={triggerRef} onMouseEnter={handlePointerEnter} onMouseLeave={handlePointerLeave}>
      <react_aria_components_1.TooltipTrigger isOpen={isHovered && !triggerProps.isDisabled} {...triggerProps}>
        {children}

        <react_aria_components_1.Tooltip triggerRef={triggerRef} style={styles_1.styles.tooltip} {...props}>
          {content}
        </react_aria_components_1.Tooltip>
      </react_aria_components_1.TooltipTrigger>
    </View_1.View>);
};
exports.Tooltip = Tooltip;
