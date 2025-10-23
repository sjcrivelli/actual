"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextOneLine = TextOneLine;
const Text_1 = require("./Text");
function TextOneLine({ children, ...props }) {
    return (<Text_1.Text {...props} style={{
            ...props.style,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
        }}>
      {children}
    </Text_1.Text>);
}
