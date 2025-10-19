import { useCallback } from 'react';
export function useMergedRefs(...refs) {
    return useCallback((value) => {
        [...refs].forEach(ref => {
            if (typeof ref === 'function') {
                ref(value);
            }
            else if (ref != null && 'current' in ref) {
                ref.current = value;
            }
        });
    }, [refs]);
}
