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
exports.NetWorthCard = NetWorthCard;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var Change_1 = require("@desktop-client/components/reports/Change");
var DateRange_1 = require("@desktop-client/components/reports/DateRange");
var NetWorthGraph_1 = require("@desktop-client/components/reports/graphs/NetWorthGraph");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ReportCard_1 = require("@desktop-client/components/reports/ReportCard");
var ReportCardName_1 = require("@desktop-client/components/reports/ReportCardName");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var net_worth_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/net-worth-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function NetWorthCard(_a) {
    var widgetId = _a.widgetId, isEditing = _a.isEditing, accounts = _a.accounts, _b = _a.meta, meta = _b === void 0 ? {} : _b, onMetaChange = _a.onMetaChange, onRemove = _a.onRemove;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    var format = (0, useFormat_1.useFormat)();
    var _c = (0, react_1.useState)(''), latestTransaction = _c[0], setLatestTransaction = _c[1];
    var _d = (0, react_1.useState)(false), nameMenuOpen = _d[0], setNameMenuOpen = _d[1];
    var _e = (0, react_1.useState)(false), isCardHovered = _e[0], setIsCardHovered = _e[1];
    (0, react_1.useEffect)(function () {
        function fetchLatestTransaction() {
            return __awaiter(this, void 0, void 0, function () {
                var latestTrans;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-latest-transaction')];
                        case 1:
                            latestTrans = _a.sent();
                            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchLatestTransaction();
    }, []);
    var _f = (0, reportRanges_1.calculateTimeRange)(meta === null || meta === void 0 ? void 0 : meta.timeFrame, undefined, latestTransaction), start = _f[0], end = _f[1];
    var onCardHover = (0, react_1.useCallback)(function () { return setIsCardHovered(true); }, []);
    var onCardHoverEnd = (0, react_1.useCallback)(function () { return setIsCardHovered(false); }, []);
    var params = (0, react_1.useMemo)(function () {
        return (0, net_worth_spreadsheet_1.createSpreadsheet)(start, end, accounts, meta === null || meta === void 0 ? void 0 : meta.conditions, meta === null || meta === void 0 ? void 0 : meta.conditionsOp, locale, (meta === null || meta === void 0 ? void 0 : meta.interval) || 'Monthly', firstDayOfWeekIdx, format);
    }, [
        start,
        end,
        accounts,
        meta === null || meta === void 0 ? void 0 : meta.conditions,
        meta === null || meta === void 0 ? void 0 : meta.conditionsOp,
        locale,
        meta === null || meta === void 0 ? void 0 : meta.interval,
        firstDayOfWeekIdx,
        format,
    ]);
    var data = (0, useReport_1.useReport)('net_worth', params);
    return (<ReportCard_1.ReportCard isEditing={isEditing} disableClick={nameMenuOpen} to={"/reports/net-worth/".concat(widgetId)} menuItems={[
            {
                name: 'rename',
                text: t('Rename'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ]} onMenuSelect={function (item) {
            switch (item) {
                case 'rename':
                    setNameMenuOpen(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error("Unrecognized selection: ".concat(item));
            }
        }}>
      <view_1.View style={{ flex: 1 }} onPointerEnter={onCardHover} onPointerLeave={onCardHoverEnd}>
        <view_1.View style={{ flexDirection: 'row', padding: 20 }}>
          <view_1.View style={{ flex: 1 }}>
            <ReportCardName_1.ReportCardName name={(meta === null || meta === void 0 ? void 0 : meta.name) || t('Net Worth')} isEditing={nameMenuOpen} onChange={function (newName) {
            onMetaChange(__assign(__assign({}, meta), { name: newName }));
            setNameMenuOpen(false);
        }} onClose={function () { return setNameMenuOpen(false); }}/>
            <DateRange_1.DateRange start={start} end={end}/>
          </view_1.View>
          {data && (<view_1.View style={{ textAlign: 'right' }}>
              <block_1.Block style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 500, marginBottom: 5 })}>
                <PrivacyFilter_1.PrivacyFilter activationFilters={[!isCardHovered]}>
                  {format(data.netWorth, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </block_1.Block>
              <PrivacyFilter_1.PrivacyFilter activationFilters={[!isCardHovered]}>
                <Change_1.Change amount={data.totalChange}/>
              </PrivacyFilter_1.PrivacyFilter>
            </view_1.View>)}
        </view_1.View>

        {data ? (<NetWorthGraph_1.NetWorthGraph graphData={data.graphData} compact={true} showTooltip={!isEditing && !isNarrowWidth} interval={(meta === null || meta === void 0 ? void 0 : meta.interval) || 'Monthly'} style={{ height: 'auto', flex: 1 }}/>) : (<LoadingIndicator_1.LoadingIndicator />)}
      </view_1.View>
    </ReportCard_1.ReportCard>);
}
