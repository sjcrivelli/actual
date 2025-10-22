"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRuleConditionFilters = useRuleConditionFilters;
var react_1 = require("react");
function useRuleConditionFilters(initialConditions, initialConditionsOp) {
    if (initialConditions === void 0) { initialConditions = []; }
    if (initialConditionsOp === void 0) { initialConditionsOp = 'and'; }
    var _a = (0, react_1.useState)(initialConditions), conditions = _a[0], setConditions = _a[1];
    var _b = (0, react_1.useState)(initialConditionsOp), conditionsOp = _b[0], setConditionsOp = _b[1];
    var _c = (0, react_1.useState)(null), saved = _c[0], setSaved = _c[1];
    var onApply = (0, react_1.useCallback)(function (conditionsOrSavedFilter) {
        if (conditionsOrSavedFilter === null) {
            setConditions([]);
            setSaved(null);
        }
        else if ('conditions' in conditionsOrSavedFilter) {
            setConditions(__spreadArray([], conditionsOrSavedFilter.conditions, true));
            setConditionsOp(conditionsOrSavedFilter.conditionsOp);
            setSaved(conditionsOrSavedFilter.id);
        }
        else {
            setConditions(function (state) { return __spreadArray(__spreadArray([], state, true), [conditionsOrSavedFilter], false); });
            setSaved(null);
        }
    }, [setConditions]);
    var onUpdate = (0, react_1.useCallback)(function (oldFilter, updatedFilter) {
        setConditions(function (state) {
            return state.map(function (f) { return (f === oldFilter ? updatedFilter : f); });
        });
        setSaved(null);
    }, [setConditions]);
    var onDelete = (0, react_1.useCallback)(function (deletedFilter) {
        setConditions(function (state) { return state.filter(function (f) { return f !== deletedFilter; }); });
        setSaved(null);
    }, [setConditions]);
    return (0, react_1.useMemo)(function () { return ({
        conditions: conditions,
        saved: saved,
        conditionsOp: conditionsOp,
        onApply: onApply,
        onUpdate: onUpdate,
        onDelete: onDelete,
        onConditionsOpChange: setConditionsOp,
    }); }, [
        conditions,
        saved,
        onApply,
        onUpdate,
        onDelete,
        setConditionsOp,
        conditionsOp,
    ]);
}
