import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack } from '@actual-app/components/stack';
import { View } from '@actual-app/components/view';
import { AppliedFilters } from './AppliedFilters';
import { SavedFilterMenuButton, } from './SavedFilterMenuButton';
export function FiltersStack({ conditions, conditionsOp, onUpdateFilter, onDeleteFilter, onClearFilters, onReloadSavedFilter, filterId, savedFilters, onConditionsOpChange, }) {
    return (_jsx(View, { children: _jsxs(Stack, { spacing: 2, direction: "row", justify: "flex-start", align: "flex-start", children: [_jsx(AppliedFilters, { conditions: conditions, conditionsOp: conditionsOp, onConditionsOpChange: onConditionsOpChange, onUpdate: onUpdateFilter, onDelete: onDeleteFilter }), _jsx(View, { style: { flex: 1 } }), _jsx(SavedFilterMenuButton, { conditions: conditions, conditionsOp: conditionsOp, filterId: filterId, onClearFilters: onClearFilters, onReloadSavedFilter: onReloadSavedFilter, savedFilters: savedFilters })] }) }));
}
