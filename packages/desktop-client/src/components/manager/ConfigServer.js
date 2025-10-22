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
exports.ElectronServerConfig = ElectronServerConfig;
exports.ConfigServer = ConfigServer;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var label_1 = require("@actual-app/components/label");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var environment_1 = require("loot-core/shared/environment");
var common_1 = require("./subscribe/common");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function ElectronServerConfig(_a) {
    var _this = this;
    var onDoNotUseServer = _a.onDoNotUseServer, onSetServerConfigView = _a.onSetServerConfigView;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var setServerUrl = (0, ServerContext_1.useSetServerURL)();
    var currentUrl = (0, ServerContext_1.useServerURL)();
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, useGlobalPref_1.useGlobalPref)('syncServerConfig'), syncServerConfig = _b[0], setSyncServerConfig = _b[1];
    var _c = (0, react_1.useState)((syncServerConfig === null || syncServerConfig === void 0 ? void 0 : syncServerConfig.port) || 5007), electronServerPort = _c[0], setElectronServerPort = _c[1];
    var _d = (0, react_1.useState)(null), configError = _d[0], setConfigError = _d[1];
    var canShowExternalServerConfig = !(syncServerConfig === null || syncServerConfig === void 0 ? void 0 : syncServerConfig.port) && !currentUrl;
    var hasInternalServerConfig = syncServerConfig === null || syncServerConfig === void 0 ? void 0 : syncServerConfig.port;
    var _e = (0, react_1.useState)(false), startingSyncServer = _e[0], setStartingSyncServer = _e[1];
    var onConfigureSyncServer = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (startingSyncServer) {
                        return [2 /*return*/]; // Prevent multiple clicks
                    }
                    if (isNaN(electronServerPort) ||
                        electronServerPort <= 0 ||
                        electronServerPort > 65535) {
                        setConfigError(t('Ports must be within range 1 - 65535'));
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    setConfigError(null);
                    setStartingSyncServer(true);
                    // Ensure config is saved before starting the server
                    return [4 /*yield*/, dispatch((0, prefsSlice_1.saveGlobalPrefs)({
                            prefs: {
                                syncServerConfig: __assign(__assign({}, syncServerConfig), { port: electronServerPort, autoStart: true }),
                            },
                        })).unwrap()];
                case 2:
                    // Ensure config is saved before starting the server
                    _a.sent();
                    return [4 /*yield*/, window.globalThis.Actual.stopSyncServer()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, window.globalThis.Actual.startSyncServer()];
                case 4:
                    _a.sent();
                    setStartingSyncServer(false);
                    initElectronSyncServerRunningStatus();
                    return [4 /*yield*/, setServerUrl("http://localhost:".concat(electronServerPort))];
                case 5:
                    _a.sent();
                    navigate('/');
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    setStartingSyncServer(false);
                    setConfigError(t('Failed to configure sync server'));
                    console.error('Failed to configure sync server:', error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var _f = (0, react_1.useState)(false), electronSyncServerRunning = _f[0], setElectronSyncServerRunning = _f[1];
    var initElectronSyncServerRunningStatus = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setElectronSyncServerRunning;
                    return [4 /*yield*/, window.globalThis.Actual.isSyncServerRunning()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        initElectronSyncServerRunningStatus();
    }, []);
    function dontUseSyncServer() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setSyncServerConfig(null);
                        if (!electronSyncServerRunning) return [3 /*break*/, 2];
                        return [4 /*yield*/, window.globalThis.Actual.stopSyncServer()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        onDoNotUseServer();
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<>
      <common_1.Title text={t('Configure your server')}/>
      <view_1.View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
        }}>
        <text_1.Text style={{
            fontSize: 16,
            color: theme_1.theme.pageText,
            lineHeight: 1.5,
        }}>
          <react_i18next_1.Trans>
            Set up your server below to enable seamless data synchronization
            across your devices, bank sync and more...
          </react_i18next_1.Trans>
        </text_1.Text>
        <text_1.Text style={{
            fontSize: 16,
            color: theme_1.theme.pageText,
            lineHeight: 1.5,
        }}>
          <react_i18next_1.Trans>
            Need to expose your server to the internet? Follow our step-by-step{' '}
            <Link_1.Link variant="external" to="https://actualbudget.org/docs/install/desktop-app">
              guide
            </Link_1.Link>{' '}
            for more information.
          </react_i18next_1.Trans>
        </text_1.Text>

        {configError && (<text_1.Text style={{ color: theme_1.theme.errorText, marginTop: 10 }}>
            {configError}
          </text_1.Text>)}

        <view_1.View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
        }}>
          <view_1.View style={{ flexDirection: 'column', gap: 5, flex: 1 }}>
            <label_1.Label title={t('Domain')} style={{ textAlign: 'left' }}/>
            <input_1.BigInput value="localhost" disabled type="text" className={(0, css_1.css)({
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
            },
        })}/>
          </view_1.View>

          <view_1.View style={{ flexDirection: 'column', gap: 5 }}>
            <label_1.Label title={t('Port')} style={{ textAlign: 'left', width: '7ch' }}/>
            <input_1.BigInput name="port" value={String(electronServerPort)} aria-label={t('Port')} type="number" className={(0, css_1.css)({
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
            },
            width: '7ch',
            textAlign: 'center',
        })} autoFocus={true} maxLength={5} onChange={function (event) {
            return setElectronServerPort(Number(event.target.value));
        }}/>
          </view_1.View>

          <view_1.View style={{
            flexDirection: 'column',
            gap: 5,
            justifyContent: 'end',
        }}>
            <label_1.Label title={t('')} style={{ textAlign: 'left', width: '7ch' }}/>
            {!electronSyncServerRunning ? (<button_1.ButtonWithLoading variant="primary" style={{ padding: 10, width: '8ch' }} onPress={onConfigureSyncServer} isLoading={startingSyncServer}>
                <react_i18next_1.Trans>Start</react_i18next_1.Trans>
              </button_1.ButtonWithLoading>) : (<button_1.ButtonWithLoading variant="primary" style={{ padding: 10, width: '8ch' }} onPress={onConfigureSyncServer} isLoading={startingSyncServer}>
                <react_i18next_1.Trans>Save</react_i18next_1.Trans>
              </button_1.ButtonWithLoading>)}
          </view_1.View>
        </view_1.View>
      </view_1.View>

      <view_1.View style={{
            flexDirection: 'row',
            marginTop: 20,
            gap: 15,
            flexFlow: 'row wrap',
            justifyContent: 'center',
        }}>
        {hasInternalServerConfig && (<button_1.Button variant="bare" style={{ color: theme_1.theme.pageTextLight, margin: 5 }} onPress={function () { return navigate(-1); }}>
            <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
          </button_1.Button>)}
        <button_1.Button variant="bare" style={{ color: theme_1.theme.pageTextLight, margin: 5 }} onPress={dontUseSyncServer}>
          <react_i18next_1.Trans>Don’t use a server</react_i18next_1.Trans>
        </button_1.Button>
        {canShowExternalServerConfig && (<button_1.Button variant="bare" style={{ color: theme_1.theme.pageTextLight, margin: 5 }} onPress={function () { return onSetServerConfigView('external'); }}>
            <react_i18next_1.Trans>Use an external server</react_i18next_1.Trans>
          </button_1.Button>)}
      </view_1.View>
    </>);
}
function ConfigServer() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var _a = (0, react_1.useState)(''), url = _a[0], setUrl = _a[1];
    var currentUrl = (0, ServerContext_1.useServerURL)();
    var setServerUrl = (0, ServerContext_1.useSetServerURL)();
    (0, react_1.useEffect)(function () {
        setUrl(currentUrl);
    }, [currentUrl]);
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var restartElectronServer = (0, react_1.useCallback)(function () {
        globalThis.window.Actual.restartElectronServer();
        setError(null);
    }, []);
    var _d = (0, useGlobalPref_1.useGlobalPref)('serverSelfSignedCert', restartElectronServer), _serverSelfSignedCert = _d[0], setServerSelfSignedCert = _d[1];
    function getErrorMessage(error) {
        switch (error) {
            case 'network-failure':
                return t('Server is not running at this URL. Make sure you have HTTPS set up properly.');
            default:
                return t('Server does not look like an Actual server. Is it set up correctly?');
        }
    }
    function onSubmit() {
        return __awaiter(this, void 0, void 0, function () {
            var httpUrl, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (url === null || url === '' || loading) {
                            return [2 /*return*/];
                        }
                        setError(null);
                        setLoading(true);
                        httpUrl = url;
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            httpUrl = 'https://' + url;
                        }
                        return [4 /*yield*/, setServerUrl(httpUrl)];
                    case 1:
                        error = (_a.sent()).error;
                        setUrl(httpUrl);
                        if (!error) return [3 /*break*/, 2];
                        setLoading(false);
                        setError(error);
                        return [3 /*break*/, 4];
                    case 2:
                        setLoading(false);
                        return [4 /*yield*/, dispatch((0, usersSlice_1.signOut)())];
                    case 3:
                        _a.sent();
                        navigate('/');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function onSameDomain() {
        setUrl(window.location.origin);
    }
    function onSelectSelfSignedCertificate() {
        return __awaiter(this, void 0, void 0, function () {
            var selfSignedCertificateLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, window.Actual.openFileDialog({
                            properties: ['openFile'],
                            filters: [
                                {
                                    name: 'Self Signed Certificate',
                                    extensions: ['crt', 'pem'],
                                },
                            ],
                        })];
                    case 1:
                        selfSignedCertificateLocation = _a.sent();
                        if (selfSignedCertificateLocation) {
                            setServerSelfSignedCert(selfSignedCertificateLocation[0]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function onSkip() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, setServerUrl(null)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dispatch((0, usersSlice_1.loggedIn)())];
                    case 2:
                        _a.sent();
                        navigate('/');
                        return [2 /*return*/];
                }
            });
        });
    }
    function onCreateTestFile() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, setServerUrl(null)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.createBudget)({ testMode: true }))];
                    case 2:
                        _a.sent();
                        navigate('/');
                        return [2 /*return*/];
                }
            });
        });
    }
    var syncServerConfig = (0, useGlobalPref_1.useGlobalPref)('syncServerConfig')[0];
    var hasExternalServerConfig = !(syncServerConfig === null || syncServerConfig === void 0 ? void 0 : syncServerConfig.port) && !!currentUrl;
    var _e = (0, react_1.useState)(function () {
        if ((0, environment_1.isElectron)() && !hasExternalServerConfig) {
            return 'internal';
        }
        return 'external';
    }), serverConfigView = _e[0], onSetServerConfigView = _e[1];
    return (<view_1.View style={{ maxWidth: 500, marginTop: -30 }}>
      {serverConfigView === 'internal' && (<ElectronServerConfig onDoNotUseServer={onSkip} onSetServerConfigView={onSetServerConfigView}/>)}
      {serverConfigView === 'external' && (<>
          <common_1.Title text={t('Where’s the server?')}/>
          <text_1.Text style={{
                fontSize: 16,
                color: theme_1.theme.tableRowHeaderText,
                lineHeight: 1.5,
            }}>
            {currentUrl ? (<react_i18next_1.Trans>
                Existing sessions will be logged out and you will log in to this
                server. We will validate that Actual is running at this URL.
              </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
                There is no server configured. After running the server, specify
                the URL here to use the app. You can always change this later.
                We will validate that Actual is running at this URL.
              </react_i18next_1.Trans>)}
          </text_1.Text>
          {error && (<>
              <text_1.Text style={{
                    marginTop: 20,
                    color: theme_1.theme.errorText,
                    borderRadius: 4,
                    fontSize: 15,
                }}>
                {getErrorMessage(error)}
              </text_1.Text>
              {(0, environment_1.isElectron)() && (<view_1.View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 20,
                    }}>
                  <text_1.Text style={{
                        color: theme_1.theme.errorText,
                        borderRadius: 4,
                        fontSize: 15,
                    }}>
                    <react_i18next_1.Trans>
                      If the server is using a self-signed certificate{' '}
                      <Link_1.Link variant="text" style={{ fontSize: 15 }} onClick={onSelectSelfSignedCertificate}>
                        select it here
                      </Link_1.Link>
                      .
                    </react_i18next_1.Trans>
                  </text_1.Text>
                </view_1.View>)}
            </>)}
          <view_1.View style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}>
            <input_1.BigInput autoFocus={true} placeholder={t('https://example.com')} value={url || ''} onChangeValue={setUrl} style={{ flex: 1, marginRight: 10 }} onEnter={onSubmit}/>
            <button_1.ButtonWithLoading variant="primary" isLoading={loading} style={{ fontSize: 15 }} onPress={onSubmit}>
              <react_i18next_1.Trans>OK</react_i18next_1.Trans>
            </button_1.ButtonWithLoading>
            {currentUrl && (<button_1.Button variant="bare" style={{ fontSize: 15, marginLeft: 10 }} onPress={function () { return navigate(-1); }}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>)}
          </view_1.View>
          <view_1.View style={{
                flexDirection: 'row',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                marginTop: 15,
            }}>
            {currentUrl ? (<button_1.Button variant="bare" style={{ color: theme_1.theme.pageTextLight }} onPress={onSkip}>
                <react_i18next_1.Trans>Stop using a server</react_i18next_1.Trans>
              </button_1.Button>) : (<>
                {!(0, environment_1.isElectron)() && (<button_1.Button variant="bare" style={{
                        color: theme_1.theme.pageTextLight,
                        margin: 5,
                        marginRight: 15,
                    }} onPress={onSameDomain}>
                    <react_i18next_1.Trans>Use current domain</react_i18next_1.Trans>
                  </button_1.Button>)}
                <button_1.Button variant="bare" style={{ color: theme_1.theme.pageTextLight, margin: 5 }} onPress={onSkip}>
                  <react_i18next_1.Trans>Don’t use a server</react_i18next_1.Trans>
                </button_1.Button>

                {(0, environment_1.isNonProductionEnvironment)() && (<button_1.Button variant="primary" style={{ marginLeft: 15 }} onPress={function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, onCreateTestFile()];
                                case 1:
                                    _a.sent();
                                    navigate('/');
                                    return [2 /*return*/];
                            }
                        });
                    }); }}>
                    <react_i18next_1.Trans>Create test file</react_i18next_1.Trans>
                  </button_1.Button>)}
              </>)}
          </view_1.View>
        </>)}
    </view_1.View>);
}
