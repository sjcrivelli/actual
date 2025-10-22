"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = SidebarProvider;
exports.useSidebar = useSidebar;
// @ts-strict-ignore
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var SidebarContext = (0, react_1.createContext)(null);
function SidebarProvider(_a) {
    var children = _a.children;
    var floatingSidebar = (0, useGlobalPref_1.useGlobalPref)('floatingSidebar')[0];
    var _b = (0, react_1.useState)(true), hidden = _b[0], setHidden = _b[1];
    var width = (0, useResponsive_1.useResponsive)().width;
    var alwaysFloats = width < 668;
    var floating = floatingSidebar || alwaysFloats;
    return (<SidebarContext.Provider value={{ hidden: hidden, setHidden: setHidden, floating: floating, alwaysFloats: alwaysFloats }}>
      {children}
    </SidebarContext.Provider>);
}
function useSidebar() {
    var _a = (0, react_1.useContext)(SidebarContext), hidden = _a.hidden, setHidden = _a.setHidden, floating = _a.floating, alwaysFloats = _a.alwaysFloats;
    return (0, react_1.useMemo)(function () { return ({ hidden: hidden, setHidden: setHidden, floating: floating, alwaysFloats: alwaysFloats }); }, [hidden, setHidden, floating, alwaysFloats]);
}
