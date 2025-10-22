"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesktopTaggedNotes = DesktopTaggedNotes;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var view_1 = require("@actual-app/components/view");
var useTagCSS_1 = require("@desktop-client/hooks/useTagCSS");
function DesktopTaggedNotes(_a) {
    var content = _a.content, onPress = _a.onPress, tag = _a.tag, separator = _a.separator;
    var getTagCSS = (0, useTagCSS_1.useTagCSS)();
    return (<view_1.View style={{ display: 'inline' }}>
      <button_1.Button variant="bare" className={getTagCSS(tag)} onPress={function () {
            onPress === null || onPress === void 0 ? void 0 : onPress(content);
        }}>
        {content}
      </button_1.Button>
      {separator}
    </view_1.View>);
}
