"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondaryButtons = SecondaryButtons;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var SecondaryItem_1 = require("./SecondaryItem");
function SecondaryButtons(_a) {
    var buttons = _a.buttons;
    return (<view_1.View style={{
            flexShrink: 0,
            padding: '5px 0',
        }}>
      {buttons.map(function (item) { return (<SecondaryItem_1.SecondaryItem key={item.title} title={item.title} Icon={item.Icon} onClick={item.onClick}/>); })}
    </view_1.View>);
}
