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
exports.UserAccess = UserAccess;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var undo = require("loot-core/platform/client/undo");
var UserAccessHeader_1 = require("./UserAccessHeader");
var UserAccessRow_1 = require("./UserAccessRow");
var InfiniteScrollWrapper_1 = require("@desktop-client/components/common/InfiniteScrollWrapper");
var Link_1 = require("@desktop-client/components/common/Link");
var Search_1 = require("@desktop-client/components/common/Search");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function UserAccessContent(_a) {
    var _this = this;
    var isModal = _a.isModal, setLoading = _a.setLoading;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)([]), allAccess = _b[0], setAllAccess = _b[1];
    var _c = (0, react_1.useState)(0), page = _c[0], setPage = _c[1];
    var _d = (0, react_1.useState)(''), filter = _d[0], setFilter = _d[1];
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var filteredAccesses = (0, react_1.useMemo)(function () {
        return (filter === ''
            ? allAccess
            : allAccess.filter(function (access) {
                var _a;
                return (_a = access === null || access === void 0 ? void 0 : access.displayName.toLowerCase().includes(filter.toLowerCase())) !== null && _a !== void 0 ? _a : false;
            })).slice(0, 100 + page * 50);
    }, [allAccess, filter, page]);
    var _e = (0, react_1.useState)(null), hoveredUserAccess = _e[0], setHoveredUserAccess = _e[1];
    var onSearchChange = (0, react_1.useCallback)(function (value) {
        setFilter(value);
        setPage(0);
    }, [setFilter]);
    var loadAccess = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, sortUsers, loadedAccess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, (0, fetch_1.send)('access-get-available-users', cloudFileId)];
                case 1:
                    data = _a.sent();
                    sortUsers = function (a, b) {
                        var _a, _b, _c, _d, _e, _f;
                        if (((_a = a.owner) !== null && _a !== void 0 ? _a : 0) !== ((_b = b.owner) !== null && _b !== void 0 ? _b : 0)) {
                            return ((_c = b.owner) !== null && _c !== void 0 ? _c : 0) - ((_d = a.owner) !== null && _d !== void 0 ? _d : 0);
                        }
                        return ((_e = a.displayName) !== null && _e !== void 0 ? _e : '').localeCompare((_f = b.displayName) !== null && _f !== void 0 ? _f : '');
                    };
                    if ('error' in data) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                id: 'error',
                                title: t('Error getting available users'),
                                sticky: true,
                                message: data.error,
                            },
                        }));
                        return [2 /*return*/, []];
                    }
                    loadedAccess = data
                        .map(function (user) { return (__assign(__assign({}, user), { displayName: user.displayName || user.userName })); })
                        .sort(sortUsers);
                    setAllAccess(loadedAccess);
                    return [2 /*return*/, loadedAccess];
            }
        });
    }); }, [cloudFileId, dispatch, setLoading, t]);
    var loadOwner = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var file, owner;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('get-user-file-info', cloudFileId)];
                case 1:
                    file = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : {
                        usersWithAccess: [],
                    };
                    owner = file === null || file === void 0 ? void 0 : file.usersWithAccess.filter(function (user) { return user.owner; });
                    if (owner.length > 0) {
                        return [2 /*return*/, owner[0]];
                    }
                    return [2 /*return*/, null];
            }
        });
    }); }, [cloudFileId]);
    (0, react_1.useEffect)(function () {
        function loadData() {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            return [4 /*yield*/, loadAccess()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error loading user access data:', error_1);
                            return [3 /*break*/, 4];
                        case 3:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        loadData();
        return function () {
            undo.setUndoState('openModal', null);
        };
    }, [setLoading, loadAccess, loadOwner]);
    function loadMore() {
        setPage(function (page) { return page + 1; });
    }
    var onHover = (0, react_1.useCallback)(function (id) {
        setHoveredUserAccess(id);
    }, []);
    return (<view_1.View>
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
              Determine which users can view and manage your budgets
            </react_i18next_1.Trans>{' '}
            <Link_1.Link variant="external" to="https://actualbudget.org/docs/config/multi-user#user-access-management" linkColor="muted">
              <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
            </Link_1.Link>
          </text_1.Text>
        </view_1.View>
        <view_1.View style={{ flex: 1 }}/>
        <Search_1.Search placeholder={t('Filter users...')} value={filter} onChange={onSearchChange}/>
      </view_1.View>
      <view_1.View style={{ flex: 1 }}>
        <UserAccessHeader_1.UserAccessHeader />
        <InfiniteScrollWrapper_1.InfiniteScrollWrapper loadMore={loadMore}>
          <UserAccessList accesses={filteredAccesses} hoveredAccess={hoveredUserAccess} onHover={onHover}/>
        </InfiniteScrollWrapper_1.InfiniteScrollWrapper>
      </view_1.View>
      <view_1.View style={{
            paddingBlock: 15,
            paddingInline: isModal ? 13 : 0,
            borderTop: isModal && '1px solid ' + theme_1.theme.pillBorder,
            flexShrink: 0,
        }}/>
      <view_1.View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <LockToggle style={{ width: 16, height: 16 }} onToggleSave={function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadAccess()];
                    case 1:
                        _a.sent();
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }}/>
      </view_1.View>
    </view_1.View>);
}
function UserAccess(_a) {
    var isModal = _a.isModal, _b = _a.setLoading, setLoading = _b === void 0 ? function () { } : _b;
    return <UserAccessContent isModal={isModal} setLoading={setLoading}/>;
}
function UserAccessList(_a) {
    var accesses = _a.accesses, hoveredAccess = _a.hoveredAccess, onHover = _a.onHover;
    if (accesses.length === 0) {
        return null;
    }
    return (<view_1.View>
      {accesses.map(function (access) {
            var hovered = hoveredAccess === access.userId;
            return (<UserAccessRow_1.UserAccessRow key={access.userId} access={access} hovered={hovered} onHover={onHover}/>);
        })}
    </view_1.View>);
}
function LockToggle(_a) {
    var style = _a.style, onToggleSave = _a.onToggleSave;
    var _b = (0, react_1.useState)(false), hover = _b[0], setHover = _b[1];
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<button_1.Button onHoverStart={function () { return setHover(true); }} onHoverEnd={function () { return setHover(false); }} variant="primary" aria-label={t('Menu')} onPress={function () {
            return dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'transfer-ownership',
                    options: {
                        onSave: function () { return onToggleSave(); },
                    },
                },
            }));
        }}>
      {hover && <v1_1.SvgLockOpen style={__assign(__assign({}, style), { marginRight: 5 })}/>}
      {!hover && <v2_1.SvgLockClosed style={__assign(__assign({}, style), { marginRight: 5 })}/>}{' '}
      <react_i18next_1.Trans>Transfer ownership</react_i18next_1.Trans>
    </button_1.Button>);
}
