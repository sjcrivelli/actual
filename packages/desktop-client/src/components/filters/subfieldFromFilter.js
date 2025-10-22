"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subfieldFromFilter = subfieldFromFilter;
function subfieldFromFilter(_a) {
    var field = _a.field, options = _a.options, value = _a.value;
    if (field === 'date') {
        if (typeof value === 'string') {
            if (value.length === 7) {
                return 'month';
            }
            else if (value.length === 4) {
                return 'year';
            }
        }
    }
    if (field === 'amount') {
        if (options && options.inflow) {
            return 'amount-inflow';
        }
        else if (options && options.outflow) {
            return 'amount-outflow';
        }
    }
    return field;
}
