"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = Block;
const css_1 = require("@emotion/css");
function Block(props) {
    const { className = '', style, innerRef, ...restProps } = props;
    return (<div {...restProps} ref={innerRef} className={(0, css_1.cx)(className, (0, css_1.css)(style))}/>);
}
