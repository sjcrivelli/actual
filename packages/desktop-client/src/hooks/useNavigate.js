"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigate = useNavigate;
var react_1 = require("react");
var react_router_1 = require("react-router");
function useNavigate() {
    var location = (0, react_router_1.useLocation)();
    var navigate = (0, react_router_1.useNavigate)();
    return (0, react_1.useCallback)(function (to, options) {
        if (options === void 0) { options = {}; }
        if (typeof to === 'number') {
            navigate(to);
        }
        else {
            var optionsWithPrevLocation = __assign(__assign({ replace: options.replace || isSamePath(to, location) ? true : undefined }, options), { state: __assign(__assign({}, options === null || options === void 0 ? void 0 : options.state), { previousLocation: location }) });
            var _a = location.state || {}, previousLocation = _a.previousLocation, previousOriginalState = __rest(_a, ["previousLocation"]);
            if (previousLocation == null ||
                !isSamePath(to, previousLocation) ||
                JSON.stringify((options === null || options === void 0 ? void 0 : options.state) || {}) !==
                    JSON.stringify(previousOriginalState)) {
                navigate(to, optionsWithPrevLocation);
            }
            else {
                // `to` is the same as the previous location. Just go back.
                navigate(-1);
            }
        }
    }, [navigate, location]);
}
function isSamePath(to, location) {
    return to === location.pathname + location.search + location.hash;
}
