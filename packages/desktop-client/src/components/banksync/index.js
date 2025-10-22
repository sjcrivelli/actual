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
exports.BankSync = BankSync;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var AccountsHeader_1 = require("./AccountsHeader");
var AccountsList_1 = require("./AccountsList");
var MobileNavTabs_1 = require("@desktop-client/components/mobile/MobileNavTabs");
var Page_1 = require("@desktop-client/components/Page");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var useSyncSourceReadable = function () {
    var t = (0, react_i18next_1.useTranslation)().t;
    var syncSourceReadable = {
        goCardless: 'GoCardless',
        simpleFin: 'SimpleFIN',
        pluggyai: 'Pluggy.ai',
        unlinked: t('Unlinked'),
    };
    return { syncSourceReadable: syncSourceReadable };
};
function BankSync() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var floatingSidebar = (0, useGlobalPref_1.useGlobalPref)('floatingSidebar')[0];
    var syncSourceReadable = useSyncSourceReadable().syncSourceReadable;
    var accounts = (0, useAccounts_1.useAccounts)();
    var dispatch = (0, redux_1.useDispatch)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _a = (0, react_1.useState)(null), hoveredAccount = _a[0], setHoveredAccount = _a[1];
    var groupedAccounts = (0, react_1.useMemo)(function () {
        var unsorted = accounts
            .filter(function (a) { return !a.closed; })
            .reduce(function (acc, a) {
            var _a;
            var syncSource = (_a = a.account_sync_source) !== null && _a !== void 0 ? _a : 'unlinked';
            acc[syncSource] = acc[syncSource] || [];
            acc[syncSource].push(a);
            return acc;
        }, {});
        var sortedKeys = Object.keys(unsorted).sort(function (keyA, keyB) {
            if (keyA === 'unlinked')
                return 1;
            if (keyB === 'unlinked')
                return -1;
            return keyA.localeCompare(keyB);
        });
        return sortedKeys.reduce(function (sorted, key) {
            sorted[key] = unsorted[key];
            return sorted;
        }, {});
    }, [accounts]);
    var onAction = function (account, action) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (action) {
                case 'edit':
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'synced-account-edit',
                            options: {
                                account: account,
                            },
                        },
                    }));
                    break;
                case 'link':
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'add-account',
                            options: { upgradingAccountId: account.id },
                        },
                    }));
                    break;
                default:
                    break;
            }
            return [2 /*return*/];
        });
    }); };
    var onHover = (0, react_1.useCallback)(function (id) {
        setHoveredAccount(id);
    }, []);
    return (<Page_1.Page header={t('Bank Sync')} style={{
            marginInline: floatingSidebar && !isNarrowWidth ? 'auto' : 0,
            paddingBottom: MobileNavTabs_1.MOBILE_NAV_HEIGHT,
        }}>
      <view_1.View style={{ marginTop: '1em' }}>
        {accounts.length === 0 && (<text_1.Text style={{ fontSize: '1.1rem' }}>
            <react_i18next_1.Trans>
              To use the bank syncing features, you must first add an account.
            </react_i18next_1.Trans>
          </text_1.Text>)}
        {Object.entries(groupedAccounts).map(function (_a) {
            var syncProvider = _a[0], accounts = _a[1];
            return (<view_1.View key={syncProvider} style={{ minHeight: 'initial' }}>
              {Object.keys(groupedAccounts).length > 1 && (<text_1.Text style={{ fontWeight: 500, fontSize: 20, margin: '.5em 0' }}>
                  {syncSourceReadable[syncProvider]}
                </text_1.Text>)}
              <AccountsHeader_1.AccountsHeader unlinked={syncProvider === 'unlinked'}/>
              <AccountsList_1.AccountsList accounts={accounts} hoveredAccount={hoveredAccount} onHover={onHover} onAction={onAction}/>
            </view_1.View>);
        })}
      </view_1.View>
    </Page_1.Page>);
}
