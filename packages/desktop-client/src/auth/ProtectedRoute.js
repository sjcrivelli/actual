"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedRoute = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var view_1 = require("@actual-app/components/view");
var AuthProvider_1 = require("./AuthProvider");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var redux_1 = require("@desktop-client/redux");
var ProtectedRoute = function (_a) {
    var element = _a.element, permission = _a.permission, validateOwner = _a.validateOwner;
    var hasPermission = (0, AuthProvider_1.useAuth)().hasPermission;
    var _b = (0, react_1.useState)(false), permissionGranted = _b[0], setPermissionGranted = _b[1];
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var allFiles = (0, redux_1.useSelector)(function (state) { return state.budgetfiles.allFiles || []; });
    var remoteFiles = allFiles.filter(function (f) {
        return f.state === 'remote' || f.state === 'synced' || f.state === 'detached';
    });
    var currentFile = remoteFiles.find(function (f) { return f.cloudFileId === cloudFileId; });
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    (0, react_1.useEffect)(function () {
        var hasRequiredPermission = hasPermission(permission);
        setPermissionGranted(hasRequiredPermission);
        if (!hasRequiredPermission && validateOwner) {
            if (currentFile) {
                setPermissionGranted(currentFile.usersWithAccess.some(function (u) { return u.userId === (userData === null || userData === void 0 ? void 0 : userData.userId); }));
            }
        }
    }, [
        cloudFileId,
        permission,
        validateOwner,
        hasPermission,
        currentFile,
        userData,
    ]);
    return permissionGranted ? (element) : (<view_1.View style={{
            margin: '50px',
        }}>
      <h3>
        <react_i18next_1.Trans>You don’t have permission to view this page</react_i18next_1.Trans>
      </h3>
    </view_1.View>);
};
exports.ProtectedRoute = ProtectedRoute;
