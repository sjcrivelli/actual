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
exports.GraphButton = void 0;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var GraphButton = function (_a) {
    var selected = _a.selected, children = _a.children, onSelect = _a.onSelect, title = _a.title, style = _a.style, disabled = _a.disabled;
    return (<tooltip_1.Tooltip placement="bottom start" content={<text_1.Text>{title}</text_1.Text>} style={__assign(__assign({}, styles_1.styles.tooltip), { lineHeight: 1.5, padding: '6px 10px' })}>
      <button_1.Button variant="bare" style={__assign(__assign({}, (selected && {
            backgroundColor: theme_1.theme.buttonBareBackgroundHover,
        })), style)} onPress={onSelect} isDisabled={disabled} aria-label={title}>
        {children}
      </button_1.Button>
    </tooltip_1.Tooltip>);
};
exports.GraphButton = GraphButton;
