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
exports.OpenIdForm = OpenIdForm;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Link_1 = require("@desktop-client/components/common/Link");
var forms_1 = require("@desktop-client/components/forms");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
function OpenIdForm(_a) {
    var onSetOpenId = _a.onSetOpenId, otherButtons = _a.otherButtons, openIdData = _a.openIdData;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _b = (0, react_1.useState)(''), issuer = _b[0], setIssuer = _b[1];
    var _c = (0, react_1.useState)(''), clientId = _c[0], setClientId = _c[1];
    var _d = (0, react_1.useState)(''), clientSecret = _d[0], setClientSecret = _d[1];
    var _e = (0, react_1.useState)(true), clientIdRequired = _e[0], setClientIdRequired = _e[1];
    var _f = (0, react_1.useState)(false), clientIdDisabled = _f[0], setClientIdDisabled = _f[1];
    var _g = (0, react_1.useState)(true), clientSecretRequired = _g[0], setClientSecretRequired = _g[1];
    var _h = (0, react_1.useState)(false), clientSecretDisabled = _h[0], setClientSecretDisabled = _h[1];
    var _j = (0, react_1.useState)('other'), providerName = _j[0], setProviderName = _j[1];
    var serverUrl = (0, ServerContext_1.useServerURL)();
    var location = (0, react_router_1.useLocation)();
    var _k = (0, react_1.useState)((<text_1.Text />)), tip = _k[0], setTip = _k[1];
    var _l = (0, react_1.useState)(false), submitButtonDisabled = _l[0], setSubmitButtonDisabled = _l[1];
    var _m = (0, react_1.useState)(false), loading = _m[0], setLoading = _m[1];
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        if (openIdData) {
            setProviderName((_a = openIdData.selectedProvider) !== null && _a !== void 0 ? _a : 'other');
            setIssuer((_b = openIdData.issuer) !== null && _b !== void 0 ? _b : '');
            setClientId((_c = openIdData.client_id) !== null && _c !== void 0 ? _c : '');
            setClientSecret((_d = openIdData.client_secret) !== null && _d !== void 0 ? _d : '');
        }
    }, [openIdData]);
    var handleProviderChange = function (provider) {
        var _a, _b, _c, _d, _e, _f;
        if (provider) {
            setProviderName(provider.value);
            var newIssuer = typeof provider.issuer === 'function'
                ? provider.issuer(location, serverUrl !== null && serverUrl !== void 0 ? serverUrl : '')
                : provider.issuer;
            setIssuer(newIssuer !== null && newIssuer !== void 0 ? newIssuer : '');
            var newClientId = typeof provider.clientId === 'function'
                ? provider.clientId(location, serverUrl !== null && serverUrl !== void 0 ? serverUrl : '')
                : provider.clientId;
            setClientId(newClientId !== null && newClientId !== void 0 ? newClientId : '');
            var newclientSecret = typeof provider.clientSecret === 'function'
                ? provider.clientSecret(location, serverUrl !== null && serverUrl !== void 0 ? serverUrl : '')
                : provider.clientSecret;
            setClientSecret(newclientSecret !== null && newclientSecret !== void 0 ? newclientSecret : '');
            setClientIdRequired((_a = provider.clientIdRequired) !== null && _a !== void 0 ? _a : true);
            setClientIdDisabled((_b = provider.clientIdDisabled) !== null && _b !== void 0 ? _b : false);
            setClientSecretRequired((_c = provider.clientSecretRequired) !== null && _c !== void 0 ? _c : true);
            setClientSecretDisabled((_d = provider.clientSecretDisabled) !== null && _d !== void 0 ? _d : false);
            setTip((_e = provider.tip) !== null && _e !== void 0 ? _e : <text_1.Text />);
            setSubmitButtonDisabled((_f = provider.submitButtonDisabled) !== null && _f !== void 0 ? _f : false);
        }
    };
    function onSubmit() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (loading) {
                            return [2 /*return*/];
                        }
                        setLoading(true);
                        return [4 /*yield*/, onSetOpenId({
                                selectedProvider: providerName,
                                discoveryURL: issuer !== null && issuer !== void 0 ? issuer : '',
                                client_id: clientId !== null && clientId !== void 0 ? clientId : '',
                                client_secret: clientSecret !== null && clientSecret !== void 0 ? clientSecret : '',
                                server_hostname: serverUrl !== null && serverUrl !== void 0 ? serverUrl : '',
                            })];
                    case 1:
                        _a.sent();
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<>
      <OpenIdProviderSelector onProviderChange={handleProviderChange} defaultValue={providerName}/>
      <stack_1.Stack direction="column" style={{ marginTop: 5 }}>
        <forms_1.FormField style={{ flex: 1 }}>
          {!submitButtonDisabled && (<view_1.View>
              <input_1.ResponsiveInput id="issuer-field" type="text" value={issuer} placeholder="https://accounts.domain.tld/" onChangeValue={function (newValue) { return setIssuer(newValue); }}/>
            </view_1.View>)}
        </forms_1.FormField>
      </stack_1.Stack>
      <label htmlFor="issuer-field" style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, minWidth: '150px', marginTop: 5, marginBottom: 10, maxWidth: '500px' })}>
        {!submitButtonDisabled && t('The OpenID provider URL.')}{' '}
        <text_1.Text style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
          {tip}
        </text_1.Text>
      </label>{' '}
      <stack_1.Stack>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Client ID')} htmlFor="clientid-field"/>
          <input_1.ResponsiveInput type="text" id="clientid-field" value={clientId} disabled={clientIdDisabled} onChangeValue={function (newValue) { return setClientId(newValue); }} required={clientIdRequired}/>
          <label htmlFor="clientid-field" style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
            <react_i18next_1.Trans>The Client ID generated by the OpenID provider.</react_i18next_1.Trans>
          </label>
        </forms_1.FormField>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Client secret')} htmlFor="clientsecret-field"/>
          <input_1.ResponsiveInput type="text" id="clientsecret-field" value={clientSecret} onChangeValue={function (newValue) { return setClientSecret(newValue); }} disabled={clientSecretDisabled} required={clientSecretRequired}/>
          <label htmlFor="clientsecret-field" style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })}>
            <react_i18next_1.Trans>
              The client secret associated with the ID generated by the OpenID
              provider.
            </react_i18next_1.Trans>
          </label>
        </forms_1.FormField>

        <stack_1.Stack direction="row" justify="flex-end" align="center">
          {otherButtons}
          <button_1.ButtonWithLoading variant="primary" isLoading={loading} onPress={onSubmit} isDisabled={submitButtonDisabled} style={isNarrowWidth ? { padding: 10 } : undefined}>
            OK
          </button_1.ButtonWithLoading>
        </stack_1.Stack>
      </stack_1.Stack>
    </>);
}
var openIdProviders = __spreadArray(__spreadArray([], [
    {
        label: 'Google Accounts',
        value: 'google',
        issuer: 'https://accounts.google.com',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (<Link_1.Link variant="external" to="https://developers.google.com/identity/sign-in/web/sign-in">
          <react_i18next_1.Trans>Integrating Google Sign-In into your web app</react_i18next_1.Trans>
        </Link_1.Link>),
    },
    {
        label: 'Passwordless.id',
        value: 'passwordless',
        issuer: 'https://api.passwordless.id',
        clientId: function (location, serverUrl) {
            return serverUrl
                ? serverUrl
                : window.location.href.replace(location.pathname, '');
        },
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: true,
        tip: (<Link_1.Link variant="external" to="https://passwordless.id/">
          <react_i18next_1.Trans>Get started with passwordless.id</react_i18next_1.Trans>
        </Link_1.Link>),
    },
    {
        label: 'Microsoft Entra',
        value: 'microsoft',
        issuer: 'https://login.microsoftonline.com/{tenant-id}',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (<Link_1.Link variant="external" to="https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc">
          <react_i18next_1.Trans>OpenID Connect on the Microsoft identity platform</react_i18next_1.Trans>
        </Link_1.Link>),
    },
    {
        label: 'Auth0',
        value: 'auth0',
        issuer: 'https://{domain.region}.auth0.com/',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (<text_1.Text style={{ color: theme_1.theme.warningText }}>
          <react_i18next_1.Trans>
            Note that the URL depends on your application domain and region.
          </react_i18next_1.Trans>{' '}
          <Link_1.Link variant="external" to="https://auth0.com/docs/get-started/applications/application-settings">
            <react_i18next_1.Trans>Auth0 application settings</react_i18next_1.Trans>
          </Link_1.Link>
        </text_1.Text>),
    },
    {
        label: 'Keycloak',
        value: 'keycloak',
        issuer: 'https://{domain}/realms/{realm}/',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (<text_1.Text style={{ color: theme_1.theme.warningText }}>
          <react_i18next_1.Trans>
            Note that the URL depends on your Keycloak domain and realm.
          </react_i18next_1.Trans>{' '}
          <Link_1.Link variant="external" to="https://www.keycloak.org/docs/22.0.0/securing_apps/">
            <react_i18next_1.Trans>Securing Applications with Keycloak</react_i18next_1.Trans>
          </Link_1.Link>
        </text_1.Text>),
    },
    {
        label: 'GitHub',
        value: 'github',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: true,
        clientIdDisabled: true,
        submitButtonDisabled: true,
        tip: (<>
          <text_1.Text style={{ color: theme_1.theme.errorText }}>
            <react_i18next_1.Trans>
              GitHub does not support discovery. You need to configure it in the
              server.
            </react_i18next_1.Trans>
          </text_1.Text>{' '}
          <Link_1.Link variant="external" to="https://actualbudget.org/docs/" linkColor="muted">
            <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
          </Link_1.Link>
        </>),
    },
    {
        label: 'authentik',
        value: 'authentik',
        issuer: 'https://{domain}/application/o/{provider-slug-name}/',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (<text_1.Text style={{ color: theme_1.theme.warningText }}>
          <react_i18next_1.Trans>
            Note that the URL depends on your authentik domain and provider slug
            name.
          </react_i18next_1.Trans>{' '}
          <Link_1.Link variant="external" to="https://integrations.goauthentik.io/miscellaneous/actual-budget/">
            <react_i18next_1.Trans>Configure OAuth2 provider</react_i18next_1.Trans>
          </Link_1.Link>
        </text_1.Text>),
    },
].sort(function (a, b) { return a.label.localeCompare(b.label); }), true), [
    menu_1.Menu.line,
    {
        label: 'Other',
        value: 'other',
        issuer: '',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (<text_1.Text>
        <react_i18next_1.Trans>
          Use any OpenId provider of your preference.{' '}
          <text_1.Text style={{ color: theme_1.theme.warningText }}>
            If your provider does not support discovery, configure it manually
            from server
          </text_1.Text>
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/" linkColor="muted">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>),
    },
], false);
function OpenIdProviderSelector(_a) {
    var onProviderChange = _a.onProviderChange, defaultValue = _a.defaultValue;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var handleProviderChange = function (newValue) {
        var selectedProvider = openIdProviders.find(function (provider) {
            return provider !== menu_1.Menu.line ? provider.value === newValue : false;
        });
        if (selectedProvider && selectedProvider !== menu_1.Menu.line) {
            onProviderChange(selectedProvider);
        }
    };
    return (<forms_1.FormField style={{ flex: 1, marginTop: 20 }}>
      <forms_1.FormLabel title={t('OpenID provider')} htmlFor="provider-selector"/>
      <select_1.Select options={openIdProviders.map(function (provider) {
            return provider === menu_1.Menu.line ? menu_1.Menu.line : [provider.value, provider.label];
        })} defaultLabel={t('Select Provider')} value={defaultValue} onChange={handleProviderChange} style={isNarrowWidth ? { padding: 10 } : undefined}/>
    </forms_1.FormField>);
}
