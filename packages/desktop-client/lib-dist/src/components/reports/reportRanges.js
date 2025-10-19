import * as monthUtils from 'loot-core/shared/months';
export function validateStart(earliest, latest, start, end, interval, firstDayOfWeekIdx) {
    let addDays;
    let dateStart;
    switch (interval) {
        case 'Monthly':
            dateStart = start + '-01';
            addDays = 180;
            break;
        case 'Yearly':
            dateStart = start + '-01-01';
            addDays = 1095;
            break;
        case 'Daily':
            dateStart = start;
            addDays = 6;
            break;
        default:
            dateStart = start;
            addDays = 180;
            break;
    }
    if (end < start) {
        end = monthUtils.addDays(dateStart, addDays);
    }
    return boundedRange(earliest, latest, dateStart, interval ? end : monthUtils.monthFromDate(end), interval, firstDayOfWeekIdx);
}
export function validateEnd(earliest, latest, start, end, interval, firstDayOfWeekIdx) {
    let subDays;
    let dateEnd;
    switch (interval) {
        case 'Monthly':
            dateEnd = monthUtils.getMonthEnd(end + '-01');
            subDays = 180;
            break;
        case 'Yearly':
            dateEnd = end + '-12-31';
            subDays = 1095;
            break;
        case 'Daily':
            dateEnd = end;
            subDays = 6;
            break;
        default:
            dateEnd = end;
            subDays = 180;
            break;
    }
    if (start > end) {
        start = monthUtils.subDays(dateEnd, subDays);
    }
    return boundedRange(earliest, latest, interval ? start : monthUtils.monthFromDate(start), dateEnd, interval, firstDayOfWeekIdx);
}
export function validateRange(earliest, latest, start, end) {
    if (end > latest) {
        end = latest;
    }
    if (start < earliest) {
        start = earliest;
    }
    return [start, end];
}
function boundedRange(earliest, latest, start, end, interval, firstDayOfWeekIdx) {
    switch (interval) {
        case 'Daily':
            latest = monthUtils.currentDay();
            break;
        case 'Weekly':
            latest = monthUtils.currentWeek(firstDayOfWeekIdx);
            break;
        case 'Monthly':
            latest = monthUtils.getMonthEnd(monthUtils.currentDay());
            break;
        case 'Yearly':
            latest = monthUtils.currentDay();
            break;
        default:
            break;
    }
    if (end > latest) {
        end = latest;
    }
    if (start < earliest) {
        start = earliest;
    }
    return [start, end, 'static'];
}
export function getSpecificRange(offset, addNumber, type, firstDayOfWeekIdx) {
    const currentDay = monthUtils.currentDay();
    const currentWeek = monthUtils.currentWeek(firstDayOfWeekIdx);
    let dateStart = monthUtils.subMonths(currentDay, offset) + '-01';
    let dateEnd = monthUtils.getMonthEnd(monthUtils.addMonths(dateStart, addNumber === null ? offset : addNumber) +
        '-01');
    if (type === 'Week') {
        dateStart = monthUtils.subWeeks(currentWeek, offset);
        dateEnd = monthUtils.getWeekEnd(monthUtils.addWeeks(dateStart, addNumber === null ? offset : addNumber), firstDayOfWeekIdx);
    }
    return [dateStart, dateEnd, 'static'];
}
export function getFullRange(start, end) {
    return [start, end, 'full'];
}
export function getLatestRange(offset) {
    const end = monthUtils.currentMonth();
    const start = monthUtils.subMonths(end, offset);
    return [start, end, 'sliding-window'];
}
export function calculateTimeRange(timeFrame, defaultTimeFrame, latestTransaction) {
    const start = timeFrame?.start ??
        defaultTimeFrame?.start ??
        monthUtils.subMonths(monthUtils.currentMonth(), 5);
    const end = timeFrame?.end ?? defaultTimeFrame?.end ?? monthUtils.currentMonth();
    const mode = timeFrame?.mode ?? defaultTimeFrame?.mode ?? 'sliding-window';
    if (mode === 'full') {
        const latestTransactionMonth = latestTransaction
            ? monthUtils.monthFromDate(latestTransaction)
            : null;
        const currentMonth = monthUtils.currentMonth();
        const fullEnd = latestTransactionMonth &&
            monthUtils.isAfter(latestTransactionMonth, currentMonth)
            ? latestTransactionMonth
            : currentMonth;
        return getFullRange(start, fullEnd);
    }
    if (mode === 'sliding-window') {
        const offset = monthUtils.differenceInCalendarMonths(end, start);
        if (start > end) {
            return [
                monthUtils.currentMonth(),
                monthUtils.subMonths(monthUtils.currentMonth(), -offset),
                'sliding-window',
            ];
        }
        return getLatestRange(offset);
    }
    if (mode === 'lastYear') {
        return [
            monthUtils.getYearStart(monthUtils.prevYear(monthUtils.currentMonth())),
            monthUtils.getYearEnd(monthUtils.prevYear(monthUtils.currentDate())),
            'lastYear',
        ];
    }
    if (mode === 'yearToDate') {
        return [
            monthUtils.currentYear() + '-01',
            monthUtils.currentMonth(),
            'yearToDate',
        ];
    }
    if (mode === 'priorYearToDate') {
        return [
            monthUtils.getYearStart(monthUtils.prevYear(monthUtils.currentMonth())),
            monthUtils.prevYear(monthUtils.currentDate(), 'yyyy-MM-dd'),
            'priorYearToDate',
        ];
    }
    return [start, end, 'static'];
}
export function calculateSpendingReportTimeRange({ compare, compareTo, isLive = true, mode = 'single-month', }) {
    if (['budget', 'average'].includes(mode) && isLive) {
        return [monthUtils.currentMonth(), monthUtils.currentMonth()];
    }
    const [start, end] = calculateTimeRange({
        start: compare,
        end: compareTo,
        mode: (isLive ?? true) ? 'sliding-window' : 'static',
    }, {
        start: monthUtils.currentMonth(),
        end: monthUtils.subMonths(monthUtils.currentMonth(), 1),
        mode: 'sliding-window',
    });
    return [start, end];
}
