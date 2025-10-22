"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultStatusProps = void 0;
exports.getStatusProps = getStatusProps;
exports.StatusBadge = StatusBadge;
var react_1 = require("react");
var v2_1 = require("@actual-app/components/icons/v2");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var schedules_1 = require("loot-core/shared/schedules");
var util_1 = require("loot-core/shared/util");
exports.defaultStatusProps = {
    color: theme_1.theme.buttonNormalDisabledText,
    backgroundColor: theme_1.theme.tableRowHeaderBackground,
    Icon: v2_1.SvgCheckCircleHollow,
};
function getStatusProps(status) {
    switch (status) {
        case 'missed':
            return {
                color: theme_1.theme.errorTextDarker,
                backgroundColor: theme_1.theme.errorBackground,
                Icon: v2_1.SvgEditSkull1,
            };
        case 'due':
            return {
                color: theme_1.theme.warningTextDark,
                backgroundColor: theme_1.theme.warningBackground,
                Icon: v2_1.SvgAlertTriangle,
            };
        case 'upcoming':
            return {
                color: theme_1.theme.upcomingText,
                backgroundColor: theme_1.theme.upcomingBackground,
                Icon: v2_1.SvgCalendar3,
            };
        case 'paid':
            return {
                color: theme_1.theme.noticeText,
                backgroundColor: theme_1.theme.noticeBackgroundLight,
                Icon: v2_1.SvgValidationCheck,
            };
        case 'completed':
            return {
                color: theme_1.theme.tableHeaderText,
                backgroundColor: theme_1.theme.tableRowHeaderBackground,
                Icon: v2_1.SvgFavoriteStar,
            };
        case 'pending':
            return {
                color: theme_1.theme.noticeTextLight,
                backgroundColor: theme_1.theme.noticeBackgroundLight,
                Icon: v2_1.SvgCalendar3,
            };
        case 'scheduled':
            return {
                color: theme_1.theme.tableRowHeaderText,
                backgroundColor: theme_1.theme.tableRowHeaderBackground,
                Icon: v2_1.SvgCalendar3,
            };
        case 'cleared':
            return {
                color: theme_1.theme.noticeTextLight,
                backgroundColor: theme_1.theme.tableRowHeaderBackground,
                Icon: v2_1.SvgCheckCircle1,
            };
        case 'reconciled':
            return {
                color: theme_1.theme.noticeTextLight,
                backgroundColor: theme_1.theme.tableRowHeaderBackground,
                Icon: v2_1.SvgLockClosed,
            };
        default:
            return exports.defaultStatusProps;
    }
}
function StatusBadge(_a) {
    var status = _a.status;
    var _b = getStatusProps(status), color = _b.color, backgroundColor = _b.backgroundColor, Icon = _b.Icon;
    return (<view_1.View style={{
            color: color,
            backgroundColor: backgroundColor,
            padding: '6px 8px',
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 0,
        }}>
      <Icon style={{
            width: 13,
            height: 13,
            marginRight: 7,
        }}/>
      <text_1.Text style={{ lineHeight: '1em' }}>
        {(0, util_1.titleFirst)((0, schedules_1.getStatusLabel)(status))}
      </text_1.Text>
    </view_1.View>);
}
