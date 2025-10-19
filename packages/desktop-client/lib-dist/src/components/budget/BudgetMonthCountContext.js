import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext, useContext, useState, } from 'react';
const BudgetMonthCountContext = createContext(null);
export function BudgetMonthCountProvider({ children, }) {
    const [displayMax, setDisplayMax] = useState(1);
    return (_jsx(BudgetMonthCountContext.Provider, { value: { displayMax, setDisplayMax }, children: children }));
}
export function useBudgetMonthCount() {
    return useContext(BudgetMonthCountContext);
}
