"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedSizeList = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var memoize_one_1 = require("memoize-one");
var IS_SCROLLING_DEBOUNCE_INTERVAL = 150;
var defaultItemKey = function (index) { return index; };
var FixedSizeList = /** @class */ (function (_super) {
    __extends(FixedSizeList, _super);
    function FixedSizeList(props) {
        var _this = _super.call(this, props) || this;
        _this._resetIsScrollingTimeoutId = null;
        _this.anchored = null;
        _this.setRowAnimation = function (flag) {
            _this.animationEnabled = flag;
            var outerRef = _this._outerRef;
            if (outerRef) {
                if (_this.animationEnabled) {
                    outerRef.classList.add('animated');
                }
                else {
                    outerRef.classList.remove('animated');
                }
            }
        };
        _this.getItemOffset = function (index) { return index * _this.props.itemSize; };
        _this.getItemSize = function () { return _this.props.itemSize; };
        _this.getEstimatedTotalSize = function () { return _this.props.itemSize * _this.props.itemCount; };
        _this.getOffsetForIndexAndAlignment = function (index, align, scrollOffset) {
            var size = _this.props.height;
            var lastItemOffset = Math.max(0, _this.props.itemCount * _this.props.itemSize - size);
            var maxOffset = Math.min(lastItemOffset, index * _this.props.itemSize);
            var minOffset = Math.max(0, index * _this.props.itemSize - size + _this.props.itemSize);
            if (align === 'smart') {
                if (scrollOffset >= minOffset - size &&
                    scrollOffset <= maxOffset + size) {
                    align = 'auto';
                }
                else {
                    align = 'center';
                }
            }
            switch (align) {
                case 'start':
                    return maxOffset;
                case 'end':
                    return minOffset;
                case 'center': {
                    // "Centered" offset is usually the average of the min and max.
                    // But near the edges of the list, this doesn't hold true.
                    var middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
                    if (middleOffset < Math.ceil(size / 2)) {
                        return 0; // near the beginning
                    }
                    else if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
                        return lastItemOffset; // near the end
                    }
                    else {
                        return middleOffset;
                    }
                }
                case 'auto':
                default:
                    if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
                        return scrollOffset;
                    }
                    else if (scrollOffset < minOffset) {
                        return minOffset;
                    }
                    else {
                        return maxOffset;
                    }
            }
        };
        _this.getStartIndexForOffset = function (offset) {
            return Math.max(0, Math.min(_this.props.itemCount - 1, Math.floor(offset / _this.props.itemSize)));
        };
        _this.getStopIndexForStartIndex = function (startIndex, scrollOffset) {
            var offset = startIndex * _this.props.itemSize;
            var size = _this.props.height;
            var numVisibleItems = Math.ceil((size + scrollOffset - offset) / _this.props.itemSize);
            return Math.max(0, Math.min(_this.props.itemCount - 1, startIndex + numVisibleItems - 1));
        };
        _this._callOnItemsRendered = (0, memoize_one_1.default)(function (overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) {
            return _this.props.onItemsRendered({
                overscanStartIndex: overscanStartIndex,
                overscanStopIndex: overscanStopIndex,
                visibleStartIndex: visibleStartIndex,
                visibleStopIndex: visibleStopIndex,
            });
        });
        _this._callOnScroll = (0, memoize_one_1.default)(function (scrollDirection, scrollOffset, scrollUpdateWasRequested) {
            return _this.props.onScroll({
                scrollDirection: scrollDirection,
                scrollOffset: scrollOffset,
                scrollUpdateWasRequested: scrollUpdateWasRequested,
            });
        });
        // Lazily create and cache item styles while scrolling,
        // So that pure component sCU will prevent re-renders.
        // We maintain this cache, and pass a style prop rather than index,
        // So that List can clear cached styles and force item re-render if necessary.
        _this._getItemStyle = function (index) {
            var _a = _this.props, direction = _a.direction, itemSize = _a.itemSize, layout = _a.layout;
            var itemStyleCache = _this._getItemStyleCache(itemSize, layout, direction);
            var style;
            if (itemStyleCache.hasOwnProperty(index)) {
                style = itemStyleCache[index];
            }
            else {
                var offset = _this.getItemOffset(index);
                var size = _this.getItemSize();
                itemStyleCache[index] = style = {
                    position: 'absolute',
                    left: 0,
                    top: offset,
                    height: size,
                    width: '100%',
                };
            }
            return style;
        };
        _this._getItemStyleCache = (0, memoize_one_1.default)(function (_, __, ___) { return ({}); });
        _this._onScrollVertical = function (event) {
            var scrollTop = event.currentTarget.scrollTop;
            _this.setState(function (prevState) {
                if (prevState.scrollOffset === scrollTop) {
                    // Scroll position may have been updated by cDM/cDU,
                    // In which case we don't need to trigger another render,
                    // And we don't want to update state.isScrolling.
                    return null;
                }
                var scrollOffset = scrollTop;
                return {
                    isScrolling: true,
                    scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
                    scrollOffset: scrollOffset,
                    scrollUpdateWasRequested: false,
                };
            }, _this._resetIsScrollingDebounced);
        };
        _this._outerRefSetter = function (ref) {
            var outerRef = _this.props.outerRef;
            _this._outerRef = ref;
            if (outerRef != null &&
                typeof outerRef === 'object' &&
                outerRef.hasOwnProperty('current')) {
                outerRef.current = ref;
            }
        };
        _this._resetIsScrollingDebounced = function () {
            if (_this._resetIsScrollingTimeoutId !== null) {
                clearTimeout(_this._resetIsScrollingTimeoutId);
            }
            _this._resetIsScrollingTimeoutId = setTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
        };
        _this._resetIsScrolling = function () {
            _this._resetIsScrollingTimeoutId = null;
            _this.setState({ isScrolling: false }, function () {
                // Clear style cache after state update has been committed.
                // This way we don't break pure sCU for items that don't use isScrolling param.
                // @ts-expect-error fix me
                _this._getItemStyleCache(-1, null);
            });
        };
        _this.lastPositions = (0, react_1.createRef)();
        _this.lastPositions.current = new Map();
        _this.needsAnimationRerender = (0, react_1.createRef)();
        _this.needsAnimationRerender.current = false;
        _this.animationEnabled = false;
        _this.state = {
            isScrolling: false,
            scrollDirection: 'forward',
            scrollOffset: typeof _this.props.initialScrollOffset === 'number'
                ? _this.props.initialScrollOffset
                : 0,
            scrollUpdateWasRequested: false,
        };
        return _this;
    }
    FixedSizeList.prototype.scrollTo = function (scrollOffset) {
        var _this = this;
        scrollOffset = Math.max(0, scrollOffset);
        this.setState(function (prevState) {
            if (prevState.scrollOffset === scrollOffset) {
                return null;
            }
            _this.requestScrollUpdateHandled = false;
            return {
                scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
                scrollOffset: scrollOffset,
                scrollUpdateWasRequested: true,
            };
        }, this._resetIsScrollingDebounced);
    };
    FixedSizeList.prototype.scrollToItem = function (index, align) {
        if (align === void 0) { align = 'auto'; }
        var itemCount = this.props.itemCount;
        var scrollOffset = this.state.scrollOffset;
        index = Math.max(0, Math.min(index, itemCount - 1));
        this.scrollTo(this.getOffsetForIndexAndAlignment(index, align, scrollOffset));
    };
    FixedSizeList.prototype.componentDidMount = function () {
        var initialScrollOffset = this.props.initialScrollOffset;
        if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
            var outerRef = this._outerRef;
            outerRef = this._outerRef;
            outerRef.scrollTop = initialScrollOffset;
        }
        this._callPropsCallbacks();
    };
    FixedSizeList.prototype.getAnchoredScrollPos = function () {
        if (this.anchored && this.props.indexForKey && this._outerRef != null) {
            var index = this.props.indexForKey(this.anchored.key);
            var baseOffset = this.getOffsetForIndexAndAlignment(index, 'start');
            return baseOffset + this.anchored.offset;
        }
        return null;
    };
    FixedSizeList.prototype.componentDidUpdate = function () {
        var _this = this;
        var _a = this.state, scrollOffset = _a.scrollOffset, scrollUpdateWasRequested = _a.scrollUpdateWasRequested;
        var anchoredPos = this.getAnchoredScrollPos();
        if (anchoredPos != null) {
            var outerRef = this._outerRef;
            outerRef.scrollTop = anchoredPos;
        }
        else if (scrollUpdateWasRequested &&
            !this.requestScrollUpdateHandled &&
            this._outerRef != null) {
            this.requestScrollUpdateHandled = true;
            var outerRef = this._outerRef;
            outerRef.scrollTop = scrollOffset;
        }
        if (this.needsAnimationRerender.current) {
            this.needsAnimationRerender.current = false;
            this.rerenderTimeout = setTimeout(function () {
                _this.forceUpdate();
            }, 10);
        }
        this._callPropsCallbacks();
    };
    FixedSizeList.prototype.componentWillUnmount = function () {
        if (this._resetIsScrollingTimeoutId !== null) {
            clearTimeout(this._resetIsScrollingTimeoutId);
        }
    };
    FixedSizeList.prototype.render = function () {
        var _a = this.props, className = _a.className, height = _a.height, header = _a.header, innerRef = _a.innerRef, itemCount = _a.itemCount, renderRow = _a.renderRow, _b = _a.itemKey, itemKey = _b === void 0 ? defaultItemKey : _b, useIsScrolling = _a.useIsScrolling, width = _a.width;
        var isScrolling = this.state.isScrolling;
        var _c = this._getRangeToRender(), startIndex = _c[0], stopIndex = _c[1];
        var positions = new Map();
        var items = [];
        if (itemCount > 0) {
            for (var index = startIndex; index <= stopIndex; index++) {
                var key = itemKey(index);
                var style = this._getItemStyle(index);
                var lastPosition = this.lastPositions.current.get(key);
                var animating = false;
                positions.set(key, style.top);
                if (this.animationEnabled &&
                    lastPosition != null &&
                    lastPosition !== style.top) {
                    // A reorder has happened. Render it in the old place, then
                    // animate it to the new one
                    style = __assign(__assign({}, style), { top: lastPosition });
                    this.needsAnimationRerender.current = true;
                    animating = true;
                }
                items.push(renderRow({
                    index: index,
                    key: key,
                    style: style,
                    isScrolling: useIsScrolling ? isScrolling : undefined,
                    isAnimating: animating,
                }));
            }
        }
        this.lastPositions.current = positions;
        // Read this value AFTER items have been created,
        // So their actual sizes (if variable) are taken into consideration.
        var estimatedTotalSize = this.getEstimatedTotalSize();
        return (<div className={className} onScroll={this._onScrollVertical} ref={this._outerRefSetter} style={{
                height: height,
                width: width,
                overflow: 'hidden auto',
            }}>
        <view_1.View>{header}</view_1.View>
        <div ref={innerRef} style={{
                position: 'relative',
                height: estimatedTotalSize,
                width: '100%',
                pointerEvents: isScrolling ? 'none' : undefined,
            }}>
          {items}
        </div>
      </div>);
    };
    FixedSizeList.prototype.anchor = function () {
        var itemKey = this.props.itemKey || defaultItemKey;
        var outerRef = this._outerRef;
        var scrollOffset = outerRef ? outerRef.scrollTop : 0;
        var index = this.getStartIndexForOffset(scrollOffset);
        var key = itemKey(index);
        this.anchored = {
            key: key,
            offset: scrollOffset - this.getItemOffset(index),
        };
    };
    FixedSizeList.prototype.unanchor = function () {
        this.anchored = null;
    };
    FixedSizeList.prototype.isAnchored = function () {
        return this.anchored != null;
    };
    FixedSizeList.prototype._callPropsCallbacks = function () {
        if (typeof this.props.onItemsRendered === 'function') {
            var itemCount = this.props.itemCount;
            if (itemCount > 0) {
                var _a = this._getRangeToRender(), overscanStartIndex = _a[0], overscanStopIndex = _a[1], visibleStartIndex = _a[2], visibleStopIndex = _a[3];
                this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex);
            }
        }
        if (typeof this.props.onScroll === 'function') {
            var _b = this.state, scrollDirection = _b.scrollDirection, scrollOffset = _b.scrollOffset, scrollUpdateWasRequested = _b.scrollUpdateWasRequested;
            this._callOnScroll(scrollDirection, scrollOffset, scrollUpdateWasRequested);
        }
    };
    FixedSizeList.prototype._getRangeToRender = function () {
        var _a = this.props, itemCount = _a.itemCount, overscanCount = _a.overscanCount;
        var _b = this.state, isScrolling = _b.isScrolling, scrollDirection = _b.scrollDirection, originalScrollOffset = _b.scrollOffset;
        var anchoredPos = this.getAnchoredScrollPos();
        var scrollOffset = originalScrollOffset;
        if (anchoredPos != null) {
            scrollOffset = anchoredPos;
        }
        if (itemCount === 0) {
            return [0, 0, 0, 0];
        }
        var startIndex = this.getStartIndexForOffset(scrollOffset);
        var stopIndex = this.getStopIndexForStartIndex(startIndex, scrollOffset);
        // Overscan by one item in each direction so that tab/focus works.
        // If there isn't at least one extra item, tab loops back around.
        var overscanBackward = !isScrolling || scrollDirection === 'backward'
            ? Math.max(1, overscanCount)
            : 1;
        var overscanForward = !isScrolling || scrollDirection === 'forward'
            ? Math.max(1, overscanCount)
            : 1;
        return [
            Math.max(0, startIndex - overscanBackward),
            Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
            startIndex,
            stopIndex,
        ];
    };
    FixedSizeList.defaultProps = {
        direction: 'ltr',
        renderRow: undefined,
        layout: 'vertical',
        overscanCount: 2,
        useIsScrolling: false,
        headerHeight: 0,
    };
    return FixedSizeList;
}(react_1.PureComponent));
exports.FixedSizeList = FixedSizeList;
