"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiltersButton = FiltersButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
function FiltersButton(_a) {
    var onPress = _a.onPress;
    return (<button_1.Button variant="bare" onPress={onPress}>
      <v1_1.SvgFilter style={{ width: 12, height: 12, marginRight: 5, flexShrink: 0 }}/>{' '}
      <react_i18next_1.Trans>Filter</react_i18next_1.Trans>
    </button_1.Button>);
}
