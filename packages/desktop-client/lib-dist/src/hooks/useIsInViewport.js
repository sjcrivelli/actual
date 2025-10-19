import { useEffect, useMemo, useState } from 'react';
/**
 * Check if the given element (by ref) is visible in the viewport.
 */
export function useIsInViewport(ref) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)), []);
    useEffect(() => {
        const view = ref.current;
        if (!view) {
            return;
        }
        observer.observe(view);
        return () => {
            observer.disconnect();
        };
    }, [ref, observer]);
    return isIntersecting;
}
