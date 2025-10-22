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
exports.Bootstrap = Bootstrap;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var common_1 = require("./common");
var ConfirmPasswordForm_1 = require("./ConfirmPasswordForm");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var redux_1 = require("@desktop-client/redux");
function Bootstrap() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, react_1.useState)(null), error = _a[0], setError = _a[1];
    var refreshLoginMethods = (0, ServerContext_1.useRefreshLoginMethods)();
    var checked = (0, common_1.useBootstrapped)().checked;
    var navigate = (0, useNavigate_1.useNavigate)();
    function getErrorMessage(error) {
        switch (error) {
            case 'invalid-password':
                return t('Password cannot be empty');
            case 'password-match':
                return t('Passwords do not match');
            case 'network-failure':
                return t('Unable to contact the server');
            case 'missing-issuer':
                return t('OpenID server cannot be empty');
            case 'missing-client-id':
                return t('Client ID cannot be empty');
            case 'missing-client-secret':
                return t('Client secret cannot be empty');
            default:
                return t("An unknown error occurred: {{error}}", { error: error });
        }
    }
    function onSetPassword(password) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setError(null);
                        return [4 /*yield*/, (0, fetch_1.send)('subscribe-bootstrap', { password: password })];
                    case 1:
                        error = (_a.sent()).error;
                        if (!error) return [3 /*break*/, 2];
                        setError(error);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, refreshLoginMethods()];
                    case 3:
                        _a.sent();
                        navigate('/login');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function onDemo() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.createBudget)({ demoMode: true }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    if (!checked) {
        return null;
    }
    return (<view_1.View style={{ maxWidth: 450 }}>
      <common_1.Title text={t('Welcome to Actual!')}/>
      <paragraph_1.Paragraph style={{ fontSize: 16, color: theme_1.theme.pageTextDark }}>
        <react_i18next_1.Trans>
          Actual is a super fast privacy-focused app for managing your finances.
          To secure your data, you’ll need to set a password for your server.
        </react_i18next_1.Trans>
      </paragraph_1.Paragraph>

      <paragraph_1.Paragraph isLast style={{ fontSize: 16, color: theme_1.theme.pageTextDark }}>
        <react_i18next_1.Trans>
          Consider opening{' '}
          <Link_1.Link variant="external" to="https://actualbudget.org/docs/tour/">
            our tour
          </Link_1.Link>{' '}
          in a new tab for some guidance on what to do when you’ve set your
          password.
        </react_i18next_1.Trans>
      </paragraph_1.Paragraph>

      {error && (<text_1.Text style={{
                marginTop: 20,
                color: theme_1.theme.errorText,
                borderRadius: 4,
                fontSize: 15,
            }}>
          {getErrorMessage(error)}
        </text_1.Text>)}

      <ConfirmPasswordForm_1.ConfirmPasswordForm buttons={<button_1.Button variant="bare" style={{
                fontSize: 15,
                color: theme_1.theme.pageTextLink,
                marginRight: 15,
            }} onPress={onDemo}>
            {t('Try Demo')}
          </button_1.Button>} onSetPassword={onSetPassword} onError={setError}/>
    </view_1.View>);
}
