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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTransactionMenuModal = ScheduledTransactionMenuModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var months_1 = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
function ScheduledTransactionMenuModal(_a) {
    var _b;
    var transactionId = _a.transactionId, onSkip = _a.onSkip, onPost = _a.onPost, onComplete = _a.onComplete;
    var locale = (0, useLocale_1.useLocale)();
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    var scheduleId = (_b = transactionId === null || transactionId === void 0 ? void 0 : transactionId.split('/')) === null || _b === void 0 ? void 0 : _b[1];
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').filter({ id: scheduleId }).select('*'); }, [scheduleId]);
    var _c = (0, useSchedules_1.useSchedules)({
        query: schedulesQuery,
    }), isSchedulesLoading = _c.isLoading, schedules = _c.schedules;
    if (isSchedulesLoading) {
        return null;
    }
    var schedule = schedules === null || schedules === void 0 ? void 0 : schedules[0];
    var dateCond = (0, schedules_1.extractScheduleConds)(schedule._conditions).date;
    var canBeSkipped = (0, schedules_1.scheduleIsRecurring)(dateCond);
    var canBeCompleted = !(0, schedules_1.scheduleIsRecurring)(dateCond);
    return (<Modal_1.Modal name="scheduled-transaction-menu">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={<Modal_1.ModalTitle title={(schedule === null || schedule === void 0 ? void 0 : schedule.name) || ''} shrinkOnOverflow/>} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
            <text_1.Text style={{ fontSize: 17, fontWeight: 400 }}>
              <react_i18next_1.Trans>Scheduled date</react_i18next_1.Trans>
            </text_1.Text>
            <text_1.Text style={{ fontSize: 17, fontWeight: 700 }}>
              {(0, months_1.format)((schedule === null || schedule === void 0 ? void 0 : schedule.next_date) || '', 'MMMM dd, yyyy', locale)}
            </text_1.Text>
          </view_1.View>
          <ScheduledTransactionMenu transactionId={transactionId} onPost={onPost} onSkip={onSkip} onComplete={onComplete} canBeSkipped={canBeSkipped} canBeCompleted={canBeCompleted} getItemStyle={function () { return defaultMenuItemStyle; }}/>
        </>);
        }}
    </Modal_1.Modal>);
}
function ScheduledTransactionMenu(_a) {
    var transactionId = _a.transactionId, onSkip = _a.onSkip, onPost = _a.onPost, onComplete = _a.onComplete, canBeSkipped = _a.canBeSkipped, canBeCompleted = _a.canBeCompleted, props = __rest(_a, ["transactionId", "onSkip", "onPost", "onComplete", "canBeSkipped", "canBeCompleted"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'post':
                    onPost === null || onPost === void 0 ? void 0 : onPost(transactionId);
                    break;
                case 'post-today':
                    onPost === null || onPost === void 0 ? void 0 : onPost(transactionId, true);
                    break;
                case 'skip':
                    onSkip === null || onSkip === void 0 ? void 0 : onSkip(transactionId);
                    break;
                case 'complete':
                    onComplete === null || onComplete === void 0 ? void 0 : onComplete(transactionId);
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
        }} items={__spreadArray(__spreadArray([
            { name: 'post', text: t('Post transaction') },
            { name: 'post-today', text: t('Post transaction today') }
        ], (canBeSkipped
            ? [{ name: 'skip', text: t('Skip next scheduled date') }]
            : []), true), (canBeCompleted
            ? [{ name: 'complete', text: t('Mark as completed') }]
            : []), true)}/>);
}
