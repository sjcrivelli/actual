"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposeNavigate = ExposeNavigate;
var react_1 = require("react");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function ExposeNavigate() {
    var navigate = (0, useNavigate_1.useNavigate)();
    (0, react_1.useLayoutEffect)(function () {
        window.__navigate = navigate;
    }, [navigate]);
    return null;
}
