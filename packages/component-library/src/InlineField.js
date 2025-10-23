"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineField = InlineField;
const css_1 = require("@emotion/css");
function InlineField({ label, labelWidth, children, width, style, }) {
    return (<label className={(0, css_1.css)([
            {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: '7px 0',
                width,
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
