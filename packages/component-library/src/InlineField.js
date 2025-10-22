"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineField = InlineField;
var css_1 = require("@emotion/css");
function InlineField(_a) {
    var label = _a.label, labelWidth = _a.labelWidth, children = _a.children, width = _a.width, style = _a.style;
    return (<label className={(0, css_1.css)([
            {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: '7px 0',
                width: width,
            },
            style,
        ])}>
      <div style={{
            width: labelWidth || 75,
            textAlign: 'right',
            paddingRight: 10,
        }}>
        {label}:
      </div>
      {children}
    </label>);
}
