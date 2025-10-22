"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSyncedPrefs = useSyncedPrefs;
var react_1 = require("react");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
/** @deprecated: please use `useSyncedPref` (singular) */
function useSyncedPrefs() {
    var dispatch = (0, redux_1.useDispatch)();
    var setPrefs = (0, react_1.useCallback)(function (newValue) {
        dispatch((0, prefsSlice_1.saveSyncedPrefs)({ prefs: newValue }));
    }, [dispatch]);
    var prefs = (0, redux_1.useSelector)(function (state) { return state.prefs.synced; });
    return [prefs, setPrefs];
}
