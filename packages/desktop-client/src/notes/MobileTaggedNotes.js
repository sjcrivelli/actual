"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileTaggedNotes = MobileTaggedNotes;
var react_1 = require("react");
var text_1 = require("@actual-app/components/text");
var useTagCSS_1 = require("@desktop-client/hooks/useTagCSS");
function MobileTaggedNotes(_a) {
    var content = _a.content, tag = _a.tag, separator = _a.separator;
    var getTagCSS = (0, useTagCSS_1.useTagCSS)();
    return (<>
      <text_1.Text className={getTagCSS(tag, { compact: true })}>{content}</text_1.Text>
      {separator}
    </>);
}
