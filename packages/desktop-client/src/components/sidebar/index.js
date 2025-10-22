"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatableSidebar = FloatableSidebar;
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var view_1 = require("@actual-app/components/view");
var usehooks_ts_1 = require("usehooks-ts");
var Sidebar_1 = require("./Sidebar");
var SidebarProvider_1 = require("./SidebarProvider");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
function FloatableSidebar() {
    var floatingSidebar = (0, useGlobalPref_1.useGlobalPref)('floatingSidebar')[0];
    var sidebar = (0, SidebarProvider_1.useSidebar)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var sidebarShouldFloat = floatingSidebar || sidebar.alwaysFloats;
    var debouncedHideSidebar = (0, usehooks_ts_1.useDebounceCallback)(function () { return sidebar.setHidden(true); }, 350);
    return isNarrowWidth ? null : (<view_1.View onMouseOver={sidebarShouldFloat
            ? function (e) {
                debouncedHideSidebar.cancel();
                e.stopPropagation();
                sidebar.setHidden(false);
            }
            : undefined} onMouseLeave={sidebarShouldFloat ? function () { return debouncedHideSidebar(); } : undefined} style={{
            position: sidebarShouldFloat ? 'absolute' : undefined,
            top: 8,
            // If not floating, the -50 takes into account the transform below
            bottom: sidebarShouldFloat ? 8 : -50,
            zIndex: 1001,
            borderRadius: sidebarShouldFloat ? '0 6px 6px 0' : 0,
            overflow: 'hidden',
            boxShadow: !sidebarShouldFloat || sidebar.hidden
                ? 'none'
                : '0 15px 30px 0 rgba(0,0,0,0.25), 0 3px 15px 0 rgba(0,0,0,.5)',
            transform: "translateY(".concat(!sidebarShouldFloat ? -8 : 0, "px)\n                      translateX(").concat(sidebarShouldFloat && sidebar.hidden ? '-100' : '0', "%)"),
            transition: 'transform .5s, box-shadow .5s, border-radius .5s, bottom .5s',
        }}>
      <Sidebar_1.Sidebar />
    </view_1.View>);
}
