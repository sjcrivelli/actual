"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSyncedPref = useSyncedPref;
var react_1 = require("react");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
function useSyncedPref(prefName, options) {
    var dispatch = (0, redux_1.useDispatch)();
    var setPref = (0, react_1.useCallback)(function (value) {
        var _a;
        dispatch((0, prefsSlice_1.saveSyncedPrefs)({
            prefs: (_a = {}, _a[prefName] = value, _a),
            isGlobal: options === null || options === void 0 ? void 0 : options.isGlobal,
        }));
    }, [prefName, dispatch, options === null || options === void 0 ? void 0 : options.isGlobal]);
    var pref = (0, redux_1.useSelector)(function (state) { return state.prefs.synced[prefName]; });
    return [pref, setPref];
}
