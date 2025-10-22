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
exports.CreateLocalAccountModal = CreateLocalAccountModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var form_error_1 = require("@actual-app/components/form-error");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var inline_field_1 = require("@actual-app/components/inline-field");
var input_1 = require("@actual-app/components/input");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var util_1 = require("loot-core/shared/util");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var accountValidation_1 = require("@desktop-client/components/util/accountValidation");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function CreateLocalAccountModal() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var dispatch = (0, redux_1.useDispatch)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var _a = (0, react_1.useState)(''), name = _a[0], setName = _a[1];
    var _b = (0, react_1.useState)(false), offbudget = _b[0], setOffbudget = _b[1];
    var _c = (0, react_1.useState)('0'), balance = _c[0], setBalance = _c[1];
    var _d = (0, react_1.useState)(null), nameError = _d[0], setNameError = _d[1];
    var _e = (0, react_1.useState)(false), balanceError = _e[0], setBalanceError = _e[1];
    var validateBalance = function (balance) { return !isNaN(parseFloat(balance)); };
    var validateAndSetName = function (name) {
        var nameError = (0, accountValidation_1.validateAccountName)(name, '', accounts);
        if (nameError) {
            setNameError(nameError);
        }
        else {
            setName(name);
            setNameError(null);
        }
    };
    var onSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var nameError, balanceError, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    nameError = (0, accountValidation_1.validateAccountName)(name, '', accounts);
                    balanceError = !validateBalance(balance);
                    setBalanceError(balanceError);
                    if (!(!nameError && !balanceError)) return [3 /*break*/, 2];
                    dispatch((0, modalsSlice_1.closeModal)());
                    return [4 /*yield*/, dispatch((0, accountsSlice_1.createAccount)({
                            name: name,
                            balance: (0, util_1.toRelaxedNumber)(balance),
                            offBudget: offbudget,
                        })).unwrap()];
                case 1:
                    id = _a.sent();
                    navigate('/accounts/' + id);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return (<Modal_1.Modal name="add-local-account">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={<Modal_1.ModalTitle title={t('Create Local Account')} shrinkOnOverflow/>} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <react_aria_components_1.Form onSubmit={onSubmit}>
              <inline_field_1.InlineField label={t('Name')} width="100%">
                <initial_focus_1.InitialFocus>
                  <input_1.Input name="name" value={name} onChangeValue={setName} onUpdate={function (value) {
                    var name = value.trim();
                    validateAndSetName(name);
                }} style={{ flex: 1 }}/>
                </initial_focus_1.InitialFocus>
              </inline_field_1.InlineField>
              {nameError && (<form_error_1.FormError style={{ marginLeft: 75, color: theme_1.theme.warningText }}>
                  {nameError}
                </form_error_1.FormError>)}

              <view_1.View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                <view_1.View style={{ flexDirection: 'column' }}>
                  <view_1.View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    <forms_1.Checkbox id="offbudget" name="offbudget" checked={offbudget} onChange={function () { return setOffbudget(!offbudget); }}/>
                    <label htmlFor="offbudget" style={{
                    userSelect: 'none',
                    verticalAlign: 'center',
                }}>
                      <react_i18next_1.Trans>Off budget</react_i18next_1.Trans>
                    </label>
                  </view_1.View>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '0.7em',
                    color: theme_1.theme.pageTextLight,
                    marginTop: 3,
                }}>
                    <text_1.Text>
                      <react_i18next_1.Trans>
                        This cannot be changed later. See{' '}
                        <Link_1.Link variant="external" linkColor="muted" to="https://actualbudget.org/docs/accounts/#off-budget-accounts">
                          Accounts Overview
                        </Link_1.Link>{' '}
                        for more information.
                      </react_i18next_1.Trans>
                    </text_1.Text>
                  </div>
                </view_1.View>
              </view_1.View>

              <inline_field_1.InlineField label={t('Balance')} width="100%">
                <input_1.Input name="balance" inputMode="decimal" value={balance} onChangeValue={setBalance} onUpdate={function (value) {
                    var balance = value.trim();
                    setBalance(balance);
                    if (validateBalance(balance) && balanceError) {
                        setBalanceError(false);
                    }
                }} style={{ flex: 1 }}/>
              </inline_field_1.InlineField>
              {balanceError && (<form_error_1.FormError style={{ marginLeft: 75 }}>
                  <react_i18next_1.Trans>Balance must be a number</react_i18next_1.Trans>
                </form_error_1.FormError>)}

              <Modal_1.ModalButtons>
                <button_1.Button onPress={close}>
                  <react_i18next_1.Trans>Back</react_i18next_1.Trans>
                </button_1.Button>
                <button_1.Button type="submit" variant="primary" style={{ marginLeft: 10 }}>
                  <react_i18next_1.Trans>Create</react_i18next_1.Trans>
                </button_1.Button>
              </Modal_1.ModalButtons>
            </react_aria_components_1.Form>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
