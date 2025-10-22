"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveRange = getLiveRange;
var monthUtils = require("loot-core/shared/months");
var ReportOptions_1 = require("./ReportOptions");
var reportRanges_1 = require("./reportRanges");
function getLiveRange(cond, earliestTransaction, latestTransaction, includeCurrentInterval, firstDayOfWeekIdx) {
    var _a, _b, _c, _d;
    var dateStart = earliestTransaction;
    var dateEnd = latestTransaction;
    var rangeName = ReportOptions_1.ReportOptions.dateRangeMap.get(cond);
    switch (rangeName) {
        case 'yearToDate':
            _a = (0, reportRanges_1.validateRange)(earliestTransaction, latestTransaction, monthUtils.getYearStart(monthUtils.currentMonth()) + '-01', monthUtils.currentDay()), dateStart = _a[0], dateEnd = _a[1];
            break;
        case 'lastYear':
            _b = (0, reportRanges_1.validateRange)(earliestTransaction, latestTransaction, monthUtils.getYearStart(monthUtils.prevYear(monthUtils.currentMonth())) + '-01', monthUtils.getYearEnd(monthUtils.prevYear(monthUtils.currentDate())) +
                '-31'), dateStart = _b[0], dateEnd = _b[1];
            break;
        case 'priorYearToDate':
            _c = (0, reportRanges_1.validateRange)(earliestTransaction, latestTransaction, monthUtils.getYearStart(monthUtils.prevYear(monthUtils.currentMonth())) + '-01', monthUtils.prevYear(monthUtils.currentDate(), 'yyyy-MM-dd')), dateStart = _c[0], dateEnd = _c[1];
            break;
        case 'allTime':
            dateStart = earliestTransaction;
            dateEnd = latestTransaction;
            break;
        default:
            if (typeof rangeName === 'number') {
                _d = (0, reportRanges_1.getSpecificRange)(rangeName, ['This month', 'This week'].includes(cond)
                    ? null
                    : rangeName - (includeCurrentInterval ? 0 : 1), ReportOptions_1.ReportOptions.dateRangeType.get(cond), firstDayOfWeekIdx), dateStart = _d[0], dateEnd = _d[1];
            }
            else {
                break;
            }
    }
    return [dateStart, dateEnd, 'sliding-window'];
}
