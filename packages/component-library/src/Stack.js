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
exports.Stack = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var Text_1 = require("./Text");
var View_1 = require("./View");
function getChildren(key, children) {
    return react_1.Children.toArray(children).reduce(function (list, child) {
        if (child) {
            if (typeof child === 'object' &&
                'type' in child &&
                child.type === react_1.Fragment) {
                return list.concat(getChildren(child.key, typeof child.props === 'object' && 'children' in child.props
                    ? child.props.children
                    : []));
            }
            list.push({ key: key + child['key'], child: child });
            return list;
        }
        return list;
    }, []);
}
exports.Stack = (0, react_1.forwardRef)(function (_a, ref) {
    var _b = _a.direction, direction = _b === void 0 ? 'column' : _b, align = _a.align, justify = _a.justify, _c = _a.spacing, spacing = _c === void 0 ? 3 : _c, children = _a.children, debug = _a.debug, style = _a.style, props = __rest(_a, ["direction", "align", "justify", "spacing", "children", "debug", "style"]);
    var isReversed = direction.endsWith('reverse');
    var isHorizontal = direction.startsWith('row');
    var validChildren = getChildren('', children);
    return (<View_1.View style={__assign({ flexDirection: direction, alignItems: align, justifyContent: justify }, style)} innerRef={ref} {...props}>
        {validChildren.map(function (_a, index) {
            var _b;
            var key = _a.key, child = _a.child;
            var isLastChild = validChildren.length === index + 1;
            var marginProp;
            if (isHorizontal) {
                marginProp = isReversed ? 'marginLeft' : 'marginRight';
            }
            else {
                marginProp = isReversed ? 'marginTop' : 'marginBottom';
            }
            return (0, react_1.cloneElement)(typeof child === 'string' ? <Text_1.Text>{child}</Text_1.Text> : child, {
                key: key,
                style: __assign(__assign(__assign({}, (debug && { borderWidth: 1, borderColor: 'red' })), (isLastChild ? null : (_b = {}, _b[marginProp] = spacing * 5, _b))), (child.props ? child.props.style : null)),
            });
        })}
      </View_1.View>);
});
exports.Stack.displayName = 'Stack';
