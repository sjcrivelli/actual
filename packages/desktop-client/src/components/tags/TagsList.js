"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsList = TagsList;
var react_1 = require("react");
var TagRow_1 = require("./TagRow");
var table_1 = require("@desktop-client/components/table");
function TagsList(_a) {
    var tags = _a.tags, selectedItems = _a.selectedItems, hoveredTag = _a.hoveredTag, onHover = _a.onHover;
    var tableNavigator = (0, table_1.useTableNavigator)(tags, [
        'select',
        'color',
        'description',
    ]);
    return (<table_1.Table navigator={tableNavigator} items={tags} backgroundColor="none" renderItem={function (_a) {
            var tag = _a.item, focusedField = _a.focusedField, onEdit = _a.onEdit;
            var hovered = hoveredTag === tag.id;
            var selected = selectedItems.has(tag.id);
            return (<TagRow_1.TagRow key={tag.id} tag={tag} hovered={hovered} selected={selected} onHover={onHover} focusedField={focusedField} onEdit={onEdit}/>);
        }}/>);
}
