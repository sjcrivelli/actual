"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactFiltersButton = CompactFiltersButton;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
function CompactFiltersButton(_a) {
    var onPress = _a.onPress;
    return (<button_1.Button variant="bare" onPress={onPress} style={{ minWidth: 20 }}>
      <v1_1.SvgFilter width={15} height={15} style={{ width: 15, height: 15, flexShrink: 0 }}/>
    </button_1.Button>);
}
