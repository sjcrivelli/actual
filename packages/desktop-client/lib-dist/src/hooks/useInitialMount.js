import { useRef } from 'react';
export function useInitialMount() {
    const initial = useRef(true);
    if (initial.current) {
        initial.current = false;
        return true;
    }
    return false;
}
