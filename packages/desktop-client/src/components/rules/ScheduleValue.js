"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValue = ScheduleValue;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var view_1 = require("@actual-app/components/view");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var Value_1 = require("./Value");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
function ScheduleValue(_a) {
    var value = _a.value;
    var t = (0, react_i18next_1.useTranslation)().t;
    var payees = (0, usePayees_1.usePayees)();
    var byId = (0, payeesSlice_1.getPayeesById)(payees);
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []);
    var _b = (0, useSchedules_1.useSchedules)({ query: schedulesQuery }), _c = _b.schedules, schedules = _c === void 0 ? [] : _c, isLoading = _b.isLoading;
    if (isLoading) {
        return (<view_1.View aria-label={t('Loading...')} style={{ display: 'inline-flex' }}>
        <AnimatedLoading_1.AnimatedLoading width={10} height={10}/>
      </view_1.View>);
    }
    return (<Value_1.Value value={value} field="rule" data={schedules} 
    // TODO: this manual type coercion does not make much sense -
    // should we instead do `schedule._payee.id`?
    describe={function (schedule) {
            return (0, schedules_1.describeSchedule)(schedule, byId[schedule._payee]);
        }}/>);
}
