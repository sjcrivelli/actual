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
exports.chartTheme = void 0;
exports.getColorScale = getColorScale;
var theme_1 = require("@actual-app/components/theme");
var colorFades = {
    blueFadeStart: 'rgba(229, 245, 255, 1)',
    blueFadeEnd: 'rgba(229, 245, 255, 0)',
    redFadeStart: 'rgba(255, 243, 242, 1)',
    redFadeEnd: 'rgba(255, 243, 242, 0)',
};
// Typography
var sansSerif = 'Inter var, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif';
var letterSpacing = 'normal';
var fontSize = 13;
// Labels
var baseLabelStyles = {
    fontFamily: sansSerif,
    fontSize: fontSize,
    letterSpacing: letterSpacing,
    fill: theme_1.theme.reportsLabel,
    stroke: 'transparent',
};
var axisBaseStyles = {
    axis: {
        fill: 'transparent',
        stroke: 'none',
    },
    grid: {
        fill: 'none',
        stroke: 'none',
        pointerEvents: 'none',
    },
    ticks: {
        fill: 'transparent',
        size: 1,
        stroke: 'none',
    },
    axisLabel: baseLabelStyles,
    tickLabels: baseLabelStyles,
};
exports.chartTheme = {
    colors: __assign(__assign({}, colorFades), { red: theme_1.theme.reportsRed, blue: theme_1.theme.reportsBlue }),
    area: {
        style: {
            labels: baseLabelStyles,
            data: {
                stroke: theme_1.theme.reportsBlue,
                strokeWidth: 2,
                strokeLinejoin: 'round',
                strokeLinecap: 'round',
            },
        },
    },
    axis: {
        style: axisBaseStyles,
    },
    dependentAxis: {
        style: __assign(__assign({}, axisBaseStyles), { grid: __assign(__assign({}, axisBaseStyles.grid), { stroke: theme_1.theme.pageTextSubdued, strokeDasharray: '1,1' }), tickLabels: __assign(__assign({}, baseLabelStyles), { padding: 5 }) }),
    },
    independentAxis: {
        style: __assign(__assign({}, axisBaseStyles), { axis: __assign(__assign({}, axisBaseStyles.axis), { stroke: theme_1.theme.pageTextSubdued }), tickLabels: __assign(__assign({}, baseLabelStyles), { padding: 10 }) }),
    },
    bar: {
        style: {
            labels: baseLabelStyles,
            data: { fill: theme_1.theme.reportsBlue, stroke: 'none' },
        },
    },
    line: {
        style: {
            labels: baseLabelStyles,
            data: {
                fill: 'none',
                stroke: theme_1.theme.reportsBlue,
                strokeWidth: 2,
                strokeLinejoin: 'round',
                strokeLinecap: 'round',
            },
        },
    },
    voronoi: {
        style: {
            labels: baseLabelStyles,
        },
    },
    chart: {
        padding: {
            top: 20,
            left: 65,
            right: 20,
            bottom: 50,
        },
    },
};
function getColorScale(name) {
    var scales = {
        grayscale: ['#cccccc', '#969696', '#636363', '#252525'],
        qualitative: [
            '#45B29D', //Dark Teal
            '#EFC94C', //Yellow
            '#E27A3F', //Orange
            '#DF5A49', //Light Red
            '#5F91B8', //Blue
            '#E2A37F', //Peach
            '#55DBC1', //Light Teal
            '#EFDA97', //Light Yellow
            '#DF948A', //Light Red
        ],
        heatmap: ['#428517', '#77D200', '#D6D305', '#EC8E19', '#C92B05'],
        warm: ['#940031', '#C43343', '#DC5429', '#FF821D', '#FFAF55'],
        cool: ['#2746B9', '#0B69D4', '#2794DB', '#31BB76', '#60E83B'],
        red: ['#FCAE91', '#FB6A4A', '#DE2D26', '#A50F15', '#750B0E'],
        blue: ['#002C61', '#004B8F', '#006BC9', '#3795E5', '#65B4F4'],
        green: ['#354722', '#466631', '#649146', '#8AB25C', '#A9C97E'],
    };
    return name ? scales[name] : scales.grayscale;
}
