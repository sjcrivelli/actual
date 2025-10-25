"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
var react_1 = require("react");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var redux_1 = require("@desktop-client/redux");
var AuthContext = (0, react_1.createContext)(undefined);
var AuthProvider = function (_a) {
    var children = _a.children;
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    var serverUrl = (0, ServerContext_1.useServerURL)();
    var hasPermission = function (permission) {
        var _a;
        if (!permission) {
            return true;
        }
        return (!serverUrl ||
            ((_a = userData === null || userData === void 0 ? void 0 : userData.permission) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === (permission === null || permission === void 0 ? void 0 : permission.toUpperCase()));
    };
    return (<AuthContext.Provider value={{ hasPermission: hasPermission }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
var useAuth = function () {
    var context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
