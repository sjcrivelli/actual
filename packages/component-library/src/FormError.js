"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormError = FormError;
const View_1 = require("./View");
function FormError({ style, children }) {
    return (<View_1.View style={{ color: 'red', fontSize: 13, ...style }}>{children}</View_1.View>);
}
