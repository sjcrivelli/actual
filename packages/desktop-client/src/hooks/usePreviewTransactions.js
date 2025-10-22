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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreviewTransactions = usePreviewTransactions;
var react_1 = require("react");
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var months_1 = require("loot-core/shared/months");
var schedules_1 = require("loot-core/shared/schedules");
var transactions_1 = require("loot-core/shared/transactions");
var useCachedSchedules_1 = require("./useCachedSchedules");
var useSyncedPref_1 = require("./useSyncedPref");
var useTransactions_1 = require("./useTransactions");
function usePreviewTransactions(_a) {
    var _b = _a === void 0 ? {} : _a, filter = _b.filter, options = _b.options;
    var _c = (0, react_1.useState)([]), previewTransactions = _c[0], setPreviewTransactions = _c[1];
    var _d = (0, useCachedSchedules_1.useCachedSchedules)(), isSchedulesLoading = _d.isLoading, scheduleQueryError = _d.error, schedules = _d.schedules, statuses = _d.statuses;
    var _e = (0, react_1.useState)(isSchedulesLoading), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(undefined), error = _f[0], setError = _f[1];
    var _g = (0, react_1.useState)(new Map()), runningBalances = _g[0], setRunningBalances = _g[1];
    var upcomingLength = (0, useSyncedPref_1.useSyncedPref)('upcomingScheduledTransactionLength')[0];
    // We don't want to re-render if options changes.
    // Putting options in a ref will prevent that and
    // allow us to use the latest options on next render.
    var optionsRef = (0, react_1.useRef)(options);
    optionsRef.current = options;
    var scheduleTransactions = (0, react_1.useMemo)(function () {
        if (isSchedulesLoading) {
            return [];
        }
        var schedulesForPreview = schedules
            .filter(function (s) { return isForPreview(s, statuses); })
            .filter(filter ? filter : function () { return true; });
        var today = d.startOfDay((0, months_1.parseDate)((0, months_1.currentDay)()));
        var upcomingPeriodEnd = d.startOfDay((0, months_1.parseDate)((0, months_1.addDays)(today, (0, schedules_1.getUpcomingDays)(upcomingLength))));
        return schedulesForPreview
            .map(function (schedule) {
            var dateConditions = (0, schedules_1.extractScheduleConds)(schedule._conditions).date;
            var status = statuses.get(schedule.id);
            var isRecurring = (0, schedules_1.scheduleIsRecurring)(dateConditions);
            var dates = [schedule.next_date];
            var day = d.startOfDay((0, months_1.parseDate)(schedule.next_date));
            if (isRecurring) {
                while (day <= upcomingPeriodEnd) {
                    var nextDate = (0, schedules_1.getNextDate)(dateConditions, day);
                    if (d.startOfDay((0, months_1.parseDate)(nextDate)) > upcomingPeriodEnd)
                        break;
                    if (dates.includes(nextDate)) {
                        day = d.startOfDay((0, months_1.parseDate)((0, months_1.addDays)(day, 1)));
                        continue;
                    }
                    dates.push(nextDate);
                    day = d.startOfDay((0, months_1.parseDate)((0, months_1.addDays)(nextDate, 1)));
                }
            }
            if (status === 'paid') {
                dates.shift();
            }
            var schedules = [];
            dates.forEach(function (date) {
                schedules.push({
                    id: 'preview/' + schedule.id + "/".concat(date),
                    payee: schedule._payee,
                    account: schedule._account,
                    amount: (0, schedules_1.getScheduledAmount)(schedule._amount),
                    date: date,
                    schedule: schedule.id,
                    forceUpcoming: date !== schedule.next_date || status === 'paid',
                });
            });
            return schedules;
        })
            .flat()
            .sort(function (a, b) {
            return (0, months_1.parseDate)(b.date).getTime() - (0, months_1.parseDate)(a.date).getTime() ||
                a.amount - b.amount;
        });
    }, [filter, isSchedulesLoading, schedules, statuses, upcomingLength]);
    (0, react_1.useEffect)(function () {
        var isUnmounted = false;
        setError(undefined);
        if (scheduleTransactions.length === 0) {
            setIsLoading(false);
            setPreviewTransactions([]);
            return;
        }
        setIsLoading(true);
        Promise.all(scheduleTransactions.map(function (transaction) {
            // Kick off an async rules application
            return (0, fetch_1.send)('rules-run', { transaction: transaction });
        }))
            .then(function (newTrans) {
            var _a, _b;
            if (!isUnmounted) {
                var withDefaults = newTrans.map(function (t) {
                    var _a;
                    return (__assign(__assign({}, t), { category: t.schedule != null ? statuses.get(t.schedule) : undefined, schedule: t.schedule, subtransactions: (_a = t.subtransactions) === null || _a === void 0 ? void 0 : _a.map(function (st) { return (__assign(__assign({}, st), { id: 'preview/' + st.id, schedule: t.schedule })); }) }));
                });
                var ungroupedTransactions = (0, transactions_1.ungroupTransactions)(withDefaults);
                setPreviewTransactions(ungroupedTransactions);
                if ((_a = optionsRef.current) === null || _a === void 0 ? void 0 : _a.calculateRunningBalances) {
                    setRunningBalances(
                    // We always use the bottom up calculation for preview transactions
                    // because the hook controls the order of the transactions. We don't
                    // need to provide a custom way for consumers to calculate the running
                    // balances, at least as of writing.
                    (0, useTransactions_1.calculateRunningBalancesBottomUp)(ungroupedTransactions, 
                    // Preview transactions are behaves like 'all' splits
                    'all', (_b = optionsRef.current) === null || _b === void 0 ? void 0 : _b.startingBalance));
                }
                setIsLoading(false);
            }
        })
            .catch(function (error) {
            if (!isUnmounted) {
                setError(error);
                setIsLoading(false);
            }
        });
        return function () {
            isUnmounted = true;
        };
    }, [scheduleTransactions, schedules, statuses, upcomingLength]);
    var returnError = error || scheduleQueryError;
    return __assign({ previewTransactions: previewTransactions, runningBalances: runningBalances, isLoading: isLoading || isSchedulesLoading }, (returnError && { error: returnError }));
}
function isForPreview(schedule, statuses) {
    var status = statuses.get(schedule.id);
    return (!schedule.completed &&
        ['due', 'upcoming', 'missed', 'paid'].includes(status));
}
