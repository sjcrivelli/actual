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
exports.EditUserFinanceApp = EditUserFinanceApp;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var user_1 = require("loot-core/shared/user");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function useGetUserDirectoryErrors() {
    var t = (0, react_i18next_1.useTranslation)().t;
    function getUserDirectoryErrors(reason) {
        switch (reason) {
            case 'unauthorized':
                return t('You are not logged in.');
            case 'token-expired':
                return t('Login expired, please log in again.');
            case 'user-cant-be-empty':
                return t('Please enter a value for the username; the field cannot be empty.');
            case 'role-cant-be-empty':
                return t('Select a role; the field cannot be empty.');
            case 'user-already-exists':
                return t('The username you entered already exists. Please choose a different username.');
            case 'not-all-deleted':
                return t('Not all users were deleted. Check if one of the selected users is the server owner.');
            case 'role-does-not-exists':
                return t('Selected role does not exists, possibly a bug? Visit https://actualbudget.org/contact/ for support.');
            default:
                return t('An internal error occurred, sorry! Visit https://actualbudget.org/contact/ for support. (ref: {{reason}})', { reason: reason });
        }
    }
    return { getUserDirectoryErrors: getUserDirectoryErrors };
}
function useSaveUser() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var getUserDirectoryErrors = useGetUserDirectoryErrors().getUserDirectoryErrors;
    function saveUser(method, user, setError) {
        return __awaiter(this, void 0, void 0, function () {
            var res, newId, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)(method, user)];
                    case 1:
                        res = _a.sent();
                        if (!('error' in res)) {
                            newId = res.id;
                            if (newId) {
                                user.id = newId;
                            }
                        }
                        else {
                            error = res.error;
                            setError(getUserDirectoryErrors(error));
                            if (error === 'token-expired') {
                                dispatch((0, notificationsSlice_1.addNotification)({
                                    notification: {
                                        type: 'error',
                                        id: 'login-expired',
                                        title: t('Login expired'),
                                        sticky: true,
                                        message: getUserDirectoryErrors(error),
                                        button: {
                                            title: t('Go to login'),
                                            action: function () {
                                                dispatch((0, usersSlice_1.signOut)());
                                            },
                                        },
                                    },
                                }));
                            }
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    }
    return { saveUser: saveUser };
}
function EditUserFinanceApp(_a) {
    var _this = this;
    var defaultUser = _a.user, originalOnSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    var saveUser = useSaveUser().saveUser;
    var isExistingUser = 'id' in defaultUser && !!defaultUser.id;
    return (<Modal_1.Modal name="edit-user">
      {function (_a) {
            var _b;
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={isExistingUser
                    ? t('Edit user {{userName}}', {
                        userName: (_b = defaultUser.displayName) !== null && _b !== void 0 ? _b : defaultUser.userName,
                    })
                    : t('Add user')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <EditUser defaultUser={defaultUser} onSave={function (method, user, setError) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saveUser(method, user, setError)];
                            case 1:
                                if (_a.sent()) {
                                    originalOnSave(user);
                                    close();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }}/>
        </>);
        }}
    </Modal_1.Modal>);
}
function EditUser(_a) {
    var _b, _c, _d;
    var defaultUser = _a.defaultUser, originalOnSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var isExistingUser = 'id' in defaultUser && !!defaultUser.id;
    var isOwner = 'owner' in defaultUser && defaultUser.owner;
    var _e = (0, react_1.useState)((_b = defaultUser.userName) !== null && _b !== void 0 ? _b : ''), userName = _e[0], setUserName = _e[1];
    var _f = (0, react_1.useState)((_c = defaultUser.displayName) !== null && _c !== void 0 ? _c : ''), displayName = _f[0], setDisplayName = _f[1];
    var _g = (0, react_1.useState)(defaultUser.enabled), enabled = _g[0], setEnabled = _g[1];
    var _h = (0, react_1.useState)((_d = defaultUser.role) !== null && _d !== void 0 ? _d : 'BASIC'), role = _h[0], setRole = _h[1];
    var _j = (0, react_1.useState)(''), error = _j[0], setError = _j[1];
    function onSave() {
        return __awaiter(this, void 0, void 0, function () {
            var user, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userName.trim()) {
                            setError(t('Username is required.'));
                            return [2 /*return*/];
                        }
                        if (!role) {
                            setError(t('Role is required.'));
                            return [2 /*return*/];
                        }
                        user = __assign(__assign({}, defaultUser), { id: isExistingUser ? defaultUser.id : '', owner: isOwner, userName: userName, displayName: displayName, enabled: enabled, role: role });
                        method = isExistingUser ? 'user-update' : 'user-add';
                        return [4 /*yield*/, originalOnSave(method, user, setError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<>
      <stack_1.Stack direction="row" style={{ marginTop: 10 }}>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Username')} htmlFor="name-field"/>
          <input_1.Input id="name-field" value={userName} onChangeValue={setUserName} style={{
            borderColor: theme_1.theme.buttonMenuBorder,
        }}/>
          <label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, marginTop: 5 })}>
            <react_i18next_1.Trans>The username registered within the OpenID provider.</react_i18next_1.Trans>
          </label>
        </forms_1.FormField>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
        }}>
          {' '}
          <forms_1.Checkbox id="enabled-field" checked={enabled} disabled={isOwner} style={{
            color: isOwner ? theme_1.theme.pageTextSubdued : 'inherit',
        }} onChange={function () { return setEnabled(!enabled); }}/>
          <label htmlFor="enabled-field" style={{ userSelect: 'none' }}>
            <react_i18next_1.Trans>Enabled</react_i18next_1.Trans>
          </label>
        </view_1.View>
      </stack_1.Stack>
      {isOwner && (<label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.errorText, marginTop: 5 })}>
          <react_i18next_1.Trans>
            Change this username with caution; it is the server owner.
          </react_i18next_1.Trans>
        </label>)}
      <stack_1.Stack direction="row" style={{ marginTop: 10 }}>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Display Name')} htmlFor="displayname-field"/>
          <input_1.Input id="displayname-field" value={displayName} onChangeValue={setDisplayName} placeholder={t('(Optional)')} style={{
            borderColor: theme_1.theme.buttonMenuBorder,
        }}/>
          <view_1.View style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, marginTop: 5 })}>
            <react_i18next_1.Trans>
              If left empty, it will be updated from your OpenID provider on the
              user&apos;s login, if available there.
            </react_i18next_1.Trans>
          </view_1.View>
          <view_1.View style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
            <react_i18next_1.Trans>
              When displaying user information, this will be shown instead of
              the username.
            </react_i18next_1.Trans>
          </view_1.View>
        </forms_1.FormField>
      </stack_1.Stack>
      <stack_1.Stack direction="row" style={{ marginTop: 10, width: '100px' }}>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Role')} htmlFor="role-field"/>
          <select_1.Select id="role-field" disabled={isOwner} options={Object.entries(user_1.PossibleRoles)} value={role} onChange={function (newValue) { return setRole(newValue); }} style={{
            borderColor: theme_1.theme.buttonMenuBorder,
        }}/>
        </forms_1.FormField>
      </stack_1.Stack>
      <RoleDescription />

      <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ marginTop: 20 }}>
        {error && <text_1.Text style={{ color: theme_1.theme.errorText }}>{error}</text_1.Text>}
        <button_1.Button variant="bare" style={{ marginRight: 10 }} onPress={function () { return dispatch((0, modalsSlice_1.popModal)()); }}>
          <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
        </button_1.Button>
        <button_1.Button variant="primary" onPress={onSave}>
          {isExistingUser ? t('Save') : t('Add')}
        </button_1.Button>
      </stack_1.Stack>
    </>);
}
var RoleDescription = function () {
    return (<view_1.View style={{ paddingTop: 10 }}>
      <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
        <react_i18next_1.Trans>
          In our user directory, each user is assigned a specific role that
          determines their permissions and capabilities within the system.
        </react_i18next_1.Trans>
      </text_1.Text>
      <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
        <react_i18next_1.Trans>
          Understanding these roles is essential for managing users and
          responsibilities effectively.
        </react_i18next_1.Trans>
      </text_1.Text>
      <view_1.View style={{ paddingTop: 5 }}>
        <label style={__assign(__assign(__assign({}, styles_1.styles.altMenuHeaderText), styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          <react_i18next_1.Trans>Basic</react_i18next_1.Trans>
        </label>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          <react_i18next_1.Trans>
            Users with the Basic role can create new budgets and be invited to
            collaborate on budgets created by others.
          </react_i18next_1.Trans>
        </text_1.Text>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          <react_i18next_1.Trans>
            This role is ideal for users who primarily need to manage their own
            budgets and participate in shared budget activities.
          </react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>
      <view_1.View style={{ paddingTop: 10 }}>
        <label style={__assign(__assign(__assign({}, styles_1.styles.altMenuHeaderText), styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          <react_i18next_1.Trans>Admin</react_i18next_1.Trans>
        </label>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          <react_i18next_1.Trans>
            Can do everything that Basic users can. In addition, they have the
            ability to add new users to the directory and access budget files
            from all users.
          </react_i18next_1.Trans>
        </text_1.Text>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          <react_i18next_1.Trans>
            Can also assign ownership of a budget to another person, ensuring
            efficient budget management.
          </react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>
    </view_1.View>);
};
