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
exports.AlignedText = AlignedText;
var Block_1 = require("./Block");
var View_1 = require("./View");
function AlignedText(_a) {
    var left = _a.left, right = _a.right, style = _a.style, leftStyle = _a.leftStyle, rightStyle = _a.rightStyle, _b = _a.truncate, truncate = _b === void 0 ? 'left' : _b, nativeProps = __rest(_a, ["left", "right", "style", "leftStyle", "rightStyle", "truncate"]);
    var truncateStyle = {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    };
    return (<View_1.View style={__assign({ flexDirection: 'row', alignItems: 'center' }, style)} {...nativeProps}>
      <Block_1.Block style={__assign(__assign({ marginRight: 10 }, (truncate === 'left' && truncateStyle)), leftStyle)}>
        {left}
      </Block_1.Block>
      <Block_1.Block style={__assign(__assign({ flex: 1, textAlign: 'right' }, (truncate === 'right' && truncateStyle)), rightStyle)}>
        {right}
      </Block_1.Block>
    </View_1.View>);
}
