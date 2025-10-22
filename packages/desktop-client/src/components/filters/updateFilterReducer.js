"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFilterReducer = updateFilterReducer;
var rules_1 = require("loot-core/shared/rules");
function updateFilterReducer(state, action) {
    switch (action.type) {
        case 'set-op': {
            var type = rules_1.FIELD_TYPES.get(state.field);
            var value = state.value;
            if ((type === 'id' || type === 'string') &&
                (action.op === 'contains' ||
                    action.op === 'matches' ||
                    action.op === 'is' ||
                    action.op === 'doesNotContain' ||
                    action.op === 'isNot' ||
                    action.op === 'hasTags' ||
                    action.op === 'onBudget' ||
                    action.op === 'offBudget')) {
                // Clear out the value if switching between contains or
                // is/oneof for the id or string type
                value = null;
            }
            return __assign(__assign({}, state), { op: action.op, value: value });
        }
        case 'set-value': {
            var value = (0, rules_1.makeValue)(action.value, {
                type: rules_1.FIELD_TYPES.get(state.field),
            }).value;
            return __assign(__assign({}, state), { value: value });
        }
        default:
            throw new Error("Unhandled action type: ".concat(action.type));
    }
}
