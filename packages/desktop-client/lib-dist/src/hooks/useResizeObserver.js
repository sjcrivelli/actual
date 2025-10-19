import { useRef, useCallback } from 'react';
export function useResizeObserver(func) {
    const observer = useRef(undefined);
    if (!observer.current) {
        observer.current = new ResizeObserver(entries => {
            func(entries[0].contentRect);
        });
    }
    const elementRef = useCallback((el) => {
        observer.current?.disconnect();
        if (el) {
            observer.current?.observe(el, { box: 'border-box' });
        }
    }, []);
    return elementRef;
}
