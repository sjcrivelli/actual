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
exports.TransferOwnership = TransferOwnership;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function TransferOwnership(_a) {
    var _this = this;
    var originalOnSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    var _b = (0, react_1.useState)(''), userId = _b[0], setUserId = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)([]), availableUsers = _d[0], setAvailableUsers = _d[1];
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var allFiles = (0, redux_1.useSelector)(function (state) { return state.budgetfiles.allFiles || []; });
    var remoteFiles = allFiles.filter(function (f) { return f.state === 'remote' || f.state === 'synced' || f.state === 'detached'; });
    var currentFile = remoteFiles.find(function (f) { return f.cloudFileId === cloudFileId; });
    var dispatch = (0, redux_1.useDispatch)();
    var _e = (0, react_1.useState)(false), isTransferring = _e[0], setIsTransferring = _e[1];
    (0, react_1.useEffect)(function () {
        (0, fetch_1.send)('users-get').then(function (data) {
            if (!data) {
                setAvailableUsers([]);
            }
            else if ('error' in data) {
                dispatch((0, notificationsSlice_1.addNotification)({
                    notification: {
                        type: 'error',
                        title: t('Error getting users'),
                        message: t('Failed to complete ownership transfer. Please try again.'),
                        sticky: true,
                    },
                }));
            }
            else {
                setAvailableUsers(data
                    .filter(function (f) { return (currentFile === null || currentFile === void 0 ? void 0 : currentFile.owner) !== f.id; })
                    .map(function (user) { return [
                    user.id,
                    user.displayName
                        ? "".concat(user.displayName, " (").concat(user.userName, ")")
                        : user.userName,
                ]; }));
            }
        });
    }, [userData === null || userData === void 0 ? void 0 : userData.userId, currentFile === null || currentFile === void 0 ? void 0 : currentFile.owner, t, dispatch]);
    function onSave() {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!cloudFileId) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.send)('transfer-ownership', {
                                fileId: cloudFileId,
                                newUserId: userId,
                            })];
                    case 1:
                        response = _a.sent();
                        error_1 = (response || {}).error;
                        if (!error_1) {
                            originalOnSave === null || originalOnSave === void 0 ? void 0 : originalOnSave();
                        }
                        else {
                            setError((0, errors_1.getUserAccessErrors)(error_1));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        setError(t('Cloud file ID is missing.'));
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="transfer-ownership">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Transfer ownership')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <stack_1.Stack direction="row" style={{ marginTop: 10 }}>
            <forms_1.FormField style={{ flex: 1 }}>
              <forms_1.FormLabel title={t('User')} htmlFor="user-field"/>
              {availableUsers.length > 0 && (<view_1.View>
                  <select_1.Select options={availableUsers} onChange={function (newValue) {
                        setUserId(newValue);
                    }} value={userId} defaultLabel={t('Select a user')}/>
                  <label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, marginTop: 5 })}>
                    <react_i18next_1.Trans>
                      Select a user from the directory to designate as the new
                      budget owner.
                    </react_i18next_1.Trans>
                  </label>
                  <label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.errorText, marginTop: 5 })}>
                    {t('This action is irreversible, ownership of this budget file will only be able to be transferred by the server administrator or new owner.')}
                  </label>
                  <label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.errorText, marginTop: 5 })}>
                    <react_i18next_1.Trans>Proceed with caution.</react_i18next_1.Trans>
                  </label>
                </view_1.View>)}
              {availableUsers.length === 0 && (<text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, marginTop: 5 })}>
                  <react_i18next_1.Trans>No users available</react_i18next_1.Trans>
                </text_1.Text>)}
            </forms_1.FormField>
          </stack_1.Stack>

          <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ marginTop: 20 }}>
            {error && <text_1.Text style={{ color: theme_1.theme.errorText }}>{error}</text_1.Text>}
            <button_1.Button style={{ marginRight: 10 }} onPress={function () { return dispatch((0, modalsSlice_1.popModal)()); }}>
              <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
            </button_1.Button>

            <button_1.Button variant="primary" isDisabled={availableUsers.length === 0 || !userId || isTransferring} onPress={function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                setIsTransferring(true);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, onSave()];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.closeAndLoadBudget)({ fileId: currentFile.id }))];
                            case 3:
                                _a.sent();
                                close();
                                return [3 /*break*/, 5];
                            case 4:
                                error_2 = _a.sent();
                                dispatch((0, notificationsSlice_1.addNotification)({
                                    notification: {
                                        type: 'error',
                                        title: t('Failed to transfer ownership'),
                                        message: t('Failed to complete ownership transfer. Please try again.'),
                                        sticky: true,
                                    },
                                }));
                                setIsTransferring(false);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }}>
              {isTransferring ? t('Transferring...') : t('Transfer ownership')}
            </button_1.Button>
          </stack_1.Stack>
        </>);
        }}
    </Modal_1.Modal>);
}
