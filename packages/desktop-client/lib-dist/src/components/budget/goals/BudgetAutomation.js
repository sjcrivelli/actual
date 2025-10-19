import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useReducer, useState } from 'react';
import { Stack } from '@actual-app/components/stack';
import { BudgetAutomationEditor } from './BudgetAutomationEditor';
import { BudgetAutomationReadOnly } from './BudgetAutomationReadOnly';
import { DEFAULT_PRIORITY, getInitialState, templateReducer } from './reducer';
const DEFAULT_TEMPLATE = {
    directive: 'template',
    type: 'simple',
    monthly: 0,
    priority: DEFAULT_PRIORITY,
};
export const BudgetAutomation = ({ onDelete, onSave, categories, schedules, readOnlyStyle, style, template, inline = false, }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [state, originalDispatch] = useReducer(templateReducer, getInitialState(template ?? DEFAULT_TEMPLATE));
    const dispatch = useCallback((action) => {
        originalDispatch(action);
        onSave?.();
    }, [originalDispatch, onSave]);
    const categoryNameMap = useMemo(() => {
        return categories.reduce((acc, group) => {
            for (const category of group.categories ?? []) {
                acc[category.id] = category.name;
            }
            return acc;
        }, {});
    }, [categories]);
    return (_jsxs(Stack, { direction: "column", spacing: inline ? 0 : 1, style: { ...style, minHeight: 'fit-content' }, children: [_jsx(BudgetAutomationReadOnly, { state: state, categoryNameMap: categoryNameMap, isEditing: isEditing, setIsEditing: setIsEditing, onDelete: onDelete, style: readOnlyStyle, inline: inline }), isEditing && (_jsx(BudgetAutomationEditor, { inline: inline, state: state, dispatch: dispatch, schedules: schedules, categories: categories }))] }));
};
