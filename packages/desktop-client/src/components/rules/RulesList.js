"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesList = RulesList;
// @ts-strict-ignore
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var RuleRow_1 = require("./RuleRow");
function RulesList(_a) {
    var rules = _a.rules, selectedItems = _a.selectedItems, hoveredRule = _a.hoveredRule, onHover = _a.onHover, onEditRule = _a.onEditRule, onDeleteRule = _a.onDeleteRule;
    if (rules.length === 0) {
        return null;
    }
    return (<view_1.View>
      {rules.map(function (rule) {
            var hovered = hoveredRule === rule.id;
            var selected = selectedItems.has(rule.id);
            return (<RuleRow_1.RuleRow key={rule.id} rule={rule} hovered={hovered} selected={selected} onHover={onHover} onEditRule={onEditRule} onDeleteRule={onDeleteRule}/>);
        })}
    </view_1.View>);
}
