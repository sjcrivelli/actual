import { useState, useRef, useLayoutEffect } from 'react';
import { useSheetName } from './useSheetName';
import { useSpreadsheet } from './useSpreadsheet';
export function useSheetValue(binding, onChange) {
    const { sheetName, fullSheetName } = useSheetName(binding);
    const memoizedBinding = useMemoizedBinding(() => typeof binding === 'string'
        ? { name: binding, value: undefined, query: undefined }
        : binding, binding);
    const spreadsheet = useSpreadsheet();
    const [result, setResult] = useState({
        name: fullSheetName,
        value: memoizedBinding.value ? memoizedBinding.value : null,
    });
    const latestOnChange = useRef(onChange);
    latestOnChange.current = onChange;
    const latestValue = useRef(result.value);
    latestValue.current = result.value;
    useLayoutEffect(() => {
        let isMounted = true;
        const unbind = spreadsheet.bind(sheetName, memoizedBinding, newResult => {
            if (!isMounted) {
                return;
            }
            const newCastedResult = {
                name: newResult.name,
                // TODO: Spreadsheets, SheetNames, SheetFields, etc must be moved to the loot-core package
                value: newResult.value,
            };
            if (latestOnChange.current) {
                latestOnChange.current(newCastedResult);
            }
            if (newResult.value !== latestValue.current) {
                setResult(newCastedResult);
            }
        });
        return () => {
            isMounted = false;
            unbind();
        };
    }, [spreadsheet, sheetName, memoizedBinding]);
    return result.value;
}
function useMemoizedBinding(memoBinding, key) {
    const ref = useRef(null);
    const bindingName = typeof key === 'string' ? key : key.name;
    const bindingValue = typeof key === 'string' ? undefined : key.value;
    const serializedBindingQuery = typeof key === 'string' ? undefined : key.query?.serializeAsString();
    if (!ref.current ||
        bindingName !== ref.current.key.name ||
        bindingValue !== ref.current.key.value ||
        serializedBindingQuery !== ref.current.key.serializedQuery) {
        // This should not update the binding reference if the binding name, value, and query values are the same.
        // Since query objects are immutable, we compare the serialized query string to make sure that we don't cause
        // a re-render whenever a new query object with the same parameter values (QueryState) is passed in.
        ref.current = {
            key: {
                name: bindingName,
                value: bindingValue,
                serializedQuery: serializedBindingQuery,
            },
            value: memoBinding(),
        };
    }
    return ref.current.value;
}
