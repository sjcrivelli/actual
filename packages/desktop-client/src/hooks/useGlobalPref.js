"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalPref = useGlobalPref;
var react_1 = require("react");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
function useGlobalPref(prefName, onSaveGlobalPrefs) {
    var dispatch = (0, redux_1.useDispatch)();
    var setGlobalPref = (0, react_1.useCallback)(function (value) {
        var _a;
        dispatch((0, prefsSlice_1.saveGlobalPrefs)({
            prefs: (_a = {},
                _a[prefName] = value,
                _a),
            onSaveGlobalPrefs: onSaveGlobalPrefs,
        }));
    }, [prefName, dispatch, onSaveGlobalPrefs]);
    var globalPref = (0, redux_1.useSelector)(function (state) { var _a; return (_a = state.prefs.global) === null || _a === void 0 ? void 0 : _a[prefName]; });
    return [globalPref, setGlobalPref];
}
