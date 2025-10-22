"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMetadataPref = useMetadataPref;
var react_1 = require("react");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
function useMetadataPref(prefName) {
    var dispatch = (0, redux_1.useDispatch)();
    var setLocalPref = (0, react_1.useCallback)(function (value) {
        var _a;
        dispatch((0, prefsSlice_1.savePrefs)({ prefs: (_a = {}, _a[prefName] = value, _a) }));
    }, [prefName, dispatch]);
    var localPref = (0, redux_1.useSelector)(function (state) { var _a; return (_a = state.prefs.local) === null || _a === void 0 ? void 0 : _a[prefName]; });
    return [localPref, setLocalPref];
}
