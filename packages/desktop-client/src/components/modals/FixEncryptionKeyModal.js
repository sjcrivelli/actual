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
exports.FixEncryptionKeyModal = FixEncryptionKeyModal;
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
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
function FixEncryptionKeyModal(_a) {
    var cloudFileId = _a.cloudFileId, hasExistingKey = _a.hasExistingKey, onSuccess = _a.onSuccess;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(''), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(false), showPassword = _e[0], setShowPassword = _e[1];
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    function onUpdateKey(close) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(password !== '' && !loading)) return [3 /*break*/, 2];
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, (0, fetch_1.send)('key-test', {
                                password: password,
                                cloudFileId: cloudFileId,
                            })];
                    case 1:
                        error_1 = (_a.sent()).error;
                        if (error_1) {
                            setError((0, errors_1.getTestKeyError)(error_1));
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                        close();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="fix-encryption-key">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={hasExistingKey
                    ? t('Decrypt budget file')
                    : t('This file is encrypted')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    maxWidth: 500,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    flex: 1,
                }}>
            {hasExistingKey ? (<paragraph_1.Paragraph>
                {t('Please provide the encryption key to unlock this budget file. You may be unlocking it for the first time, or the key has changed. Enter your password to continue.')}{' '}
                <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption">
                  <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
                </Link_1.Link>
              </paragraph_1.Paragraph>) : (<paragraph_1.Paragraph>
                {t('We don’t have a key that encrypts or decrypts this file. Enter the password for this file to create the key for encryption.')}{' '}
                <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption">
                  <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
                </Link_1.Link>
              </paragraph_1.Paragraph>)}
          </view_1.View>
          <react_aria_components_1.Form onSubmit={function (e) {
                    e.preventDefault();
                    onUpdateKey(close);
                }}>
            <view_1.View style={{
                    marginTop: 15,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
              <text_1.Text style={{ fontWeight: 600, marginBottom: 5 }}>
                <react_i18next_1.Trans>Password</react_i18next_1.Trans>
              </text_1.Text>{' '}
              {error && (<view_1.View style={{
                        color: theme_1.theme.errorText,
                        textAlign: 'center',
                        fontSize: 13,
                        marginBottom: 3,
                    }}>
                  {error}
                </view_1.View>)}
              <initial_focus_1.InitialFocus>
                <input_1.BigInput type={showPassword ? 'text' : 'password'} style={{
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
              <button_1.Button variant="normal" style={{
                    height: isNarrowWidth ? styles_1.styles.mobileMinHeight : undefined,
                    marginRight: 10,
                }} onPress={close}>
                <react_i18next_1.Trans>Back</react_i18next_1.Trans>
              </button_1.Button>
              <button_1.ButtonWithLoading type="submit" variant="primary" style={{
                    height: isNarrowWidth ? styles_1.styles.mobileMinHeight : undefined,
                }} isLoading={loading}>
                {hasExistingKey ? t('Unlock budget file') : t('Create key')}
              </button_1.ButtonWithLoading>
            </Modal_1.ModalButtons>
          </react_aria_components_1.Form>
        </>);
        }}
    </Modal_1.Modal>);
}
