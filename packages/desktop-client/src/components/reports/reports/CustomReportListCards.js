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
exports.CustomReportListCards = CustomReportListCards;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var GetCardData_1 = require("./GetCardData");
var MissingReportCard_1 = require("./MissingReportCard");
var DateRange_1 = require("@desktop-client/components/reports/DateRange");
var ReportCard_1 = require("@desktop-client/components/reports/ReportCard");
var ReportCardName_1 = require("@desktop-client/components/reports/ReportCardName");
var util_1 = require("@desktop-client/components/reports/util");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function CustomReportListCards(_a) {
    var isEditing = _a.isEditing, report = _a.report, onRemove = _a.onRemove;
    // It's possible for a dashboard to reference a non-existing
    // custom report
    if (!report) {
        return (<MissingReportCard_1.MissingReportCard isEditing={isEditing} onRemove={onRemove}>
        <react_i18next_1.Trans>This custom report has been deleted.</react_i18next_1.Trans>
      </MissingReportCard_1.MissingReportCard>);
    }
    return (<CustomReportListCardsInner isEditing={isEditing} report={report} onRemove={onRemove}/>);
}
function CustomReportListCardsInner(_a) {
    var _this = this;
    var _b;
    var isEditing = _a.isEditing, report = _a.report, onRemove = _a.onRemove;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _c = (0, react_1.useState)(false), nameMenuOpen = _c[0], setNameMenuOpen = _c[1];
    var _d = (0, react_1.useState)(''), earliestTransaction = _d[0], setEarliestTransaction = _d[1];
    var _e = (0, react_1.useState)(''), latestTransaction = _e[0], setLatestTransaction = _e[1];
    var payees = (0, usePayees_1.usePayees)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var categories = (0, useCategories_1.useCategories)();
    var hasWarning = (0, util_1.calculateHasWarning)((_b = report.conditions) !== null && _b !== void 0 ? _b : [], {
        categories: categories.list,
        payees: payees,
        accounts: accounts,
    });
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var earliestTrans, latestTrans;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-earliest-transaction')];
                        case 1:
                            earliestTrans = _a.sent();
                            return [4 /*yield*/, (0, fetch_1.send)('get-latest-transaction')];
                        case 2:
                            latestTrans = _a.sent();
                            setEarliestTransaction(earliestTrans ? earliestTrans.date : monthUtils.currentDay());
                            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, []);
    var onSaveName = function (name) { return __awaiter(_this, void 0, void 0, function () {
        var updatedReport, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updatedReport = __assign(__assign({}, report), { name: name });
                    return [4 /*yield*/, (0, fetch_1.sendCatch)('report/update', updatedReport)];
                case 1:
                    response = _a.sent();
                    if (response.error) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                message: t('Failed saving report name: {{error}}', {
                                    error: response.error.message,
                                }),
                            },
                        }));
                        setNameMenuOpen(true);
                        return [2 /*return*/];
                    }
                    setNameMenuOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<ReportCard_1.ReportCard isEditing={isEditing} disableClick={nameMenuOpen} to={"/reports/custom/".concat(report.id)} menuItems={[
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
                case 'remove':
                    onRemove();
                    break;
                case 'rename':
                    setNameMenuOpen(true);
                    break;
            }
        }}>
      <view_1.View style={{ flex: 1, padding: 10 }}>
        <view_1.View style={{
            flexShrink: 0,
            paddingBottom: 5,
        }}>
          <view_1.View style={{ flex: 1 }}>
            <ReportCardName_1.ReportCardName name={report.name} isEditing={nameMenuOpen} onChange={onSaveName} onClose={function () { return setNameMenuOpen(false); }}/>
            {report.isDateStatic ? (<DateRange_1.DateRange start={report.startDate} end={report.endDate}/>) : (<text_1.Text style={{ color: theme_1.theme.pageTextSubdued }}>
                {t(report.dateRange)}
              </text_1.Text>)}
          </view_1.View>
        </view_1.View>
        <GetCardData_1.GetCardData report={report} payees={payees} accounts={accounts} categories={categories} earliestTransaction={earliestTransaction} latestTransaction={latestTransaction} firstDayOfWeekIdx={firstDayOfWeekIdx} showTooltip={!isEditing}/>
      </view_1.View>
      {hasWarning && (<view_1.View style={{ padding: 5, position: 'absolute', bottom: 0 }}>
          <tooltip_1.Tooltip content={t('The widget is configured to use a non-existing filter value (i.e. category/account/payee). Edit the filters used in this report widget to remove the warning.')} placement="bottom start" style={__assign(__assign({}, styles_1.styles.tooltip), { maxWidth: 300 })}>
            <v1_1.SvgExclamationSolid width={20} height={20} style={{ color: theme_1.theme.warningText }}/>
          </tooltip_1.Tooltip>
        </view_1.View>)}
    </ReportCard_1.ReportCard>);
}
