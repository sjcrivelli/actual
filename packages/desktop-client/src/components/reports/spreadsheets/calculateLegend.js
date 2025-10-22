"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLegend = calculateLegend;
var theme_1 = require("@actual-app/components/theme");
var chart_theme_1 = require("@desktop-client/components/reports/chart-theme");
function calculateLegend(intervalData, calcDataFiltered, groupBy, graphType, balanceTypeOp) {
    var colorScale = (0, chart_theme_1.getColorScale)('qualitative');
    var chooseData = groupBy === 'Interval'
        ? intervalData.map(function (c) {
            return { name: c.date, id: null, data: c };
        })
        : calcDataFiltered.map(function (c) {
            return { name: c.name, id: c.id, data: c };
        });
    function getColor(data, index) {
        if (graphType === 'DonutGraph') {
            return colorScale[index % colorScale.length];
        }
        if (groupBy === 'Interval') {
            if (balanceTypeOp === 'totalDebts') {
                return theme_1.theme.reportsRed;
            }
            if (balanceTypeOp === 'totalTotals') {
                if (data.totalTotals < 0) {
                    return theme_1.theme.reportsRed;
                }
                return theme_1.theme.reportsBlue;
            }
            return theme_1.theme.reportsBlue;
        }
        return colorScale[index % colorScale.length];
    }
    var legend = chooseData.map(function (item, index) {
        return {
            id: item.id || '',
            name: item.name || '',
            color: getColor(item.data, index),
        };
    });
    return legend;
}
