"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
const react_1 = require("react");
const styles_1 = require("./styles");
const Text_1 = require("./Text");
const theme_1 = require("./theme");
exports.Label = (0, react_1.forwardRef)(({ title, style }, ref) => {
    return (<Text_1.Text ref={ref} style={{
            ...styles_1.styles.text,
            color: theme_1.theme.tableRowHeaderText,
            textAlign: 'right',
            fontSize: 14,
            marginBottom: 2,
            ...style,
        }}>
        {title}
      </Text_1.Text>);
});
exports.Label.displayName = 'Label';
