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
exports.Login = Login;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var v1_1 = require("@actual-app/components/icons/v1");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var environment_1 = require("loot-core/shared/environment");
var common_1 = require("./common");
var OpenIdForm_1 = require("./OpenIdForm");
var Link_1 = require("@desktop-client/components/common/Link");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var redux_1 = require("@desktop-client/redux");
var dark_1 = require("@desktop-client/style/themes/dark");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function PasswordLogin(_a) {
    var setError = _a.setError, dispatch = _a.dispatch;
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    function onSubmitPassword() {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (password === '' || loading) {
                            return [2 /*return*/];
                        }
                        setError(null);
                        setLoading(true);
                        return [4 /*yield*/, (0, fetch_1.send)('subscribe-sign-in', {
                                password: password,
                                loginMethod: 'password',
                            })];
                    case 1:
                        error = (_a.sent()).error;
                        setLoading(false);
                        if (error) {
                            setError(error);
                        }
                        else {
                            dispatch((0, usersSlice_1.loggedIn)());
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<view_1.View style={{
            flexDirection: isNarrowWidth ? 'column' : 'row',
            marginTop: 5,
            gap: '1rem',
        }}>
      <input_1.BigInput autoFocus placeholder={t('Password')} type="password" onChangeValue={setPassword} style={{ flex: 1 }} onEnter={onSubmitPassword}/>
      <button_1.ButtonWithLoading variant="primary" isLoading={loading} style={__assign({ fontSize: 15, width: isNarrowWidth ? '100%' : 170 }, (isNarrowWidth ? { padding: 10 } : null))} onPress={onSubmitPassword}>
        <react_i18next_1.Trans>Sign in</react_i18next_1.Trans>
      </button_1.ButtonWithLoading>
    </view_1.View>);
}
function OpenIdLogin(_a) {
    var _this = this;
    var setError = _a.setError;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _b = (0, react_1.useState)(false), warnMasterCreation = _b[0], setWarnMasterCreation = _b[1];
    var loginMethods = (0, ServerContext_1.useAvailableLoginMethods)();
    var _c = (0, react_1.useState)(false), askForPassword = _c[0], setAskForPassword = _c[1];
    var _d = (0, react_1.useState)(false), reviewOpenIdConfiguration = _d[0], setReviewOpenIdConfiguration = _d[1];
    var navigate = (0, useNavigate_1.useNavigate)();
    var _e = (0, react_1.useState)(null), openIdConfig = _e[0], setOpenIdConfig = _e[1];
    var _f = (0, react_1.useState)(''), firstLoginPassword = _f[0], setFirstLoginPassword = _f[1];
    function onSetOpenId(config) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setError(null);
                        return [4 /*yield*/, (0, fetch_1.send)('subscribe-bootstrap', { openId: config })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            setError(error);
                        }
                        else {
                            navigate('/');
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        (0, fetch_1.send)('owner-created').then(function (created) { return setWarnMasterCreation(!created); });
    }, []);
    (0, react_1.useEffect)(function () {
        if (loginMethods.some(function (method) { return method.method === 'password'; })) {
            setAskForPassword(true);
        }
        else {
            setAskForPassword(false);
        }
    }, [loginMethods]);
    function onSubmitOpenId() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error, redirectUrl, _b, _c, _d;
            var _e;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = fetch_1.send;
                        _c = ['subscribe-sign-in'];
                        _e = {};
                        if (!(0, environment_1.isElectron)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, window.Actual.startOAuthServer()];
                    case 1:
                        _d = _g.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _d = window.location.origin;
                        _g.label = 3;
                    case 3: return [4 /*yield*/, _b.apply(void 0, _c.concat([(_e.returnUrl = _d,
                                _e.loginMethod = 'openid',
                                _e.password = firstLoginPassword,
                                _e)]))];
                    case 4:
                        _a = _g.sent(), error = _a.error, redirectUrl = _a.redirectUrl;
                        if (error) {
                            setError(error);
                        }
                        else {
                            if ((0, environment_1.isElectron)()) {
                                (_f = window.Actual) === null || _f === void 0 ? void 0 : _f.openURLInBrowser(redirectUrl);
                            }
                            else {
                                window.location.href = redirectUrl;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<view_1.View>
      {!reviewOpenIdConfiguration && (<>
          <view_1.View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 5,
                gap: '1rem',
            }}>
            {warnMasterCreation && askForPassword && (<input_1.ResponsiveInput autoFocus={true} placeholder={t('Enter server password')} type="password" onChangeValue={function (newValue) {
                    setFirstLoginPassword(newValue);
                }} style={{ flex: 1 }}/>)}
            <button_1.Button variant="primary" onPress={onSubmitOpenId} style={dark_1.warningBackground && {
                padding: 6,
                fontSize: 14,
                width: 170,
            }} isDisabled={firstLoginPassword === '' &&
                askForPassword &&
                warnMasterCreation}>
              {warnMasterCreation ? (<react_i18next_1.Trans>Start using OpenID</react_i18next_1.Trans>) : (<react_i18next_1.Trans>Sign in with OpenID</react_i18next_1.Trans>)}
            </button_1.Button>
          </view_1.View>
          {warnMasterCreation && (<>
              <label style={{ color: theme_1.theme.warningText, marginTop: 10 }}>
                <react_i18next_1.Trans>
                  The first user to login with OpenID will be the{' '}
                  <text_1.Text style={{ fontWeight: 'bold' }}>server owner</text_1.Text>. This
                  can&apos;t be changed using UI.
                </react_i18next_1.Trans>
              </label>
              {askForPassword && (<button_1.Button variant="bare" isDisabled={firstLoginPassword === '' && warnMasterCreation} onPress={function () {
                        (0, fetch_1.send)('get-openid-config', {
                            password: firstLoginPassword,
                        }).then(function (config) {
                            if ('error' in config) {
                                setError(config.error);
                            }
                            else if ('openId' in config) {
                                setError(null);
                                setOpenIdConfig(config.openId);
                                setReviewOpenIdConfiguration(true);
                            }
                        });
                    }} style={__assign({ marginTop: 5 }, (isNarrowWidth ? { padding: 10 } : null))}>
                  <react_i18next_1.Trans>Review OpenID configuration</react_i18next_1.Trans>
                </button_1.Button>)}
            </>)}
        </>)}
      {reviewOpenIdConfiguration && (<view_1.View style={{ marginTop: 20 }}>
          <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, fontWeight: 'bold ', width: '100%', textAlign: 'center' })}>
            <react_i18next_1.Trans>Review OpenID configuration</react_i18next_1.Trans>
          </text_1.Text>
          <OpenIdForm_1.OpenIdForm openIdData={openIdConfig} otherButtons={[
                <button_1.Button key="cancel" variant="bare" style={__assign({ marginRight: 10 }, (isNarrowWidth && { padding: 10 }))} onPress={function () {
                        setReviewOpenIdConfiguration(false);
                        setOpenIdConfig(null);
                        setFirstLoginPassword('');
                    }}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>,
            ]} onSetOpenId={function (config) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    onSetOpenId(config);
                    return [2 /*return*/];
                });
            }); }}/>
        </view_1.View>)}
    </view_1.View>);
}
function HeaderLogin(_a) {
    var error = _a.error;
    return (<view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
        }}>
      {error ? (<Link_1.Link variant="button" type="button" style={{ fontSize: 15 }} to={'/login/password?error=' + error}>
          <react_i18next_1.Trans>Log in with password</react_i18next_1.Trans>
        </Link_1.Link>) : (<span>
          <react_i18next_1.Trans>Checking Header Token Login ...</react_i18next_1.Trans>{' '}
          <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20 }}/>
        </span>)}
    </view_1.View>);
}
function Login() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var dispatch = (0, redux_1.useDispatch)();
    var defaultLoginMethod = (0, ServerContext_1.useLoginMethod)();
    var _a = (0, react_1.useState)(defaultLoginMethod), method = _a[0], setMethod = _a[1];
    var _b = (0, react_router_1.useSearchParams)(), searchParams = _b[0], _setSearchParams = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var checked = (0, common_1.useBootstrapped)().checked;
    var loginMethods = (0, ServerContext_1.useAvailableLoginMethods)();
    var loginMethodRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(false), loginMethodMenuOpen = _d[0], setLoginMethodMenuOpen = _d[1];
    (0, react_1.useEffect)(function () {
        setMethod(defaultLoginMethod);
    }, [defaultLoginMethod]);
    (0, react_1.useEffect)(function () {
        if (checked && !searchParams.has('error')) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(method === 'header')) return [3 /*break*/, 2];
                            setError(null);
                            return [4 /*yield*/, (0, fetch_1.send)('subscribe-sign-in', {
                                    password: '',
                                    loginMethod: method,
                                })];
                        case 1:
                            error_1 = (_a.sent()).error;
                            if (error_1) {
                                setError(error_1);
                            }
                            else {
                                dispatch((0, usersSlice_1.loggedIn)());
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }, [loginMethods, checked, searchParams, method, dispatch]);
    function getErrorMessage(error) {
        switch (error) {
            case 'invalid-header':
                return t('Auto login failed - No header sent');
            case 'proxy-not-trusted':
                return t('Auto login failed - Proxy not trusted');
            case 'invalid-password':
                return t('Invalid password');
            case 'network-failure':
                return t('Unable to contact the server');
            case 'internal-error':
                return t('Internal error');
            default:
                return t("An unknown error occurred: {{error}}", { error: error });
        }
    }
    if (!checked) {
        return null;
    }
    return (<view_1.View style={{ maxWidth: 450, marginTop: -30, color: theme_1.theme.pageText }}>
      <common_1.Title text={t('Sign in to this Actual instance')}/>

      {(loginMethods === null || loginMethods === void 0 ? void 0 : loginMethods.length) > 1 && (<text_1.Text style={{
                fontSize: 16,
                color: theme_1.theme.pageTextDark,
                lineHeight: 1.4,
                marginBottom: 10,
            }}>
          <react_i18next_1.Trans>
            If you lost your password, you likely still have access to your
            server to manually reset it.
          </react_i18next_1.Trans>
        </text_1.Text>)}

      {method === 'password' && (<PasswordLogin setError={setError} dispatch={dispatch}/>)}

      {method === 'openid' && <OpenIdLogin setError={setError}/>}

      {method === 'header' && <HeaderLogin error={error}/>}

      {(loginMethods === null || loginMethods === void 0 ? void 0 : loginMethods.length) > 1 && (<view_1.View style={{ marginTop: 10 }}>
          <view_1.View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'end',
            }}>
            <button_1.Button variant="bare" ref={loginMethodRef} onPress={function () { return setLoginMethodMenuOpen(true); }} style={__assign(__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, paddingTop: 5, width: 'fit-content' }), (isNarrowWidth ? { padding: 10 } : null))}>
              <react_i18next_1.Trans>Select the login method</react_i18next_1.Trans>{' '}
              <v1_1.SvgCheveronDown width={12} height={12}/>
            </button_1.Button>
          </view_1.View>
          <popover_1.Popover triggerRef={loginMethodRef} onOpenChange={function (value) {
                setLoginMethodMenuOpen(value);
            }} isOpen={loginMethodMenuOpen}>
            <menu_1.Menu items={loginMethods === null || loginMethods === void 0 ? void 0 : loginMethods.filter(function (f) { return f.method !== method; }).map(function (m) { return ({
                name: m.method,
                text: m.displayName,
            }); })} onMenuSelect={function (selected) {
                setError(null);
                setMethod(selected);
                setLoginMethodMenuOpen(false);
            }}/>
          </popover_1.Popover>
        </view_1.View>)}

      {error && (<text_1.Text style={{
                marginTop: 20,
                color: theme_1.theme.errorText,
                borderRadius: 4,
                fontSize: 15,
            }}>
          {getErrorMessage(error)}
        </text_1.Text>)}
    </view_1.View>);
}
