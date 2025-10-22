"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContextMenu = useContextMenu;
var react_1 = require("react");
function useContextMenu() {
    var _a = (0, react_1.useState)(false), menuOpen = _a[0], setMenuOpen = _a[1];
    var _b = (0, react_1.useState)(false), asContextMenu = _b[0], setAsContextMenu = _b[1];
    var _c = (0, react_1.useState)({ crossOffset: 0, offset: 0 }), position = _c[0], setPosition = _c[1];
    var handleContextMenu = function (e) {
        e.preventDefault();
        setAsContextMenu(true);
        var rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            crossOffset: e.clientX - rect.left,
            offset: e.clientY - rect.bottom,
        });
        setMenuOpen(true);
    };
    var resetPosition = function (crossOffset, offset) {
        if (crossOffset === void 0) { crossOffset = 0; }
        if (offset === void 0) { offset = 0; }
        setPosition({ crossOffset: crossOffset, offset: offset });
    };
    return {
        menuOpen: menuOpen,
        setMenuOpen: function (open) {
            setMenuOpen(open);
            setAsContextMenu(false);
        },
        position: position,
        handleContextMenu: handleContextMenu,
        resetPosition: resetPosition,
        asContextMenu: asContextMenu,
    };
}
