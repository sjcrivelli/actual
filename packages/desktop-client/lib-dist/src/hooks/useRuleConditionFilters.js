import { useCallback, useMemo, useState } from 'react';
export function useRuleConditionFilters(initialConditions = [], initialConditionsOp = 'and') {
    const [conditions, setConditions] = useState(initialConditions);
    const [conditionsOp, setConditionsOp] = useState(initialConditionsOp);
    const [saved, setSaved] = useState(null);
    const onApply = useCallback((conditionsOrSavedFilter) => {
        if (conditionsOrSavedFilter === null) {
            setConditions([]);
            setSaved(null);
        }
        else if ('conditions' in conditionsOrSavedFilter) {
            setConditions([...conditionsOrSavedFilter.conditions]);
            setConditionsOp(conditionsOrSavedFilter.conditionsOp);
            setSaved(conditionsOrSavedFilter.id);
        }
        else {
            setConditions(state => [...state, conditionsOrSavedFilter]);
            setSaved(null);
        }
    }, [setConditions]);
    const onUpdate = useCallback((oldFilter, updatedFilter) => {
        setConditions(state => state.map(f => (f === oldFilter ? updatedFilter : f)));
        setSaved(null);
    }, [setConditions]);
    const onDelete = useCallback((deletedFilter) => {
        setConditions(state => state.filter(f => f !== deletedFilter));
        setSaved(null);
    }, [setConditions]);
    return useMemo(() => ({
        conditions,
        saved,
        conditionsOp,
        onApply,
        onUpdate,
        onDelete,
        onConditionsOpChange: setConditionsOp,
    }), [
        conditions,
        saved,
        onApply,
        onUpdate,
        onDelete,
        setConditionsOp,
        conditionsOp,
    ]);
}
