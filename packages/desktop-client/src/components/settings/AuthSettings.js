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
exports.AuthSettings = AuthSettings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var label_1 = require("@actual-app/components/label");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var UI_1 = require("./UI");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function AuthSettings() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var loginMethod = (0, ServerContext_1.useLoginMethod)();
    var dispatch = (0, redux_1.useDispatch)();
    return (<UI_1.Setting primaryAction={<>
          <label>
            <react_i18next_1.Trans>OpenID is</react_i18next_1.Trans>{' '}
            <label style={{ fontWeight: 'bold' }}>
              {loginMethod === 'openid' ? t('enabled') : t('disabled')}
            </label>
          </label>
          {loginMethod === 'password' && (<>
              <button_1.Button id="start-using" style={{
                    marginTop: '10px',
                }} variant="normal" onPress={function () {
                    return dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'enable-openid',
                            options: {
                                onSave: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); },
                            },
                        },
                    }));
                }}>
                <react_i18next_1.Trans>Start using OpenID</react_i18next_1.Trans>
              </button_1.Button>
              <label_1.Label style={{ paddingTop: 5 }} title={t('OpenID is required to enable multi-user mode.')}/>
            </>)}
          {loginMethod !== 'password' && (<>
              <button_1.Button style={{
                    marginTop: '10px',
                }} variant="normal" onPress={function () {
                    return dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'enable-password-auth',
                            options: {
                                onSave: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); },
                            },
                        },
                    }));
                }}>
                <react_i18next_1.Trans>Disable OpenID</react_i18next_1.Trans>
              </button_1.Button>
              {multiuserEnabled && (<label style={{ paddingTop: 5, color: theme_1.theme.errorText }}>
                  <react_i18next_1.Trans>
                    Disabling OpenID will deactivate multi-user mode.
                  </react_i18next_1.Trans>
                </label>)}
            </>)}
        </>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Authentication method</strong> modifies how users log in to
          the system.
        </react_i18next_1.Trans>
      </text_1.Text>
    </UI_1.Setting>);
}
