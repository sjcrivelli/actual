import { useEffect, useRef } from 'react';
export function usePrevious(value) {
    const ref = useRef(undefined);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
