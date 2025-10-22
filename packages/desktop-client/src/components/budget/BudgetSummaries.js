"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetSummaries = BudgetSummaries;
var react_1 = require("react");
var react_spring_1 = require("react-spring");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var months_1 = require("loot-core/shared/months");
var MonthsContext_1 = require("./MonthsContext");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
function BudgetSummaries(_a) {
    var SummaryComponent = _a.SummaryComponent;
    var months = (0, react_1.useContext)(MonthsContext_1.MonthsContext).months;
    var _b = (0, react_1.useState)(0), widthState = _b[0], setWidthState = _b[1];
    var _c = (0, react_spring_1.useSpring)(function () { return ({
        x: 0,
        config: { mass: 3, tension: 600, friction: 80 },
    }); }), styles = _c[0], spring = _c[1];
    var containerRef = (0, useResizeObserver_1.useResizeObserver)((0, react_1.useCallback)(function (rect) {
        setWidthState(rect.width);
    }, []));
    var prevMonth0 = (0, react_1.useRef)(months[0]);
    var allMonths = __spreadArray([], months, true);
    allMonths.unshift((0, months_1.subMonths)(months[0], 1));
    allMonths.push((0, months_1.addMonths)(months[months.length - 1], 1));
    var monthWidth = widthState / months.length;
    (0, react_1.useLayoutEffect)(function () {
        var prevMonth = prevMonth0.current;
        var reversed = prevMonth > months[0];
        var offsetX = monthWidth;
        var from = reversed ? -offsetX * 2 : 0;
        if (prevMonth !== allMonths[0] && prevMonth !== allMonths[2]) {
            from = -offsetX;
        }
        var to = -offsetX;
        spring.start({ from: { x: from }, x: to });
    }, [months[0]]);
    (0, react_1.useLayoutEffect)(function () {
        prevMonth0.current = months[0];
    }, [months[0]]);
    (0, react_1.useLayoutEffect)(function () {
        spring.start({ from: { x: -monthWidth }, to: { x: -monthWidth } });
    }, [monthWidth]);
    return (<div className={(0, css_1.css)([
            { flex: 1, overflow: 'hidden' },
            months.length === 1 && {
                marginLeft: -4,
                marginRight: -4,
            },
        ])} ref={containerRef}>
      <react_spring_1.animated.div className="view" style={{
            flexDirection: 'row',
            width: widthState,
            willChange: 'transform',
            transform: styles.x.to(function (x) { return "translateX(".concat(x, "px)"); }),
        }}>
        {allMonths.map(function (month) {
            return (<view_1.View key={month} style={{
                    flex: "0 0 ".concat(monthWidth, "px"),
                    paddingLeft: 4,
                    paddingRight: 4,
                }}>
              <SummaryComponent month={month}/>
            </view_1.View>);
        })}
      </react_spring_1.animated.div>
    </div>);
}
