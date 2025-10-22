"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetMonthCountProvider = BudgetMonthCountProvider;
exports.useBudgetMonthCount = useBudgetMonthCount;
// @ts-strict-ignore
var react_1 = require("react");
var BudgetMonthCountContext = (0, react_1.createContext)(null);
function BudgetMonthCountProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(1), displayMax = _b[0], setDisplayMax = _b[1];
    return (<BudgetMonthCountContext.Provider value={{ displayMax: displayMax, setDisplayMax: setDisplayMax }}>
      {children}
    </BudgetMonthCountContext.Provider>);
}
function useBudgetMonthCount() {
    return (0, react_1.useContext)(BudgetMonthCountContext);
}
