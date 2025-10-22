"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfiniteScrollWrapper = InfiniteScrollWrapper;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
/**
 * Wrapper around an infinitely loading list.
 * Calls the `loadMore` callback when the bottom of the list is reached
 * by scrolling to the bottom of the list.
 */
function InfiniteScrollWrapper(_a) {
    var loadMore = _a.loadMore, children = _a.children;
    var scrollRef = (0, react_1.useRef)(null);
    function onScroll(e) {
        if (loadMore &&
            Math.abs(e.currentTarget.scrollHeight -
                e.currentTarget.clientHeight -
                e.currentTarget.scrollTop) < 1) {
            loadMore();
        }
    }
    return (<view_1.View style={{
            flex: 1,
            outline: 'none',
            '& .animated .animated-row': { transition: '.25s transform' },
            // Hide the last border of the item in the table
            marginBottom: -1,
        }} tabIndex={1} data-testid="table">
      <view_1.View innerRef={scrollRef} style={{ maxWidth: '100%', overflow: 'auto' }} onScroll={onScroll}>
        <div>{children}</div>
      </view_1.View>
    </view_1.View>);
}
