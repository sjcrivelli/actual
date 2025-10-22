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
exports.GoCardlessExternalMsgModal = GoCardlessExternalMsgModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var paragraph_1 = require("@actual-app/components/paragraph");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var alerts_1 = require("@desktop-client/components/alerts");
var Autocomplete_1 = require("@desktop-client/components/autocomplete/Autocomplete");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var countries_1 = require("@desktop-client/components/util/countries");
var useGoCardlessStatus_1 = require("@desktop-client/hooks/useGoCardlessStatus");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function useAvailableBanks(country) {
    var _a = (0, react_1.useState)([]), banks = _a[0], setBanks = _a[1];
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(false), isError = _c[0], setIsError = _c[1];
    (0, react_1.useEffect)(function () {
        function fetch() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setIsError(false);
                            if (!country) {
                                setBanks([]);
                                setIsLoading(false);
                                return [2 /*return*/];
                            }
                            setIsLoading(true);
                            return [4 /*yield*/, (0, fetch_1.sendCatch)('gocardless-get-banks', country)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !Array.isArray(data)) {
                                setIsError(true);
                                setBanks([]);
                            }
                            else {
                                setBanks(data);
                            }
                            setIsLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetch();
    }, [setBanks, setIsLoading, country]);
    return {
        data: banks,
        isLoading: isLoading,
        isError: isError,
    };
}
function renderError(error, t) {
    return (<alerts_1.Error style={{ alignSelf: 'center', marginBottom: 10 }}>
      {error.code === 'timeout'
            ? t('Timed out. Please try again.')
            : t('An error occurred while linking your account, sorry! The potential issue could be: {{ message }}', { message: error.message })}
    </alerts_1.Error>);
}
function GoCardlessExternalMsgModal(_a) {
    var onMoveExternal = _a.onMoveExternal, onSuccess = _a.onSuccess, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(null), waiting = _b[0], setWaiting = _b[1];
    var _c = (0, react_1.useState)(false), success = _c[0], setSuccess = _c[1];
    var _d = (0, react_1.useState)(), institutionId = _d[0], setInstitutionId = _d[1];
    var _e = (0, react_1.useState)(), country = _e[0], setCountry = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var _g = (0, react_1.useState)(null), isGoCardlessSetupComplete = _g[0], setIsGoCardlessSetupComplete = _g[1];
    var data = (0, react_1.useRef)(null);
    var _h = useAvailableBanks(country), bankOptions = _h.data, isBankOptionsLoading = _h.isLoading, isBankOptionError = _h.isError;
    var _j = (0, useGoCardlessStatus_1.useGoCardlessStatus)(), isConfigured = _j.configuredGoCardless, isConfigurationLoading = _j.isLoading;
    function onJump() {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setError(null);
                        setWaiting('browser');
                        return [4 /*yield*/, onMoveExternal({ institutionId: institutionId })];
                    case 1:
                        res = _a.sent();
                        if ('error' in res) {
                            setError({
                                code: res.error,
                                message: 'message' in res ? res.message : undefined,
                            });
                            setWaiting(null);
                            return [2 /*return*/];
                        }
                        data.current = res.data;
                        setWaiting(null);
                        setSuccess(true);
                        return [2 /*return*/];
                }
            });
        });
    }
    function onContinue() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setWaiting('accounts');
                        return [4 /*yield*/, onSuccess(data.current)];
                    case 1:
                        _a.sent();
                        setWaiting(null);
                        return [2 /*return*/];
                }
            });
        });
    }
    var onGoCardlessInit = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'gocardless-init',
                options: {
                    onSuccess: function () { return setIsGoCardlessSetupComplete(true); },
                },
            },
        }));
    };
    var renderLinkButton = function () {
        return (<view_1.View style={{ gap: 10 }}>
        <forms_1.FormField>
          <forms_1.FormLabel title={t('Choose your country:')} htmlFor="country-field"/>
          <Autocomplete_1.Autocomplete strict highlightFirst suggestions={countries_1.COUNTRY_OPTIONS} onSelect={setCountry} value={country} inputProps={{
                id: 'country-field',
                placeholder: t('(please select)'),
            }}/>
        </forms_1.FormField>

        {isBankOptionError ? (<alerts_1.Error>
            <react_i18next_1.Trans>
              Failed loading available banks: GoCardless access credentials
              might be misconfigured. Please{' '}
              <Link_1.Link variant="text" onClick={onGoCardlessInit} style={{ color: theme_1.theme.formLabelText, display: 'inline' }}>
                set them up
              </Link_1.Link>{' '}
              again.
            </react_i18next_1.Trans>
          </alerts_1.Error>) : (country &&
                (isBankOptionsLoading ? (t('Loading banks...')) : (<forms_1.FormField>
              <forms_1.FormLabel title={t('Choose your bank:')} htmlFor="bank-field"/>
              <Autocomplete_1.Autocomplete focused strict highlightFirst suggestions={bankOptions} onSelect={setInstitutionId} value={institutionId} inputProps={{
                        id: 'bank-field',
                        placeholder: t('(please select)'),
                    }}/>
            </forms_1.FormField>)))}

        <alerts_1.Warning>
          <react_i18next_1.Trans>
            By enabling bank sync, you will be granting GoCardless (a third
            party service) read-only access to your entire account’s transaction
            history. This service is not affiliated with Actual in any way. Make
            sure you’ve read and understand GoCardless’s{' '}
            <Link_1.Link variant="external" to="https://gocardless.com/privacy/" linkColor="purple">
              Privacy Policy
            </Link_1.Link>{' '}
            before proceeding.
          </react_i18next_1.Trans>
        </alerts_1.Warning>

        <view_1.View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <button_1.Button variant="primary" autoFocus style={{
                padding: '10px 0',
                fontSize: 15,
                fontWeight: 600,
                flexGrow: 1,
            }} onPress={onJump} isDisabled={!institutionId || !country}>
            <react_i18next_1.Trans>Link bank in browser</react_i18next_1.Trans> &rarr;
          </button_1.Button>
        </view_1.View>
      </view_1.View>);
    };
    return (<Modal_1.Modal name="gocardless-external-msg" onClose={onClose} containerProps={{ style: { width: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Link Your Bank')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <paragraph_1.Paragraph style={{ fontSize: 15 }}>
              <react_i18next_1.Trans>
                To link your bank account, you will be redirected to a new page
                where GoCardless will ask to connect to your bank. GoCardless
                will not be able to withdraw funds from your accounts.
              </react_i18next_1.Trans>
            </paragraph_1.Paragraph>

            {error && renderError(error, t)}

            {waiting || isConfigurationLoading ? (<view_1.View style={{ alignItems: 'center', marginTop: 15 }}>
                <AnimatedLoading_1.AnimatedLoading color={theme_1.theme.pageTextDark} style={{ width: 20, height: 20 }}/>
                <view_1.View style={{ marginTop: 10, color: theme_1.theme.pageText }}>
                  {isConfigurationLoading
                        ? t('Checking GoCardless configuration...')
                        : waiting === 'browser'
                            ? t('Waiting on GoCardless...')
                            : waiting === 'accounts'
                                ? t('Loading accounts...')
                                : null}
                </view_1.View>

                {waiting === 'browser' && (<Link_1.Link variant="text" onClick={onJump} style={{ marginTop: 10 }}>
                    (
                    <react_i18next_1.Trans>
                      Account linking not opening in a new tab? Click here
                    </react_i18next_1.Trans>
                    )
                  </Link_1.Link>)}
              </view_1.View>) : success ? (<button_1.Button variant="primary" autoFocus style={{
                        padding: '10px 0',
                        fontSize: 15,
                        fontWeight: 600,
                        marginTop: 10,
                    }} onPress={onContinue}>
                <react_i18next_1.Trans>Success! Click to continue</react_i18next_1.Trans> &rarr;
              </button_1.Button>) : isConfigured || isGoCardlessSetupComplete ? (renderLinkButton()) : (<>
                <paragraph_1.Paragraph style={{ color: theme_1.theme.errorText }}>
                  <react_i18next_1.Trans>
                    GoCardless integration has not yet been configured.
                  </react_i18next_1.Trans>
                </paragraph_1.Paragraph>
                <button_1.Button variant="primary" onPress={onGoCardlessInit}>
                  <react_i18next_1.Trans>Configure GoCardless integration</react_i18next_1.Trans>
                </button_1.Button>
              </>)}
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
