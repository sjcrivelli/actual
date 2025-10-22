"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineIntervalRange = determineIntervalRange;
exports.trimIntervalDataToRange = trimIntervalDataToRange;
exports.trimIntervalsToRange = trimIntervalsToRange;
exports.trimGroupedDataIntervals = trimGroupedDataIntervals;
function isEmptyForMetric(interval, metric) {
    switch (metric) {
        case 'totalAssets':
            return interval.totalAssets === 0;
        case 'totalDebts':
            return interval.totalDebts === 0;
        case 'netAssets':
            return interval.netAssets === 0;
        case 'netDebts':
            return interval.netDebts === 0;
        case 'totalTotals':
        default:
            return interval.totalTotals === 0;
    }
}
function determineIntervalRange(data, intervalData, trimIntervals, balanceTypeOp) {
    if (balanceTypeOp === void 0) { balanceTypeOp = 'totalTotals'; }
    if (!trimIntervals || intervalData.length === 0) {
        return { startIndex: 0, endIndex: intervalData.length - 1 };
    }
    var globalStartIndex = intervalData.length;
    var globalEndIndex = -1;
    // Check each group to find the earliest start and latest end of non-empty data
    data.forEach(function (item) {
        var startIndex = item.intervalData.findIndex(function (interval) { return !isEmptyForMetric(interval, balanceTypeOp); });
        if (startIndex !== -1) {
            globalStartIndex = Math.min(globalStartIndex, startIndex);
            // Find last non-empty interval for this group
            var endIndex = item.intervalData.length - 1;
            while (endIndex >= 0 &&
                isEmptyForMetric(item.intervalData[endIndex], balanceTypeOp)) {
                endIndex--;
            }
            globalEndIndex = Math.max(globalEndIndex, endIndex);
        }
    });
    // Also check the main intervalData for any activity
    var mainStartIndex = intervalData.findIndex(function (interval) { return !isEmptyForMetric(interval, balanceTypeOp); });
    if (mainStartIndex !== -1) {
        globalStartIndex = Math.min(globalStartIndex, mainStartIndex);
        var mainEndIndex = intervalData.length - 1;
        while (mainEndIndex >= 0 &&
            isEmptyForMetric(intervalData[mainEndIndex], balanceTypeOp)) {
            mainEndIndex--;
        }
        globalEndIndex = Math.max(globalEndIndex, mainEndIndex);
    }
    // If no non-empty intervals found anywhere, return empty range
    if (globalStartIndex === intervalData.length || globalEndIndex === -1) {
        return { startIndex: 0, endIndex: -1 };
    }
    return { startIndex: globalStartIndex, endIndex: globalEndIndex };
}
function trimIntervalDataToRange(data, startIndex, endIndex) {
    // Trim empty interval data from the start and end based on the range
    if (startIndex > endIndex || startIndex < 0 || endIndex >= data.length) {
        return [];
    }
    return data.slice(startIndex, endIndex + 1);
}
function trimIntervalsToRange(data, startIndex, endIndex) {
    // Trims intervalData for each GroupedEntity based on range
    data.forEach(function (item) {
        if (startIndex > endIndex ||
            startIndex < 0 ||
            endIndex >= item.intervalData.length) {
            item.intervalData = [];
        }
        else {
            item.intervalData = item.intervalData.slice(startIndex, endIndex + 1);
        }
    });
}
// Trim nested category intervalData within each group
function trimGroupedDataIntervals(groupedData, startIndex, endIndex) {
    groupedData.forEach(function (group) {
        // Trim the group's own intervalData
        if (startIndex > endIndex ||
            startIndex < 0 ||
            endIndex >= group.intervalData.length) {
            group.intervalData = [];
        }
        else {
            group.intervalData = group.intervalData.slice(startIndex, endIndex + 1);
        }
        // Trim the nested categories' intervalData
        if (group.categories) {
            group.categories.forEach(function (category) {
                if (startIndex > endIndex ||
                    startIndex < 0 ||
                    endIndex >= category.intervalData.length) {
                    category.intervalData = [];
                }
                else {
                    category.intervalData = category.intervalData.slice(startIndex, endIndex + 1);
                }
            });
        }
    });
}
