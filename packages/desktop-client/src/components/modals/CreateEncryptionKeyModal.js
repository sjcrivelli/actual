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
exports.CreateEncryptionKeyModal = CreateEncryptionKeyModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var paragraph_1 = require("@actual-app/components/paragraph");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var appSlice_1 = require("@desktop-client/app/appSlice");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
function CreateEncryptionKeyModal(_a) {
    var recreate = _a.recreate;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), showPassword = _e[0], setShowPassword = _e[1];
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var dispatch = (0, redux_1.useDispatch)();
    var isRecreating = recreate;
    function onCreateKey(close) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(password !== '' && !loading)) return [3 /*break*/, 2];
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, (0, fetch_1.send)('key-make', { password: password })];
                    case 1:
                        res = _a.sent();
                        if (res.error) {
                            setLoading(null);
                            setError((0, errors_1.getCreateKeyError)(res.error));
                            return [2 /*return*/];
                        }
                        dispatch((0, prefsSlice_1.loadGlobalPrefs)());
                        dispatch((0, budgetfilesSlice_1.loadAllFiles)());
                        dispatch((0, appSlice_1.sync)());
                        setLoading(false);
                        close();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="create-encryption-key">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={isRecreating ? t('Generate new key') : t('Enable encryption')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    maxWidth: 600,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    flex: 1,
                }}>
            {!isRecreating ? (<>
                <paragraph_1.Paragraph style={{ marginTop: 5 }}>
                  <react_i18next_1.Trans>
                    To enable end-to-end encryption, you need to create a key.
                    We will generate a key based on a password and use it to
                    encrypt from now on.{' '}
                    <strong>This requires a sync reset</strong> and all other
                    devices will have to revert to this version of your
                    data.{' '}
                  </react_i18next_1.Trans>
                  <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption" linkColor="purple">
                    <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
                  </Link_1.Link>
                </paragraph_1.Paragraph>
                <paragraph_1.Paragraph>
                  <ul className={(0, css_1.css)({
                        marginTop: 0,
                        '& li': { marginBottom: 8 },
                    })}>
                    <li>
                      <react_i18next_1.Trans>
                        <strong>Important:</strong> if you forget this password{' '}
                        <em>and</em> you don’t have any local copies of your
                        data, you will lose access to all your data. The data
                        cannot be decrypted without the password.
                      </react_i18next_1.Trans>
                    </li>
                    <li>
                      <react_i18next_1.Trans>
                        This key only applies to this file. You will need to
                        generate a new key for each file you want to encrypt.
                      </react_i18next_1.Trans>
                    </li>
                    <li>
                      <react_i18next_1.Trans>
                        If you’ve already downloaded your data on other devices,
                        you will need to reset them. Actual will automatically
                        take you through this process.
                      </react_i18next_1.Trans>
                    </li>
                    <li>
                      <react_i18next_1.Trans>
                        It is recommended for the encryption password to be
                        different than the log-in password in order to better
                        protect your data.
                      </react_i18next_1.Trans>
                    </li>
                  </ul>
                </paragraph_1.Paragraph>
              </>) : (<>
                <paragraph_1.Paragraph style={{ marginTop: 5 }}>
                  <react_i18next_1.Trans>
                    This will generate a new key for encrypting your data.{' '}
                    <strong>This requires a sync reset</strong> and all other
                    devices will have to revert to this version of your data.
                    Actual will take you through that process on those devices.
                  </react_i18next_1.Trans>{' '}
                  <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption" linkColor="purple">
                    <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
                  </Link_1.Link>
                </paragraph_1.Paragraph>
                <paragraph_1.Paragraph>
                  <react_i18next_1.Trans>
                    Key generation is randomized. The same password will create
                    different keys, so this will change your key regardless of
                    the password being different.
                  </react_i18next_1.Trans>
                </paragraph_1.Paragraph>
              </>)}
          </view_1.View>
          <react_aria_components_1.Form onSubmit={function (e) {
                    e.preventDefault();
                    onCreateKey(close);
                }}>
            <view_1.View style={{ alignItems: 'center' }}>
              <text_1.Text style={{ fontWeight: 600, marginBottom: 3 }}>
                <react_i18next_1.Trans>Password</react_i18next_1.Trans>
              </text_1.Text>

              {error && (<view_1.View style={{
                        color: theme_1.theme.errorText,
                        textAlign: 'center',
                        fontSize: 13,
                        marginBottom: 3,
                    }}>
                  {error}
                </view_1.View>)}

              <initial_focus_1.InitialFocus>
                <input_1.Input type={showPassword ? 'text' : 'password'} style={{
                    width: isNarrowWidth ? '100%' : '50%',
                    height: isNarrowWidth ? styles_1.styles.mobileMinHeight : undefined,
                }} onChangeValue={setPassword}/>
              </initial_focus_1.InitialFocus>
              <text_1.Text style={{ marginTop: 5 }}>
                <label style={{ userSelect: 'none' }}>
                  <input type="checkbox" onClick={function () { return setShowPassword(!showPassword); }}/>{' '}
                  <react_i18next_1.Trans>Show password</react_i18next_1.Trans>
                </label>
              </text_1.Text>
            </view_1.View>

            <Modal_1.ModalButtons style={{ marginTop: 20 }}>
              <button_1.ButtonWithLoading type="submit" style={{
                    height: isNarrowWidth ? styles_1.styles.mobileMinHeight : undefined,
                }} isLoading={loading} variant="primary">
                <react_i18next_1.Trans>Enable</react_i18next_1.Trans>
              </button_1.ButtonWithLoading>
            </Modal_1.ModalButtons>
          </react_aria_components_1.Form>
        </>);
        }}
    </Modal_1.Modal>);
}
