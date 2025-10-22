"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessRow = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var forms_1 = require("@desktop-client/components/forms");
var table_1 = require("@desktop-client/components/table");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
exports.UserAccessRow = (0, react_1.memo)(function (_a) {
    var _b;
    var access = _a.access, hovered = _a.hovered, onHover = _a.onHover;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var backgroundFocus = hovered;
    var _c = (0, react_1.useState)(access.owner === 1 || access.haveAccess === 1), marked = _c[0], setMarked = _c[1];
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var handleAccessToggle = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newValue, error, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newValue = !marked;
                    if (!newValue) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, fetch_1.send)('access-add', {
                            fileId: cloudFileId,
                            userId: access.userId,
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        handleError(error);
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, fetch_1.send)('access-delete-all', {
                        fileId: cloudFileId,
                        ids: [access.userId],
                    })];
                case 3:
                    result = _a.sent();
                    if ('someDeletionsFailed' in result && result.someDeletionsFailed) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                title: t('Access Revocation Incomplete'),
                                message: t('Some access permissions were not revoked successfully.'),
                                sticky: true,
                            },
                        }));
                    }
                    _a.label = 4;
                case 4:
                    setMarked(newValue);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleError = function (error) {
        if (error === 'token-expired') {
            dispatch((0, notificationsSlice_1.addNotification)({
                notification: {
                    type: 'error',
                    id: 'login-expired',
                    title: t('Login expired'),
                    sticky: true,
                    message: (0, errors_1.getUserAccessErrors)(error),
                    button: {
                        title: t('Go to login'),
                        action: function () {
                            dispatch((0, usersSlice_1.signOut)());
                        },
                    },
                },
            }));
        }
        else {
            dispatch((0, notificationsSlice_1.addNotification)({
                notification: {
                    type: 'error',
                    title: t('Something happened while editing access'),
                    sticky: true,
                    message: (0, errors_1.getUserAccessErrors)(error),
                },
            }));
        }
    };
    return (<table_1.Row height="auto" style={{
            fontSize: 13,
            backgroundColor: backgroundFocus
                ? theme_1.theme.tableRowBackgroundHover
                : theme_1.theme.tableBackground,
        }} collapsed={true} onMouseEnter={function () { return onHover && onHover(access.userId); }} onMouseLeave={function () { return onHover && onHover(null); }}>
        <table_1.Cell width={100} plain style={{ padding: '0 15px', paddingLeft: 5, alignItems: 'center' }}>
          <forms_1.Checkbox defaultChecked={marked} disabled={access.owner === 1} onClick={handleAccessToggle}/>
        </table_1.Cell>
        <table_1.Cell name="displayName" width="flex" plain style={{ color: theme_1.theme.tableText }}>
          <view_1.View style={{
            alignSelf: 'flex-start',
            padding: '3px 5px',
        }}>
            <span>{(_b = access.displayName) !== null && _b !== void 0 ? _b : access.userName}</span>
          </view_1.View>
        </table_1.Cell>
        <table_1.Cell name="displayName" width={100} plain style={{ color: theme_1.theme.tableText }}>
          <view_1.View style={{ padding: '0 15px', paddingLeft: 5, alignItems: 'center' }}>
            <forms_1.Checkbox checked={access.owner === 1} disabled={access.owner === 1}/>
          </view_1.View>
        </table_1.Cell>
      </table_1.Row>);
});
exports.UserAccessRow.displayName = 'UserRow';
