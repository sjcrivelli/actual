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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.BudgetFileSelection = BudgetFileSelection;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var environment_1 = require("loot-core/shared/environment");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useInitialMount_1 = require("@desktop-client/hooks/useInitialMount");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useSyncServerStatus_1 = require("@desktop-client/hooks/useSyncServerStatus");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function getFileDescription(file, t) {
    if (file.state === 'unknown') {
        return t('This is a cloud-based file but its state is unknown because you ' +
            'are offline.');
    }
    if (file.encryptKeyId) {
        if (file.hasKey) {
            return t('This file is encrypted and you have key to access it.');
        }
        return t('This file is encrypted and you do not have the key for it.');
    }
    return null;
}
function isLocalFile(file) {
    return file.state === 'local';
}
function BudgetFileMenu(_a) {
    var onDelete = _a.onDelete, onClose = _a.onClose, onDuplicate = _a.onDuplicate;
    function onMenuSelect(type) {
        onClose();
        switch (type) {
            case 'delete':
                onDelete();
                break;
            case 'duplicate':
                if (onDuplicate)
                    onDuplicate();
                break;
            default:
        }
    }
    var t = (0, react_i18next_1.useTranslation)().t;
    var items = __spreadArray(__spreadArray([], (onDuplicate ? [{ name: 'duplicate', text: t('Duplicate') }] : []), true), [
        { name: 'delete', text: t('Delete') },
    ], false);
    return <menu_1.Menu onMenuSelect={onMenuSelect} items={items}/>;
}
function BudgetFileMenuButton(_a) {
    var onDelete = _a.onDelete, onDuplicate = _a.onDuplicate;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    return (<view_1.View>
      <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={function () {
            setMenuOpen(true);
        }}>
        <v1_1.SvgDotsHorizontalTriple style={{ width: 16, height: 16 }}/>
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }}>
        <BudgetFileMenu onDelete={onDelete} onClose={function () { return setMenuOpen(false); }} onDuplicate={onDuplicate}/>
      </popover_1.Popover>
    </view_1.View>);
}
function BudgetFileState(_a) {
    var file = _a.file, currentUserId = _a.currentUserId;
    var t = (0, react_i18next_1.useTranslation)().t;
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var Icon;
    var status;
    var color;
    var ownerName = null;
    var getOwnerDisplayName = (0, react_1.useCallback)(function () {
        var _a, _b, _c;
        if ('usersWithAccess' in file) {
            var userFound = (_a = file.usersWithAccess) === null || _a === void 0 ? void 0 : _a.find(function (f) { return f.owner; });
            if ((userFound === null || userFound === void 0 ? void 0 : userFound.userName) === '') {
                return 'Server';
            }
            return (_c = (_b = userFound === null || userFound === void 0 ? void 0 : userFound.displayName) !== null && _b !== void 0 ? _b : userFound === null || userFound === void 0 ? void 0 : userFound.userName) !== null && _c !== void 0 ? _c : t('Unassigned');
        }
        return t('Unknown');
    }, [file, t]);
    switch (file.state) {
        case 'unknown':
            Icon = v2_1.SvgCloudUnknown;
            status = t('Network unavailable');
            color = theme_1.theme.buttonNormalDisabledText;
            ownerName = t('Unknown');
            break;
        case 'remote':
            Icon = v1_1.SvgCloudDownload;
            status = t('Available for download');
            ownerName = getOwnerDisplayName();
            break;
        case 'local':
            Icon = v1_1.SvgFileDouble;
            status = t('Local');
            ownerName = t('You');
            break;
        case 'broken':
            ownerName = 'unknown';
            Icon = v1_1.SvgFileDouble;
            status = t('Local');
            ownerName = t('You');
            break;
        default:
            Icon = v1_1.SvgCloudCheck;
            status = t('Syncing');
            ownerName = getOwnerDisplayName();
            break;
    }
    var showOwnerContent = multiuserEnabled && file.owner !== currentUserId;
    return (<view_1.View style={{ width: '100%' }}>
      <view_1.View style={{
            color: color,
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 8,
        }}>
        <Icon style={{
            width: 18,
            height: 18,
            color: 'currentColor',
        }}/>

        <text_1.Text style={{ marginLeft: 5 }}>{status}</text_1.Text>
      </view_1.View>

      <view_1.View style={{ paddingTop: 10, flexDirection: 'row', width: '100%' }}>
        {showOwnerContent && (<view_1.View style={{ flexDirection: 'row' }}>
            <text_1.Text style={__assign(__assign(__assign({}, styles_1.styles.altMenuHeaderText), styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
              <react_i18next_1.Trans>Owner:</react_i18next_1.Trans>
            </text_1.Text>
            <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, paddingLeft: 10 })}>
              {ownerName}
            </text_1.Text>
          </view_1.View>)}
      </view_1.View>
    </view_1.View>);
}
function BudgetFileListItem(_a) {
    var quickSwitchMode = _a.quickSwitchMode, onSelect = _a.onSelect, onDelete = _a.onDelete, onDuplicate = _a.onDuplicate, currentUserId = _a.currentUserId, props = __rest(_a, ["quickSwitchMode", "onSelect", "onDelete", "onDuplicate", "currentUserId"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var selecting = (0, react_1.useRef)(false);
    function _onSelect(file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!selecting.current) return [3 /*break*/, 2];
                        selecting.current = true;
                        return [4 /*yield*/, onSelect(file)];
                    case 1:
                        _a.sent();
                        selecting.current = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    var file = props.value;
    if (!file) {
        return null;
    }
    return (<react_aria_components_1.GridListItem textValue={file.name} onAction={function () { return _onSelect(file); }} {...props}>
      <view_1.View className={(0, css_1.css)(__assign(__assign({}, styles_1.styles.shadow), { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: '5px 10px', padding: 15, cursor: 'pointer', borderRadius: 6, backgroundColor: theme_1.theme.buttonNormalBackground, '&:hover': {
                backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
            } }))}>
        <view_1.View title={getFileDescription(file, t) || ''} style={{ alignItems: 'flex-start', width: '100%' }}>
          <view_1.View style={{ flexDirection: 'row', width: '100%' }}>
            <text_1.Text style={{ fontSize: 16, fontWeight: 700 }}>{file.name}</text_1.Text>
            {multiuserEnabled && 'cloudFileId' in file && (<UserAccessForFile fileId={file.cloudFileId} currentUserId={currentUserId}/>)}
          </view_1.View>

          <BudgetFileState file={file} currentUserId={currentUserId}/>
        </view_1.View>

        <view_1.View style={{
            flex: '0 0 auto',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
          {file.encryptKeyId && (<v2_1.SvgKey style={{
                width: 13,
                height: 13,
                marginRight: 8,
                color: file.hasKey
                    ? theme_1.theme.formLabelText
                    : theme_1.theme.buttonNormalDisabledText,
            }}/>)}

          {!quickSwitchMode && (<BudgetFileMenuButton onDelete={function () { return onDelete(file); }} onDuplicate={'id' in file ? function () { return onDuplicate(file); } : undefined}/>)}
        </view_1.View>
      </view_1.View>
    </react_aria_components_1.GridListItem>);
}
function BudgetFileList(_a) {
    var files = _a.files, quickSwitchMode = _a.quickSwitchMode, onSelect = _a.onSelect, onDelete = _a.onDelete, onDuplicate = _a.onDuplicate, currentUserId = _a.currentUserId;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<react_aria_components_1.GridList aria-label={t('Budget files')} items={files} style={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
        }} renderEmptyState={function () { return (<text_1.Text style={__assign(__assign({}, styles_1.styles.mediumText), { textAlign: 'center', color: theme_1.theme.pageTextSubdued })}>
          <react_i18next_1.Trans>No budget files</react_i18next_1.Trans>
        </text_1.Text>); }}>
      {function (file) {
            var id = isLocalFile(file) ? file.id : file.cloudFileId;
            return (<BudgetFileListItem key={id} id={id} value={file} currentUserId={currentUserId} quickSwitchMode={quickSwitchMode} onSelect={onSelect} onDelete={onDelete} onDuplicate={onDuplicate}/>);
        }}
    </react_aria_components_1.GridList>);
}
function RefreshButton(_a) {
    var style = _a.style, onRefresh = _a.onRefresh;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    function _onRefresh() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, onRefresh()];
                    case 1:
                        _a.sent();
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    var Icon = loading ? AnimatedLoading_1.AnimatedLoading : v2_1.SvgRefreshArrow;
    return (<button_1.Button variant="bare" aria-label={t('Refresh')} style={__assign({ padding: 10 }, style)} onPress={_onRefresh}>
      <Icon style={{ width: 18, height: 18 }}/>
    </button_1.Button>);
}
function SettingsButton(_a) {
    var onOpenSettings = _a.onOpenSettings;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View>
      <button_1.Button variant="bare" aria-label={t('Settings')} onPress={function () {
            onOpenSettings();
        }} style={{ padding: 10 }}>
        <v1_1.SvgCog style={{ width: 18, height: 18 }}/>
      </button_1.Button>
    </view_1.View>);
}
function BudgetFileSelectionHeader(_a) {
    var quickSwitchMode = _a.quickSwitchMode, onRefresh = _a.onRefresh, onOpenSettings = _a.onOpenSettings;
    return (<view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 20,
        }}>
      <text_1.Text style={__assign({}, styles_1.styles.veryLargeText)}>
        <react_i18next_1.Trans>Files</react_i18next_1.Trans>
      </text_1.Text>
      {!quickSwitchMode && (<view_1.View style={{
                flexDirection: 'row',
                gap: '0.2rem',
            }}>
          {onRefresh && <RefreshButton onRefresh={onRefresh}/>}
          {(0, environment_1.isElectron)() && <SettingsButton onOpenSettings={onOpenSettings}/>}
        </view_1.View>)}
    </view_1.View>);
}
function BudgetFileSelection(_a) {
    var _b;
    var _this = this;
    var _c = _a.showHeader, showHeader = _c === void 0 ? true : _c, _d = _a.quickSwitchMode, quickSwitchMode = _d === void 0 ? false : _d;
    var dispatch = (0, redux_1.useDispatch)();
    var allFiles = (0, redux_1.useSelector)(function (state) { return state.budgetfiles.allFiles || []; });
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var id = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    var _e = (0, react_1.useState)(''), currentUserId = _e[0], setCurrentUserId = _e[1];
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    var serverStatus = (0, useSyncServerStatus_1.useSyncServerStatus)();
    var fetchUsers = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            try {
                setCurrentUserId((_a = userData === null || userData === void 0 ? void 0 : userData.userId) !== null && _a !== void 0 ? _a : '');
            }
            catch (error) {
                console.error('Failed to fetch users:', error);
            }
            return [2 /*return*/];
        });
    }); }, [userData === null || userData === void 0 ? void 0 : userData.userId]);
    (0, react_1.useEffect)(function () {
        if (multiuserEnabled && !(userData === null || userData === void 0 ? void 0 : userData.offline)) {
            fetchUsers();
        }
    }, [multiuserEnabled, userData === null || userData === void 0 ? void 0 : userData.offline, fetchUsers]);
    // Remote files do not have the 'id' field
    function isNonRemoteFile(file) {
        return file.state !== 'remote';
    }
    // Filter out the open file
    var files = id
        ? allFiles.filter(function (file) { return !isNonRemoteFile(file) || file.id !== id; })
        : allFiles;
    var _f = (0, react_1.useState)(false), creating = _f[0], setCreating = _f[1];
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowButtonStyle = isNarrowWidth
        ? {
            height: styles_1.styles.mobileMinHeight,
        }
        : {};
    var onCreate = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.testMode, testMode = _c === void 0 ? false : _c;
        if (!creating) {
            setCreating(true);
            dispatch((0, budgetfilesSlice_1.createBudget)({ testMode: testMode }));
        }
    };
    var refresh = function () {
        dispatch((0, usersSlice_1.getUserData)());
        dispatch((0, budgetfilesSlice_1.loadAllFiles)());
    };
    var initialMount = (0, useInitialMount_1.useInitialMount)();
    if (initialMount && quickSwitchMode) {
        refresh();
    }
    var onSelect = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var isRemoteFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isRemoteFile = file.state === 'remote';
                    if (!!id) return [3 /*break*/, 5];
                    if (!isRemoteFile) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.downloadBudget)({ cloudFileId: file.cloudFileId }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.loadBudget)({ id: file.id }))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 9];
                case 5:
                    if (!(!isRemoteFile && file.id !== id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.closeAndLoadBudget)({ fileId: file.id }))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    if (!isRemoteFile) return [3 /*break*/, 9];
                    return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.closeAndDownloadBudget)({ cloudFileId: file.cloudFileId }))];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); };
    return (<view_1.View style={__assign(__assign({ maxHeight: '100%', flex: 1, justifyContent: 'center' }, (quickSwitchMode
            ? {
                marginTop: 20,
                width: '100vw',
            }
            : { marginBottom: 20 })), (_b = {}, _b["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
            maxWidth: tokens_1.tokens.breakpoint_small,
            width: '100%',
        }, _b))}>
      {showHeader && (<BudgetFileSelectionHeader quickSwitchMode={quickSwitchMode} onRefresh={serverStatus === 'online' ? refresh : undefined} onOpenSettings={function () {
                return dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'files-settings' } }));
            }}/>)}
      <BudgetFileList files={files} currentUserId={currentUserId} quickSwitchMode={quickSwitchMode} onSelect={onSelect} onDelete={function (file) {
            return dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'delete-budget', options: { file: file } } }));
        }} onDuplicate={function (file) {
            if (file && 'id' in file) {
                dispatch((0, modalsSlice_1.pushModal)({
                    modal: {
                        name: 'duplicate-budget',
                        options: { file: file, managePage: true },
                    },
                }));
            }
            else {
                console.error('Attempted to duplicate a cloud file - only local files are supported. Cloud file:', file);
            }
        }}/>
      {!quickSwitchMode && (<view_1.View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'stretch',
                margin: 10,
                minHeight: 39,
            }}>
          <button_1.Button variant="bare" style={__assign(__assign({}, narrowButtonStyle), { marginLeft: 10, color: theme_1.theme.pageTextLight })} onPress={function () {
                dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'import' } }));
            }}>
            <react_i18next_1.Trans>Import file</react_i18next_1.Trans>
          </button_1.Button>

          <button_1.Button variant="primary" onPress={function () { return onCreate(); }} style={__assign(__assign({}, narrowButtonStyle), { marginLeft: 10 })}>
            <react_i18next_1.Trans>Create new file</react_i18next_1.Trans>
          </button_1.Button>

          {(0, environment_1.isNonProductionEnvironment)() && (<button_1.Button variant="primary" onPress={function () { return onCreate({ testMode: true }); }} style={__assign(__assign({}, narrowButtonStyle), { marginLeft: 10 })}>
              <react_i18next_1.Trans>Create test file</react_i18next_1.Trans>
            </button_1.Button>)}
        </view_1.View>)}
    </view_1.View>);
}
function UserAccessForFile(_a) {
    var _b, _c;
    var fileId = _a.fileId, currentUserId = _a.currentUserId;
    var t = (0, react_i18next_1.useTranslation)().t;
    var allFiles = (0, redux_1.useSelector)(function (state) { return state.budgetfiles.allFiles || []; });
    var remoteFiles = allFiles.filter(function (f) { return f.state === 'remote' || f.state === 'synced' || f.state === 'detached'; });
    var currentFile = remoteFiles.find(function (f) { return f.cloudFileId === fileId; });
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var usersAccess = (_b = currentFile === null || currentFile === void 0 ? void 0 : currentFile.usersWithAccess) !== null && _b !== void 0 ? _b : [];
    usersAccess = (_c = usersAccess === null || usersAccess === void 0 ? void 0 : usersAccess.filter(function (user) { return user.userName !== ''; })) !== null && _c !== void 0 ? _c : [];
    var sortedUsersAccess = __spreadArray([], usersAccess, true).sort(function (a, b) {
        var _a, _b;
        var textA = a.userId === currentUserId ? t('You') : ((_a = a.displayName) !== null && _a !== void 0 ? _a : a.userName);
        var textB = b.userId === currentUserId ? t('You') : ((_b = b.displayName) !== null && _b !== void 0 ? _b : b.userName);
        return textA.localeCompare(textB);
    });
    return (<view_1.View>
      {multiuserEnabled &&
            usersAccess.length > 0 &&
            !(sortedUsersAccess.length === 1 && sortedUsersAccess[0].owner) && (<view_1.View style={{
                marginLeft: '5px',
                alignSelf: 'center',
            }}>
            <tooltip_1.Tooltip content={<view_1.View style={{
                    margin: 5,
                }}>
                  <text_1.Text style={__assign(__assign(__assign({}, styles_1.styles.altMenuHeaderText), styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
                    File shared with:
                  </text_1.Text>
                  <view_1.View style={{
                    padding: 0,
                }}>
                    {sortedUsersAccess.map(function (user) {
                    var _a;
                    return (<view_1.View key={user.userId} style={{ flexDirection: 'row' }}>
                        <v1_1.SvgUser style={{
                            width: 10,
                            height: 10,
                            opacity: 0.7,
                            marginTop: 3,
                            marginRight: 5,
                        }}/>
                        <view_1.View style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, margin: 0, listStylePosition: 'inside' })}>
                          {user.userId === currentUserId
                            ? t('You')
                            : ((_a = user.displayName) !== null && _a !== void 0 ? _a : user.userName)}
                        </view_1.View>
                      </view_1.View>);
                })}
                  </view_1.View>
                </view_1.View>} placement="bottom end">
              <v1_1.SvgUserGroup style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                opacity: 0.7,
            }}/>
            </tooltip_1.Tooltip>
          </view_1.View>)}
    </view_1.View>);
}
