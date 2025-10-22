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
exports.ConfirmPasswordForm = ConfirmPasswordForm;
exports.ConfirmOldPasswordForm = ConfirmOldPasswordForm;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
function ConfirmPasswordForm(_a) {
    var buttons = _a.buttons, onSetPassword = _a.onSetPassword, onError = _a.onError;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(''), password1 = _b[0], setPassword1 = _b[1];
    var _c = (0, react_1.useState)(''), password2 = _c[0], setPassword2 = _c[1];
    var _d = (0, react_1.useState)(false), showPassword = _d[0], setShowPassword = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    function onSubmit() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (loading) {
                            return [2 /*return*/];
                        }
                        if (!(password1 === password2)) return [3 /*break*/, 2];
                        setLoading(true);
                        return [4 /*yield*/, onSetPassword(password1)];
                    case 1:
                        _a.sent();
                        setLoading(false);
                        return [3 /*break*/, 3];
                    case 2:
                        onError('password-match');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function onShowPassword(e) {
        setShowPassword(e.target.checked);
    }
    return (<view_1.View style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            marginTop: 30,
        }}>
      <input_1.BigInput autoFocus={true} placeholder={t('Password')} type={showPassword ? 'text' : 'password'} value={password1} onChangeValue={setPassword1} onEnter={onSubmit}/>
      <input_1.BigInput placeholder={t('Confirm password')} type={showPassword ? 'text' : 'password'} value={password2} onChangeValue={setPassword2} style={{ marginTop: 10 }} onEnter={onSubmit}/>

      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 15,
            marginTop: 20,
        }}>
        <label style={{ userSelect: 'none' }}>
          <input type="checkbox" onChange={onShowPassword}/>{' '}
          <react_i18next_1.Trans>Show password</react_i18next_1.Trans>
        </label>
        <view_1.View style={{ flex: 1 }}/>
        {buttons}
        <button_1.ButtonWithLoading variant="primary" isLoading={loading} onPress={onSubmit}>
          <react_i18next_1.Trans>OK</react_i18next_1.Trans>
        </button_1.ButtonWithLoading>
      </view_1.View>
    </view_1.View>);
}
function ConfirmOldPasswordForm(_a) {
    var buttons = _a.buttons, onSetPassword = _a.onSetPassword, _b = _a.style, style = _b === void 0 ? null : _b;
    var _c = (0, react_1.useState)(''), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(false), showPassword = _d[0], setShowPassword = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var t = (0, react_i18next_1.useTranslation)().t;
    function onSubmit() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (loading) {
                            return [2 /*return*/];
                        }
                        setLoading(true);
                        return [4 /*yield*/, onSetPassword(password)];
                    case 1:
                        _a.sent();
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function onShowPassword(e) {
        setShowPassword(e.target.checked);
    }
    return (<view_1.View style={__assign({ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginTop: 30 }, style)}>
      <input_1.BigInput autoFocus={true} placeholder={t('Password')} type={showPassword ? 'text' : 'password'} value={password} onChange={function (e) {
            return setPassword(e.target.value);
        }} onEnter={onSubmit} className={(0, css_1.css)({
            borderColor: theme_1.theme.buttonMenuBorder,
            borderWidth: 1,
            borderStyle: 'solid',
            '&[data-focused]': {},
        })}/>

      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 15,
            marginTop: 20,
        }}>
        <label style={{ userSelect: 'none' }}>
          <input type="checkbox" onChange={onShowPassword}/>{' '}
          <react_i18next_1.Trans>Show password</react_i18next_1.Trans>
        </label>
        <view_1.View style={{ flex: 1 }}/>
        {buttons}
        <button_1.ButtonWithLoading variant="primary" isLoading={loading} onPress={onSubmit}>
          <react_i18next_1.Trans>OK</react_i18next_1.Trans>
        </button_1.ButtonWithLoading>
      </view_1.View>
    </view_1.View>);
}
