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
exports.CreateAccountModal = CreateAccountModal;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var menu_1 = require("@actual-app/components/menu");
var paragraph_1 = require("@actual-app/components/paragraph");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var AuthProvider_1 = require("@desktop-client/auth/AuthProvider");
var types_1 = require("@desktop-client/auth/types");
var alerts_1 = require("@desktop-client/components/alerts");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var gocardless_1 = require("@desktop-client/gocardless");
var useGoCardlessStatus_1 = require("@desktop-client/hooks/useGoCardlessStatus");
var usePluggyAiStatus_1 = require("@desktop-client/hooks/usePluggyAiStatus");
var useSimpleFinStatus_1 = require("@desktop-client/hooks/useSimpleFinStatus");
var useSyncServerStatus_1 = require("@desktop-client/hooks/useSyncServerStatus");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function CreateAccountModal(_a) {
    var _this = this;
    var upgradingAccountId = _a.upgradingAccountId;
    var t = (0, react_i18next_1.useTranslation)().t;
    var syncServerStatus = (0, useSyncServerStatus_1.useSyncServerStatus)();
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(null), isGoCardlessSetupComplete = _b[0], setIsGoCardlessSetupComplete = _b[1];
    var _c = (0, react_1.useState)(null), isSimpleFinSetupComplete = _c[0], setIsSimpleFinSetupComplete = _c[1];
    var _d = (0, react_1.useState)(null), isPluggyAiSetupComplete = _d[0], setIsPluggyAiSetupComplete = _d[1];
    var hasPermission = (0, AuthProvider_1.useAuth)().hasPermission;
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var onConnectGoCardless = function () {
        if (!isGoCardlessSetupComplete) {
            onGoCardlessInit();
            return;
        }
        if (upgradingAccountId == null) {
            (0, gocardless_1.authorizeBank)(dispatch);
        }
        else {
            (0, gocardless_1.authorizeBank)(dispatch);
        }
    };
    var onConnectSimpleFin = function () { return __awaiter(_this, void 0, void 0, function () {
        var results, newAccounts, _i, _a, oldAccount, newAccount, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!isSimpleFinSetupComplete) {
                        onSimpleFinInit();
                        return [2 /*return*/];
                    }
                    if (loadingSimpleFinAccounts) {
                        return [2 /*return*/];
                    }
                    setLoadingSimpleFinAccounts(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetch_1.send)('simplefin-accounts')];
                case 2:
                    results = _c.sent();
                    if (results.error_code) {
                        throw new Error(results.reason);
                    }
                    newAccounts = [];
                    for (_i = 0, _a = (_b = results.accounts) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        oldAccount = _a[_i];
                        newAccount = {
                            account_id: oldAccount.id,
                            name: oldAccount.name,
                            institution: oldAccount.org.name,
                            orgDomain: oldAccount.org.domain,
                            orgId: oldAccount.org.id,
                            balance: oldAccount.balance,
                        };
                        newAccounts.push(newAccount);
                    }
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'select-linked-accounts',
                            options: {
                                externalAccounts: newAccounts,
                                syncSource: 'simpleFin',
                            },
                        },
                    }));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    console.error(err_1);
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'simplefin-init',
                            options: {
                                onSuccess: function () { return setIsSimpleFinSetupComplete(true); },
                            },
                        },
                    }));
                    return [3 /*break*/, 4];
                case 4:
                    setLoadingSimpleFinAccounts(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var onConnectPluggyAi = function () { return __awaiter(_this, void 0, void 0, function () {
        var results, newAccounts, _i, _a, oldAccount, newAccount, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isPluggyAiSetupComplete) {
                        onPluggyAiInit();
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetch_1.send)('pluggyai-accounts')];
                case 2:
                    results = _b.sent();
                    if (results.error_code) {
                        throw new Error(results.reason);
                    }
                    else if ('error' in results) {
                        throw new Error(results.error);
                    }
                    newAccounts = [];
                    for (_i = 0, _a = results.accounts; _i < _a.length; _i++) {
                        oldAccount = _a[_i];
                        newAccount = {
                            account_id: oldAccount.id,
                            name: "".concat(oldAccount.name.trim(), " - ").concat(oldAccount.type === 'BANK' ? oldAccount.taxNumber : oldAccount.owner),
                            institution: oldAccount.name,
                            orgDomain: null,
                            orgId: oldAccount.id,
                            balance: oldAccount.type === 'BANK'
                                ? oldAccount.bankData.automaticallyInvestedBalance +
                                    oldAccount.bankData.closingBalance
                                : oldAccount.balance,
                        };
                        newAccounts.push(newAccount);
                    }
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'select-linked-accounts',
                            options: {
                                externalAccounts: newAccounts,
                                syncSource: 'pluggyai',
                            },
                        },
                    }));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    console.error(err_2);
                    (0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'error',
                            title: t('Error when trying to contact Pluggy.ai'),
                            message: err_2.message,
                            timeout: 5000,
                        },
                    });
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'pluggyai-init',
                            options: {
                                onSuccess: function () { return setIsPluggyAiSetupComplete(true); },
                            },
                        },
                    }));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
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
    var onSimpleFinInit = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'simplefin-init',
                options: {
                    onSuccess: function () { return setIsSimpleFinSetupComplete(true); },
                },
            },
        }));
    };
    var onPluggyAiInit = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'pluggyai-init',
                options: {
                    onSuccess: function () { return setIsPluggyAiSetupComplete(true); },
                },
            },
        }));
    };
    var onGoCardlessReset = function () {
        (0, fetch_1.send)('secret-set', {
            name: 'gocardless_secretId',
            value: null,
        }).then(function () {
            (0, fetch_1.send)('secret-set', {
                name: 'gocardless_secretKey',
                value: null,
            }).then(function () {
                setIsGoCardlessSetupComplete(false);
            });
        });
    };
    var onSimpleFinReset = function () {
        (0, fetch_1.send)('secret-set', {
            name: 'simplefin_token',
            value: null,
        }).then(function () {
            (0, fetch_1.send)('secret-set', {
                name: 'simplefin_accessKey',
                value: null,
            }).then(function () {
                setIsSimpleFinSetupComplete(false);
            });
        });
    };
    var onPluggyAiReset = function () {
        (0, fetch_1.send)('secret-set', {
            name: 'pluggyai_clientId',
            value: null,
        }).then(function () {
            (0, fetch_1.send)('secret-set', {
                name: 'pluggyai_clientSecret',
                value: null,
            }).then(function () {
                (0, fetch_1.send)('secret-set', {
                    name: 'pluggyai_itemIds',
                    value: null,
                }).then(function () {
                    setIsPluggyAiSetupComplete(false);
                });
            });
        });
    };
    var onCreateLocalAccount = function () {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'add-local-account' } }));
    };
    var configuredGoCardless = (0, useGoCardlessStatus_1.useGoCardlessStatus)().configuredGoCardless;
    (0, react_1.useEffect)(function () {
        setIsGoCardlessSetupComplete(configuredGoCardless);
    }, [configuredGoCardless]);
    var configuredSimpleFin = (0, useSimpleFinStatus_1.useSimpleFinStatus)().configuredSimpleFin;
    (0, react_1.useEffect)(function () {
        setIsSimpleFinSetupComplete(configuredSimpleFin);
    }, [configuredSimpleFin]);
    var configuredPluggyAi = (0, usePluggyAiStatus_1.usePluggyAiStatus)().configuredPluggyAi;
    (0, react_1.useEffect)(function () {
        setIsPluggyAiSetupComplete(configuredPluggyAi);
    }, [configuredPluggyAi]);
    var title = t('Add account');
    var _e = (0, react_1.useState)(false), loadingSimpleFinAccounts = _e[0], setLoadingSimpleFinAccounts = _e[1];
    if (upgradingAccountId != null) {
        title = t('Link account');
    }
    var canSetSecrets = !multiuserEnabled || hasPermission(types_1.Permissions.ADMINISTRATOR);
    return (<Modal_1.Modal name="add-account">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={title} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ maxWidth: 500, gap: 30, color: theme_1.theme.pageText }}>
            {upgradingAccountId == null && (<view_1.View style={{ gap: 10 }}>
                <initial_focus_1.InitialFocus>
                  <button_1.Button variant="primary" style={{
                        padding: '10px 0',
                        fontSize: 15,
                        fontWeight: 600,
                    }} onPress={onCreateLocalAccount}>
                    <react_i18next_1.Trans>Create a local account</react_i18next_1.Trans>
                  </button_1.Button>
                </initial_focus_1.InitialFocus>
                <view_1.View style={{ lineHeight: '1.4em', fontSize: 15 }}>
                  <text_1.Text>
                    <react_i18next_1.Trans>
                      <strong>Create a local account</strong> if you want to add
                      transactions manually. You can also{' '}
                      <Link_1.Link variant="external" to="https://actualbudget.org/docs/transactions/importing" linkColor="muted">
                        import QIF/OFX/QFX files into a local account
                      </Link_1.Link>
                      .
                    </react_i18next_1.Trans>
                  </text_1.Text>
                </view_1.View>
              </view_1.View>)}
            <view_1.View style={{ gap: 10 }}>
              {syncServerStatus === 'online' ? (<>
                  {canSetSecrets && (<>
                      <view_1.View style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                        }}>
                        <button_1.ButtonWithLoading isDisabled={syncServerStatus !== 'online'} style={{
                            padding: '10px 0',
                            fontSize: 15,
                            fontWeight: 600,
                            flex: 1,
                        }} onPress={onConnectGoCardless}>
                          {isGoCardlessSetupComplete
                            ? t('Link bank account with GoCardless')
                            : t('Set up GoCardless for bank sync')}
                        </button_1.ButtonWithLoading>
                        {isGoCardlessSetupComplete && (<react_aria_components_1.DialogTrigger>
                            <button_1.Button variant="bare" aria-label={t('GoCardless menu')}>
                              <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
                            </button_1.Button>

                            <popover_1.Popover>
                              <react_aria_components_1.Dialog>
                                <menu_1.Menu onMenuSelect={function (item) {
                                if (item === 'reconfigure') {
                                    onGoCardlessReset();
                                }
                            }} items={[
                                {
                                    name: 'reconfigure',
                                    text: t('Reset GoCardless credentials'),
                                },
                            ]}/>
                              </react_aria_components_1.Dialog>
                            </popover_1.Popover>
                          </react_aria_components_1.DialogTrigger>)}
                      </view_1.View>
                      <text_1.Text style={{ lineHeight: '1.4em', fontSize: 15 }}>
                        <react_i18next_1.Trans>
                          <strong>
                            Link a <em>European</em> bank account
                          </strong>{' '}
                          to automatically download transactions. GoCardless
                          provides reliable, up-to-date information from
                          hundreds of banks.
                        </react_i18next_1.Trans>
                      </text_1.Text>
                      <view_1.View style={{
                            flexDirection: 'row',
                            gap: 10,
                            marginTop: '18px',
                            alignItems: 'center',
                        }}>
                        <button_1.ButtonWithLoading isDisabled={syncServerStatus !== 'online'} isLoading={loadingSimpleFinAccounts} style={{
                            padding: '10px 0',
                            fontSize: 15,
                            fontWeight: 600,
                            flex: 1,
                        }} onPress={onConnectSimpleFin}>
                          {isSimpleFinSetupComplete
                            ? t('Link bank account with SimpleFIN')
                            : t('Set up SimpleFIN for bank sync')}
                        </button_1.ButtonWithLoading>
                        {isSimpleFinSetupComplete && (<react_aria_components_1.DialogTrigger>
                            <button_1.Button variant="bare" aria-label={t('SimpleFIN menu')}>
                              <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
                            </button_1.Button>
                            <popover_1.Popover>
                              <react_aria_components_1.Dialog>
                                <menu_1.Menu onMenuSelect={function (item) {
                                if (item === 'reconfigure') {
                                    onSimpleFinReset();
                                }
                            }} items={[
                                {
                                    name: 'reconfigure',
                                    text: t('Reset SimpleFIN credentials'),
                                },
                            ]}/>
                              </react_aria_components_1.Dialog>
                            </popover_1.Popover>
                          </react_aria_components_1.DialogTrigger>)}
                      </view_1.View>
                      <text_1.Text style={{ lineHeight: '1.4em', fontSize: 15 }}>
                        <react_i18next_1.Trans>
                          <strong>
                            Link a <em>North American</em> bank account
                          </strong>{' '}
                          to automatically download transactions. SimpleFIN
                          provides reliable, up-to-date information from
                          hundreds of banks.
                        </react_i18next_1.Trans>
                      </text_1.Text>

                      <view_1.View style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                        }}>
                        <button_1.ButtonWithLoading isDisabled={syncServerStatus !== 'online'} style={{
                            padding: '10px 0',
                            fontSize: 15,
                            fontWeight: 600,
                            flex: 1,
                        }} onPress={onConnectPluggyAi}>
                          {isPluggyAiSetupComplete
                            ? t('Link bank account with Pluggy.ai')
                            : t('Set up Pluggy.ai for bank sync')}
                        </button_1.ButtonWithLoading>
                        {isPluggyAiSetupComplete && (<react_aria_components_1.DialogTrigger>
                            <button_1.Button variant="bare" aria-label={t('Pluggy.ai menu')}>
                              <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
                            </button_1.Button>

                            <popover_1.Popover>
                              <react_aria_components_1.Dialog>
                                <menu_1.Menu onMenuSelect={function (item) {
                                if (item === 'reconfigure') {
                                    onPluggyAiReset();
                                }
                            }} items={[
                                {
                                    name: 'reconfigure',
                                    text: t('Reset Pluggy.ai credentials'),
                                },
                            ]}/>
                              </react_aria_components_1.Dialog>
                            </popover_1.Popover>
                          </react_aria_components_1.DialogTrigger>)}
                      </view_1.View>
                      <text_1.Text style={{ lineHeight: '1.4em', fontSize: 15 }}>
                        <react_i18next_1.Trans>
                          <strong>
                            Link a <em>Brazilian</em> bank account
                          </strong>{' '}
                          to automatically download transactions. Pluggy.ai
                          provides reliable, up-to-date information from
                          hundreds of banks.
                        </react_i18next_1.Trans>
                      </text_1.Text>
                    </>)}

                  {(!isGoCardlessSetupComplete ||
                        !isSimpleFinSetupComplete ||
                        !isPluggyAiSetupComplete) &&
                        !canSetSecrets && (<alerts_1.Warning>
                        <react_i18next_1.Trans>
                          You don&apos;t have the required permissions to set up
                          secrets. Please contact an Admin to configure
                        </react_i18next_1.Trans>{' '}
                        {[
                            isGoCardlessSetupComplete ? '' : 'GoCardless',
                            isSimpleFinSetupComplete ? '' : 'SimpleFIN',
                            isPluggyAiSetupComplete ? '' : 'Pluggy.ai',
                        ]
                            .filter(Boolean)
                            .join(' or ')}
                        .
                      </alerts_1.Warning>)}
                </>) : (<>
                  <button_1.Button isDisabled style={{
                        padding: '10px 0',
                        fontSize: 15,
                        fontWeight: 600,
                    }}>
                    <react_i18next_1.Trans>Set up bank sync</react_i18next_1.Trans>
                  </button_1.Button>
                  <paragraph_1.Paragraph style={{ fontSize: 15 }}>
                    <react_i18next_1.Trans>
                      Connect to an Actual server to set up{' '}
                      <Link_1.Link variant="external" to="https://actualbudget.org/docs/advanced/bank-sync" linkColor="muted">
                        automatic syncing
                      </Link_1.Link>
                      .
                    </react_i18next_1.Trans>
                  </paragraph_1.Paragraph>
                </>)}
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
