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
exports.useSplitsExpanded = useSplitsExpanded;
exports.SplitsExpandedProvider = SplitsExpandedProvider;
var react_1 = require("react");
var SplitsExpandedContext = (0, react_1.createContext)({
    state: {
        mode: 'collapse',
        ids: new Set(),
        transitionId: null,
    },
    dispatch: function () {
        throw new Error('Unitialised context method called: dispatch');
    },
});
function useSplitsExpanded() {
    var data = (0, react_1.useContext)(SplitsExpandedContext);
    return (0, react_1.useMemo)(function () { return (__assign(__assign({}, data), { isExpanded: function (id) {
            return data.state.mode === 'collapse'
                ? !data.state.ids.has(id)
                : data.state.ids.has(id);
        } })); }, [data]);
}
function SplitsExpandedProvider(_a) {
    var children = _a.children, _b = _a.initialMode, initialMode = _b === void 0 ? 'expand' : _b;
    var previousState = (0, react_1.useRef)(null);
    var _c = (0, react_1.useReducer)(function (state, action) {
        switch (action.type) {
            case 'toggle-split': {
                var ids = new Set(__spreadArray([], state.ids, true));
                var id = action.id;
                if (ids.has(id)) {
                    ids.delete(id);
                }
                else {
                    ids.add(id);
                }
                return __assign(__assign({}, state), { ids: ids });
            }
            case 'open-split': {
                var ids = new Set(__spreadArray([], state.ids, true));
                var id = action.id;
                if (state.mode === 'collapse') {
                    ids.delete(id);
                }
                else {
                    ids.add(id);
                }
                return __assign(__assign({}, state), { ids: ids });
            }
            case 'close-splits': {
                var ids_1 = new Set(__spreadArray([], state.ids, true));
                action.ids.forEach(function (id) {
                    if (state.mode === 'collapse') {
                        ids_1.add(id);
                    }
                    else {
                        ids_1.delete(id);
                    }
                });
                return __assign(__assign({}, state), { ids: ids_1 });
            }
            case 'set-mode': {
                return __assign(__assign({}, state), { mode: action.mode, ids: new Set(), transitionId: null });
            }
            case 'switch-mode':
                if (state.transitionId != null) {
                    // You can only transition once at a time
                    return state;
                }
                return __assign(__assign({}, state), { mode: state.mode === 'expand' ? 'collapse' : 'expand', transitionId: action.id, ids: new Set() });
            case 'finish-switch-mode':
                return __assign(__assign({}, state), { transitionId: null });
        }
    }, previousState.current || {
        ids: new Set(),
        mode: initialMode,
        transitionId: null,
    }), state = _c[0], dispatch = _c[1];
    (0, react_1.useEffect)(function () {
        if (state.transitionId != null) {
            // This timeout allows animations to finish
            setTimeout(function () {
                dispatch({ type: 'finish-switch-mode' });
            }, 250);
        }
    }, [state.transitionId]);
    (0, react_1.useEffect)(function () {
        // In a finished state, cache the state
        if (state.transitionId == null) {
            previousState.current = state;
        }
    }, [state]);
    var value = (0, react_1.useMemo)(function () { return ({ state: state, dispatch: dispatch }); }, [state, dispatch]);
    return (<SplitsExpandedContext.Provider value={value}>
      {children}
    </SplitsExpandedContext.Provider>);
}
