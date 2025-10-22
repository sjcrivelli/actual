"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderTableRow = RenderTableRow;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
function RenderTableRow(_a) {
    var index = _a.index, parent_index = _a.parent_index, renderRow = _a.renderRow, mode = _a.mode, metadata = _a.metadata, style = _a.style;
    var child = metadata[index];
    var parent = parent_index !== undefined ? metadata[parent_index] : {};
    var item = parent_index === undefined
        ? child
        : (parent.categories && parent.categories[index]) ||
            {};
    return (<view_1.View>
      {renderRow({
            item: item,
            mode: mode,
            style: style,
        })}
    </view_1.View>);
}
