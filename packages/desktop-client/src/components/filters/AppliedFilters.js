"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppliedFilters = AppliedFilters;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var ConditionsOpMenu_1 = require("./ConditionsOpMenu");
var FilterExpression_1 = require("./FilterExpression");
function AppliedFilters(_a) {
    var conditions = _a.conditions, onUpdate = _a.onUpdate, onDelete = _a.onDelete, conditionsOp = _a.conditionsOp, onConditionsOpChange = _a.onConditionsOpChange;
    return (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
        }}>
      <ConditionsOpMenu_1.ConditionsOpMenu conditionsOp={conditionsOp} onChange={onConditionsOpChange} conditions={conditions}/>
      {conditions.map(function (filter, i) { return (<FilterExpression_1.FilterExpression key={i} customName={filter.customName} field={filter.field} op={filter.op} value={filter.value} options={filter.options} onChange={function (newFilter) { return onUpdate(filter, newFilter); }} onDelete={function () { return onDelete(filter); }}/>); })}
    </view_1.View>);
}
