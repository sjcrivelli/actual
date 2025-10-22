"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollProvider = ScrollProvider;
exports.useScrollListener = useScrollListener;
var react_1 = require("react");
var debounce_1 = require("lodash/debounce");
var ScrollContext = (0, react_1.createContext)(undefined);
function ScrollProvider(_a) {
    var scrollableRef = _a.scrollableRef, isDisabled = _a.isDisabled, _b = _a.delayMs, delayMs = _b === void 0 ? 250 : _b, children = _a.children;
    var previousScrollX = (0, react_1.useRef)(undefined);
    var scrollX = (0, react_1.useRef)(undefined);
    var previousScrollY = (0, react_1.useRef)(undefined);
    var scrollY = (0, react_1.useRef)(undefined);
    var scrollWidth = (0, react_1.useRef)(undefined);
    var scrollHeight = (0, react_1.useRef)(undefined);
    var clientWidth = (0, react_1.useRef)(undefined);
    var clientHeight = (0, react_1.useRef)(undefined);
    var listeners = (0, react_1.useRef)([]);
    var hasScrolledToEnd = (0, react_1.useCallback)(function (direction, tolerance) {
        if (tolerance === void 0) { tolerance = 1; }
        var isAtStart = function (currentCoordinate) {
            return currentCoordinate !== undefined && currentCoordinate <= tolerance;
        };
        var isAtEnd = function (totalSize, currentCoordinate, viewportSize) {
            return totalSize !== undefined &&
                currentCoordinate !== undefined &&
                viewportSize !== undefined &&
                totalSize - currentCoordinate <= viewportSize + tolerance;
        };
        switch (direction) {
            case 'up': {
                return isAtStart(scrollY.current);
            }
            case 'down': {
                return isAtEnd(scrollHeight.current, scrollY.current, clientHeight.current);
            }
            case 'left': {
                return isAtStart(scrollX.current);
            }
            case 'right': {
                return isAtEnd(scrollWidth.current, scrollX.current, clientWidth.current);
            }
            default:
                return false;
        }
    }, []);
    var isScrolling = (0, react_1.useCallback)(function (direction) {
        switch (direction) {
            case 'up':
                return (previousScrollY.current !== undefined &&
                    scrollY.current !== undefined &&
                    previousScrollY.current > scrollY.current);
            case 'down':
                return (previousScrollY.current !== undefined &&
                    scrollY.current !== undefined &&
                    previousScrollY.current < scrollY.current);
            case 'left':
                return (previousScrollX.current !== undefined &&
                    scrollX.current !== undefined &&
                    previousScrollX.current > scrollX.current);
            case 'right':
                return (previousScrollX.current !== undefined &&
                    scrollX.current !== undefined &&
                    previousScrollX.current < scrollX.current);
            default:
                return false;
        }
    }, []);
    var listenToScroll = (0, react_1.useMemo)(function () {
        return (0, debounce_1.default)(function (e) {
            var target = e.target;
            if (target instanceof Element) {
                previousScrollX.current = scrollX.current;
                scrollX.current = target.scrollLeft;
                scrollWidth.current = target.scrollWidth;
                clientWidth.current = target.clientWidth;
                previousScrollY.current = scrollY.current;
                scrollY.current = target.scrollTop;
                scrollHeight.current = target.scrollHeight;
                clientHeight.current = target.clientHeight;
                var currentScrollX_1 = scrollX.current;
                var currentScrollY_1 = scrollY.current;
                if (currentScrollX_1 !== undefined && currentScrollY_1 !== undefined) {
                    listeners.current.forEach(function (listener) {
                        return listener({
                            scrollX: currentScrollX_1,
                            scrollY: currentScrollY_1,
                            isScrolling: isScrolling,
                            hasScrolledToEnd: hasScrolledToEnd,
                        });
                    });
                }
            }
        }, delayMs);
    }, [delayMs, hasScrolledToEnd, isScrolling]);
    (0, react_1.useEffect)(function () {
        var toCancel = listenToScroll;
        return function () { return toCancel.cancel(); };
    }, [listenToScroll]);
    (0, react_1.useEffect)(function () {
        if (isDisabled) {
            return;
        }
        var ref = scrollableRef.current;
        ref === null || ref === void 0 ? void 0 : ref.addEventListener('scroll', listenToScroll, {
            capture: true,
            passive: true,
        });
        return function () {
            return ref === null || ref === void 0 ? void 0 : ref.removeEventListener('scroll', listenToScroll, {
                capture: true,
            });
        };
    }, [isDisabled, listenToScroll, scrollableRef]);
    var registerScrollListener = (0, react_1.useCallback)(function (listener) {
        listeners.current.push(listener);
        return function () {
            listeners.current = listeners.current.filter(function (l) { return l !== listener; });
        };
    }, []);
    return (<ScrollContext.Provider value={{ registerScrollListener: registerScrollListener }}>
      {children}
    </ScrollContext.Provider>);
}
/**
 * A hook to register a listener when the user scrolls within a ScrollProvider.
 *
 * @param listener The scroll listener to register. It is important to wrap this function
 * in useCallback to avoid unnecessary unregistering and reregistering on each render.
 */
function useScrollListener(listener) {
    var context = (0, react_1.useContext)(ScrollContext);
    if (!context) {
        throw new Error('useScrollListener must be used within a ScrollProvider');
    }
    var registerScrollListener = context.registerScrollListener;
    (0, react_1.useEffect)(function () {
        return registerScrollListener(listener);
    }, [listener, registerScrollListener]);
}
