import { useCallback } from 'react';
/**
 * Returns a callback ref that calls `drag(element)` when the DOM node is attached.
 * @see https://github.com/react-dnd/react-dnd/issues/3655#issuecomment-2578808024
 */
export function useDragRef(drag) {
    return useCallback((element) => {
        if (element) {
            drag(element);
        }
    }, [drag]);
}
