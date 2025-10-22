"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiltersStack = FiltersStack;
var react_1 = require("react");
var stack_1 = require("@actual-app/components/stack");
var view_1 = require("@actual-app/components/view");
var AppliedFilters_1 = require("./AppliedFilters");
var SavedFilterMenuButton_1 = require("./SavedFilterMenuButton");
function FiltersStack(_a) {
    var conditions = _a.conditions, conditionsOp = _a.conditionsOp, onUpdateFilter = _a.onUpdateFilter, onDeleteFilter = _a.onDeleteFilter, onClearFilters = _a.onClearFilters, onReloadSavedFilter = _a.onReloadSavedFilter, filterId = _a.filterId, savedFilters = _a.savedFilters, onConditionsOpChange = _a.onConditionsOpChange;
    return (<view_1.View>
      <stack_1.Stack spacing={2} direction="row" justify="flex-start" align="flex-start">
        <AppliedFilters_1.AppliedFilters conditions={conditions} conditionsOp={conditionsOp} onConditionsOpChange={onConditionsOpChange} onUpdate={onUpdateFilter} onDelete={onDeleteFilter}/>
        <view_1.View style={{ flex: 1 }}/>
        <SavedFilterMenuButton_1.SavedFilterMenuButton conditions={conditions} conditionsOp={conditionsOp} filterId={filterId} onClearFilters={onClearFilters} onReloadSavedFilter={onReloadSavedFilter} savedFilters={savedFilters}/>
      </stack_1.Stack>
    </view_1.View>);
}
