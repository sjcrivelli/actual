import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from 'react';
import { View } from '@actual-app/components/view';
/**
 * Wrapper around an infinitely loading list.
 * Calls the `loadMore` callback when the bottom of the list is reached
 * by scrolling to the bottom of the list.
 */
export function InfiniteScrollWrapper({ loadMore, children, }) {
    const scrollRef = useRef(null);
    function onScroll(e) {
        if (loadMore &&
            Math.abs(e.currentTarget.scrollHeight -
                e.currentTarget.clientHeight -
                e.currentTarget.scrollTop) < 1) {
            loadMore();
        }
    }
    return (_jsx(View, { style: {
            flex: 1,
            outline: 'none',
            '& .animated .animated-row': { transition: '.25s transform' },
            // Hide the last border of the item in the table
            marginBottom: -1,
        }, tabIndex: 1, "data-testid": "table", children: _jsx(View, { innerRef: scrollRef, style: { maxWidth: '100%', overflow: 'auto' }, onScroll: onScroll, children: _jsx("div", { children: children }) }) }));
}
