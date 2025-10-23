"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paragraph = Paragraph;
const css_1 = require("@emotion/css");
function Paragraph({ style, isLast, children, ...props }) {
    return (<div {...props} className={(0, css_1.css)([
            !isLast && { marginBottom: 15 },
            style,
            {
                lineHeight: '1.5em',
            },
        ])}>
      {children}
    </div>);
}
