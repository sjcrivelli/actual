import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
/**
 * Hook to get and set a specific URL search parameter value
 */
export function useUrlParam(name) {
    const [searchParams, setSearchParams] = useSearchParams();
    const setParam = useCallback((value, opts) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (value == null || value === '') {
                next.delete(name);
            }
            else {
                next.set(name, value);
            }
            return next;
        }, opts);
    }, [name, setSearchParams]);
    return [searchParams.get(name), setParam];
}
