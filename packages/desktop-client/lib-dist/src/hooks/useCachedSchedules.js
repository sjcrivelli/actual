import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, } from 'react';
import { useSchedules, } from './useSchedules';
const SchedulesContext = createContext(undefined);
export function SchedulesProvider({ query, children }) {
    const data = useSchedules({ query });
    return (_jsx(SchedulesContext.Provider, { value: data, children: children }));
}
export function useCachedSchedules() {
    const context = useContext(SchedulesContext);
    if (!context) {
        throw new Error('useCachedSchedules must be used within a SchedulesProvider');
    }
    return context;
}
