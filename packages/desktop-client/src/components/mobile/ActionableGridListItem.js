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
exports.ActionableGridListItem = ActionableGridListItem;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_spring_1 = require("react-spring");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var react_2 = require("@use-gesture/react");
function ActionableGridListItem(_a) {
    var _b;
    var value = _a.value, textValue = _a.textValue, actions = _a.actions, _c = _a.actionsBackgroundColor, actionsBackgroundColor = _c === void 0 ? theme_1.theme.errorBackground : _c, _d = _a.actionsWidth, actionsWidth = _d === void 0 ? 100 : _d, children = _a.children, onAction = _a.onAction, props = __rest(_a, ["value", "textValue", "actions", "actionsBackgroundColor", "actionsWidth", "children", "onAction"]);
    var dragStartedRef = (0, react_1.useRef)(false);
    var _e = (0, react_1.useState)(false), isRevealed = _e[0], setIsRevealed = _e[1];
    var hasActions = !!actions;
    // Spring animation for the swipe
    var _f = (0, react_spring_1.useSpring)(function () { return ({
        x: 0,
        config: react_spring_1.config.stiff,
    }); }), x = _f[0].x, api = _f[1];
    // Handle drag gestures
    var bind = (0, react_2.useDrag)(function (_a) {
        var active = _a.active, mx = _a.movement[0], vx = _a.velocity[0];
        var startPos = isRevealed ? -actionsWidth : 0;
        var currentX = startPos + mx;
        if (active) {
            dragStartedRef.current = true;
            api.start({
                x: Math.max(-actionsWidth, Math.min(0, currentX)),
                onRest: function () {
                    dragStartedRef.current = false;
                },
            });
            return;
        }
        // Snap to revealed (-actionsWidth) or closed (0) based on position and velocity
        var shouldReveal = currentX < -actionsWidth / 2 ||
            (vx < -0.5 && currentX < -actionsWidth / 5);
        api.start({
            x: shouldReveal ? -actionsWidth : 0,
            onRest: function () {
                dragStartedRef.current = false;
                setIsRevealed(shouldReveal);
            },
        });
    }, {
        axis: 'x',
        from: function () { return [isRevealed ? -actionsWidth : 0, 0]; },
        enabled: hasActions,
    });
    // Prevent onAction from firing when dragging or if a drag was started
    var handleAction = function () {
        // Only allow action if no drag was started
        if (!dragStartedRef.current) {
            onAction === null || onAction === void 0 ? void 0 : onAction();
        }
    };
    return (<react_aria_components_1.GridListItem {...props} value={value} textValue={textValue} style={__assign(__assign({}, styles_1.styles.mobileListItem), { padding: 0, backgroundColor: hasActions
                ? actionsBackgroundColor
                : ((_b = styles_1.styles.mobileListItem.backgroundColor) !== null && _b !== void 0 ? _b : 'transparent'), overflow: 'hidden' })}>
      <react_spring_1.animated.div {...(hasActions ? bind() : {})} style={__assign(__assign({}, (hasActions
            ? { transform: x.to(function (v) { return "translate3d(".concat(v, "px,0,0)"); }) }
            : {})), { display: 'flex', touchAction: hasActions ? 'pan-y' : 'auto', cursor: hasActions ? 'grab' : 'pointer' })}>
        {/* Main content */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: theme_1.theme.tableBackground,
            minWidth: '100%',
            padding: 16,
        }} onClick={handleAction}>
          {children}
        </div>

        {/* Actions that appear when swiped */}
        {hasActions && (<div style={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: actionsBackgroundColor,
                minWidth: actionsWidth,
            }}>
            {actions}
          </div>)}
      </react_spring_1.animated.div>
    </react_aria_components_1.GridListItem>);
}
