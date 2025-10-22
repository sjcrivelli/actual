"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubLabel = SubLabel;
var react_1 = require("react");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
function SubLabel(_a) {
    var title = _a.title;
    return (<text_1.Text style={{ fontSize: 13, marginBottom: 3, color: theme_1.theme.pageText }}>
      {title}
    </text_1.Text>);
}
