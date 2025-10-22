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
exports.PluggyAiInitialiseModal = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var alerts_1 = require("@desktop-client/components/alerts");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var PluggyAiInitialiseModal = function (_a) {
    var onSuccess = _a.onSuccess;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(''), clientId = _b[0], setClientId = _b[1];
    var _c = (0, react_1.useState)(''), clientSecret = _c[0], setClientSecret = _c[1];
    var _d = (0, react_1.useState)(''), itemIds = _d[0], setItemIds = _d[1];
    var _e = (0, react_1.useState)(true), isValid = _e[0], setIsValid = _e[1];
    var _f = (0, react_1.useState)(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_1.useState)(t('It is required to provide both the client id, client secret and at least one item id.')), error = _g[0], setError = _g[1];
    var onSubmit = function (close) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, error, reason;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!clientId || !clientSecret || !itemIds) {
                        setIsValid(false);
                        setError(t('It is required to provide both the client id, client secret and at least one item id.'));
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    return [4 /*yield*/, (0, fetch_1.send)('secret-set', {
                            name: 'pluggyai_clientId',
                            value: clientId,
                        })];
                case 1:
                    _a = (_d.sent()) || {}, error = _a.error, reason = _a.reason;
                    if (!error) return [3 /*break*/, 2];
                    setIsLoading(false);
                    setIsValid(false);
                    setError((0, errors_1.getSecretsError)(error, reason));
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, (0, fetch_1.send)('secret-set', {
                        name: 'pluggyai_clientSecret',
                        value: clientSecret,
                    })];
                case 3:
                    (_b = (_d.sent()) || {}, error = _b.error, reason = _b.reason);
                    if (!error) return [3 /*break*/, 4];
                    setIsLoading(false);
                    setIsValid(false);
                    setError((0, errors_1.getSecretsError)(error, reason));
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, (0, fetch_1.send)('secret-set', {
                        name: 'pluggyai_itemIds',
                        value: itemIds,
                    })];
                case 5:
                    (_c = (_d.sent()) || {}, error = _c.error, reason = _c.reason);
                    if (error) {
                        setIsLoading(false);
                        setIsValid(false);
                        setError((0, errors_1.getSecretsError)(error, reason));
                        return [2 /*return*/];
                    }
                    _d.label = 6;
                case 6:
                    setIsValid(true);
                    onSuccess();
                    setIsLoading(false);
                    close();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<Modal_1.Modal name="pluggyai-init" containerProps={{ style: { width: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Set-up Pluggy.ai')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ display: 'flex', gap: 10 }}>
            <text_1.Text>
              <react_i18next_1.Trans>
                In order to enable bank sync via Pluggy.ai (only for Brazilian
                banks) you will need to create access credentials. This can be
                done by creating an account with{' '}
                <Link_1.Link variant="external" to="https://actualbudget.org/docs/advanced/bank-sync/" linkColor="purple">
                  Pluggy.ai
                </Link_1.Link>
                .
              </react_i18next_1.Trans>
            </text_1.Text>

            <forms_1.FormField>
              <forms_1.FormLabel title={t('Client ID:')} htmlFor="client-id-field"/>
              <initial_focus_1.InitialFocus>
                <input_1.Input id="client-id-field" type="text" value={clientId} onChangeValue={function (value) {
                    setClientId(value);
                    setIsValid(true);
                }}/>
              </initial_focus_1.InitialFocus>
            </forms_1.FormField>

            <forms_1.FormField>
              <forms_1.FormLabel title={t('Client Secret:')} htmlFor="client-secret-field"/>
              <input_1.Input id="client-secret-field" type="password" value={clientSecret} onChangeValue={function (value) {
                    setClientSecret(value);
                    setIsValid(true);
                }}/>
            </forms_1.FormField>

            <forms_1.FormField>
              <forms_1.FormLabel title={t('Item Ids (comma separated):')} htmlFor="item-ids-field"/>
              <input_1.Input id="item-ids-field" type="text" value={itemIds} placeholder="78a3db91-2b6f-4f33-914f-0c5f29c5e6b1, 47cdfe32-bef9-4b82-9ea5-41b89f207749" onChangeValue={function (value) {
                    setItemIds(value);
                    setIsValid(true);
                }}/>
            </forms_1.FormField>

            {!isValid && <alerts_1.Error>{error}</alerts_1.Error>}
          </view_1.View>

          <Modal_1.ModalButtons>
            <button_1.ButtonWithLoading variant="primary" isLoading={isLoading} onPress={function () {
                    onSubmit(close);
                }}>
              <react_i18next_1.Trans>Save and continue</react_i18next_1.Trans>
            </button_1.ButtonWithLoading>
          </Modal_1.ModalButtons>
        </>);
        }}
    </Modal_1.Modal>);
};
exports.PluggyAiInitialiseModal = PluggyAiInitialiseModal;
