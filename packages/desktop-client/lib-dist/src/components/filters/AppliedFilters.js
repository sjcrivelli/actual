import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
import { ConditionsOpMenu } from './ConditionsOpMenu';
import { FilterExpression } from './FilterExpression';
export function AppliedFilters({ conditions, onUpdate, onDelete, conditionsOp, onConditionsOpChange, }) {
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
        }, children: [_jsx(ConditionsOpMenu, { conditionsOp: conditionsOp, onChange: onConditionsOpChange, conditions: conditions }), conditions.map((filter, i) => (_jsx(FilterExpression, { customName: filter.customName, field: filter.field, op: filter.op, value: filter.value, options: filter.options, onChange: newFilter => onUpdate(filter, newFilter), onDelete: () => onDelete(filter) }, i)))] }));
}
