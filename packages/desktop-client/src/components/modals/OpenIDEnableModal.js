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
exports.OpenIDEnableModal = OpenIDEnableModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var label_1 = require("@actual-app/components/label");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var asyncStorage = require("loot-core/platform/server/asyncStorage");
var errors_1 = require("loot-core/shared/errors");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var alerts_1 = require("@desktop-client/components/alerts");
var Modal_1 = require("@desktop-client/components/common/Modal");
var OpenIdForm_1 = require("@desktop-client/components/manager/subscribe/OpenIdForm");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function OpenIDEnableModal(_a) {
    var originalOnSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(''), error = _b[0], setError = _b[1];
    var refreshLoginMethods = (0, ServerContext_1.useRefreshLoginMethods)();
    function onSave(config) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, (0, fetch_1.send)('enable-openid', { openId: config })];
                    case 1:
                        error_1 = ((_a.sent()) || {}).error;
                        if (!!error_1) return [3 /*break*/, 8];
                        originalOnSave === null || originalOnSave === void 0 ? void 0 : originalOnSave();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, refreshLoginMethods()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, asyncStorage.removeItem('user-token')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.closeBudget)())];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error('Failed to cleanup after OpenID enable:', e_1);
                        setError(t('OpenID was enabled but cleanup failed. Please refresh the application.'));
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        setError((0, errors_1.getOpenIdErrors)(error_1));
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_2 = _a.sent();
                        console.error('Failed to enable OpenID:', e_2);
                        setError(t('Failed to enable OpenID. Please try again.'));
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="enable-openid">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Enable OpenID')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>

          <view_1.View style={{ flexDirection: 'column' }}>
            <OpenIdForm_1.OpenIdForm onSetOpenId={onSave} otherButtons={[
                    <button_1.Button key="cancel" variant="bare" style={{ marginRight: 10 }} onPress={function () { return dispatch((0, modalsSlice_1.popModal)()); }}>
                  <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
                </button_1.Button>,
                ]}/>
            <label_1.Label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight, paddingTop: 5 })} title={t('After enabling OpenID all sessions will be closed')}/>
            <label_1.Label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.pageTextLight })} title={t('The first user to login will become the server owner')}/>
            <label_1.Label style={__assign(__assign({}, styles_1.styles.verySmallText), { color: theme_1.theme.warningText })} title={t('The current password will be disabled')}/>

            {error && <alerts_1.Error>{error}</alerts_1.Error>}
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
