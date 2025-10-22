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
exports.UserDirectory = UserDirectory;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var undo = require("loot-core/platform/client/undo");
var UserDirectoryHeader_1 = require("./UserDirectoryHeader");
var UserDirectoryRow_1 = require("./UserDirectoryRow");
var InfiniteScrollWrapper_1 = require("@desktop-client/components/common/InfiniteScrollWrapper");
var Link_1 = require("@desktop-client/components/common/Link");
var Search_1 = require("@desktop-client/components/common/Search");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function useGetUserDirectoryErrors() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var getUserDirectoryErrors = (0, react_1.useCallback)(function (reason) {
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
                return t('Selected role does not exist, possibly a bug? Visit https://actualbudget.org/contact/ for support.');
            default:
                return t('An internal error occurred, sorry! Visit https://actualbudget.org/contact/ for support. (ref: {{reason}})', { reason: reason });
        }
    }, [t]);
    return { getUserDirectoryErrors: getUserDirectoryErrors };
}
function UserDirectoryContent(_a) {
    var _this = this;
    var isModal = _a.isModal, setLoading = _a.setLoading;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)([]), allUsers = _b[0], setAllUsers = _b[1];
    var _c = (0, react_1.useState)(0), page = _c[0], setPage = _c[1];
    var _d = (0, react_1.useState)(''), filter = _d[0], setFilter = _d[1];
    var dispatch = (0, redux_1.useDispatch)();
    var getUserDirectoryErrors = useGetUserDirectoryErrors().getUserDirectoryErrors;
    var filteredUsers = (0, react_1.useMemo)(function () {
        return (filter === ''
            ? allUsers
            : allUsers.filter(function (user) {
                return user.displayName.toLowerCase().includes(filter.toLowerCase()) ||
                    user.userName.toLowerCase().includes(filter.toLowerCase()) ||
                    user.role.toLowerCase().includes(filter.toLowerCase());
            })).slice(0, 100 + page * 50);
    }, [allUsers, filter, page]);
    var selectedInst = (0, useSelected_1.useSelected)('manage-users', allUsers, []);
    var selectedCount = selectedInst.items.size;
    var _e = (0, react_1.useState)(null), hoveredUser = _e[0], setHoveredUser = _e[1];
    var onSearchChange = (0, react_1.useCallback)(function (value) {
        setFilter(value);
        setPage(0);
    }, [setFilter]);
    var loadUsers = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var loadedUsers;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, (0, fetch_1.send)('users-get')];
                case 1:
                    loadedUsers = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : [];
                    if ('error' in loadedUsers) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                id: 'error',
                                title: t('Error getting users'),
                                sticky: true,
                                message: getUserDirectoryErrors(loadedUsers.error),
                            },
                        }));
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    setAllUsers(loadedUsers);
                    setLoading(false);
                    return [2 /*return*/, loadedUsers];
            }
        });
    }); }, [dispatch, getUserDirectoryErrors, setLoading, t]);
    (0, react_1.useEffect)(function () {
        function loadData() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, loadUsers()];
                        case 1:
                            _a.sent();
                            setLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadData();
        return function () {
            undo.setUndoState('openModal', null);
        };
    }, [setLoading, loadUsers]);
    function loadMore() {
        setPage(function (page) { return page + 1; });
    }
    var onDeleteSelected = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var res, error, someDeletionsFailed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, (0, fetch_1.send)('user-delete-all', __spreadArray([], selectedInst.items, true))];
                case 1:
                    res = _a.sent();
                    error = res['error'];
                    someDeletionsFailed = res['someDeletionsFailed'];
                    if (error || someDeletionsFailed) {
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
                        else {
                            dispatch((0, notificationsSlice_1.addNotification)({
                                notification: {
                                    type: 'error',
                                    title: t('Something happened while deleting users'),
                                    sticky: true,
                                    message: getUserDirectoryErrors(error),
                                },
                            }));
                        }
                    }
                    return [4 /*yield*/, loadUsers()];
                case 2:
                    _a.sent();
                    selectedInst.dispatch({ type: 'select-none' });
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [
        setLoading,
        selectedInst,
        loadUsers,
        dispatch,
        t,
        getUserDirectoryErrors,
    ]);
    var onEditUser = (0, react_1.useCallback)(function (user) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'edit-user',
                options: {
                    user: user,
                    onSave: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadUsers()];
                                case 1:
                                    _a.sent();
                                    setLoading(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                },
            },
        }));
    }, [dispatch, loadUsers, setLoading]);
    function onAddUser() {
        var _this = this;
        var user = {
            userName: '',
            role: null,
            enabled: true,
            displayName: '',
        };
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'edit-user',
                options: {
                    user: user,
                    onSave: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadUsers()];
                                case 1:
                                    _a.sent();
                                    setLoading(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                },
            },
        }));
    }
    var onHover = (0, react_1.useCallback)(function (id) {
        setHoveredUser(id);
    }, []);
    return (<useSelected_1.SelectedProvider instance={selectedInst}>
      <view_1.View>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: isModal ? '0 13px 15px' : '0 0 15px',
            flexShrink: 0,
        }}>
          <view_1.View style={{
            color: theme_1.theme.pageTextLight,
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
        }}>
            <text_1.Text>
              <react_i18next_1.Trans>
                Manage and view users who can create new budgets or be invited
                to access existing ones.
              </react_i18next_1.Trans>{' '}
              <Link_1.Link variant="external" to="https://actualbudget.org/docs/config/multi-user/" linkColor="muted">
                <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
              </Link_1.Link>
            </text_1.Text>
          </view_1.View>
          <view_1.View style={{ flex: 1 }}/>
          <Search_1.Search placeholder={t('Filter users...')} value={filter} onChange={onSearchChange}/>
        </view_1.View>

        <view_1.View style={{ flex: 1 }}>
          <UserDirectoryHeader_1.UserDirectoryHeader />
          <InfiniteScrollWrapper_1.InfiniteScrollWrapper loadMore={loadMore}>
            {filteredUsers.length === 0 ? (<EmptyMessage text={t('No users')} style={{ marginTop: 15 }}/>) : (<UsersList users={filteredUsers} selectedItems={selectedInst.items} hoveredUser={hoveredUser} onHover={onHover} onEditUser={onEditUser}/>)}
          </InfiniteScrollWrapper_1.InfiniteScrollWrapper>
        </view_1.View>
        <view_1.View style={{
            paddingBlock: 15,
            paddingInline: isModal ? 13 : 0,
            borderTop: isModal && '1px solid ' + theme_1.theme.pillBorder,
            flexShrink: 0,
        }}>
          <stack_1.Stack direction="row" align="center" justify="flex-end" spacing={2}>
            {selectedInst.items.size > 0 && (<button_1.Button onPress={onDeleteSelected}>
                <react_i18next_1.Trans count={selectedCount}>
                  Delete {{ selectedCount: selectedCount }} users
                </react_i18next_1.Trans>
              </button_1.Button>)}
            <button_1.Button variant="primary" onPress={onAddUser}>
              <react_i18next_1.Trans>Add new user</react_i18next_1.Trans>
            </button_1.Button>
          </stack_1.Stack>
        </view_1.View>
      </view_1.View>
    </useSelected_1.SelectedProvider>);
}
function EmptyMessage(_a) {
    var text = _a.text, style = _a.style;
    return (<view_1.View style={__assign({ textAlign: 'center', color: theme_1.theme.pageTextSubdued, fontStyle: 'italic', fontSize: 13, marginTop: 5 }, style)}>
      {text}
    </view_1.View>);
}
function UserDirectory(_a) {
    var isModal = _a.isModal, _b = _a.setLoading, setLoading = _b === void 0 ? function () { } : _b;
    return <UserDirectoryContent isModal={isModal} setLoading={setLoading}/>;
}
function UsersList(_a) {
    var users = _a.users, selectedItems = _a.selectedItems, hoveredUser = _a.hoveredUser, onHover = _a.onHover, onEditUser = _a.onEditUser;
    if (users.length === 0) {
        return null;
    }
    return (<view_1.View>
      {users.map(function (user) {
            var hovered = hoveredUser === user.id;
            var selected = selectedItems.has(user.id);
            return (<UserDirectoryRow_1.UserDirectoryRow key={user.id} user={user} hovered={hovered} selected={selected} onHover={onHover} onEditUser={onEditUser}/>);
        })}
    </view_1.View>);
}
