import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext, useState, useContext, useMemo, } from 'react';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
const SidebarContext = createContext(null);
export function SidebarProvider({ children }) {
    const [floatingSidebar] = useGlobalPref('floatingSidebar');
    const [hidden, setHidden] = useState(true);
    const { width } = useResponsive();
    const alwaysFloats = width < 668;
    const floating = floatingSidebar || alwaysFloats;
    return (_jsx(SidebarContext.Provider, { value: { hidden, setHidden, floating, alwaysFloats }, children: children }));
}
export function useSidebar() {
    const { hidden, setHidden, floating, alwaysFloats } = useContext(SidebarContext);
    return useMemo(() => ({ hidden, setHidden, floating, alwaysFloats }), [hidden, setHidden, floating, alwaysFloats]);
}
