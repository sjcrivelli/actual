import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext, useContext, useState, useRef, } from 'react';
const SingleActiveEditFormContext = createContext(undefined);
export function SingleActiveEditFormProvider({ formName, children, }) {
    const [editingField, setEditingField] = useState(null);
    const cleanupRef = useRef(null);
    const runCleanup = () => {
        const editCleanup = cleanupRef.current;
        if (typeof editCleanup === 'function') {
            editCleanup?.();
        }
        cleanupRef.current = null;
    };
    const runAction = (action) => {
        cleanupRef.current = action?.();
    };
    const onClearActiveEdit = (delayMs) => {
        setTimeout(() => {
            runCleanup();
            setEditingField(null);
        }, delayMs);
    };
    const onActiveEdit = (field, action) => {
        runAction(action);
        setEditingField(field);
    };
    const onRequestActiveEdit = (field, action, options) => {
        if (editingField === field) {
            // Already active.
            return;
        }
        if (editingField) {
            onClearActiveEdit(options?.clearActiveEditDelayMs);
        }
        else {
            onActiveEdit(field, action);
        }
    };
    return (_jsx(SingleActiveEditFormContext.Provider, { value: {
            formName,
            editingField,
            onRequestActiveEdit,
            onClearActiveEdit,
        }, children: children }));
}
export function useSingleActiveEditForm() {
    const context = useContext(SingleActiveEditFormContext);
    if (!context) {
        return null;
    }
    return {
        formName: context.formName,
        editingField: context.editingField,
        onRequestActiveEdit: context.onRequestActiveEdit,
        onClearActiveEdit: context.onClearActiveEdit,
    };
}
