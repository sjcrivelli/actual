import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SvgAlertTriangle, SvgCalendar3, SvgCheckCircle1, SvgCheckCircleHollow, SvgEditSkull1, SvgFavoriteStar, SvgLockClosed, SvgValidationCheck, } from '@actual-app/components/icons/v2';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { getStatusLabel } from 'loot-core/shared/schedules';
import { titleFirst } from 'loot-core/shared/util';
export const defaultStatusProps = {
    color: theme.buttonNormalDisabledText,
    backgroundColor: theme.tableRowHeaderBackground,
    Icon: SvgCheckCircleHollow,
};
export function getStatusProps(status) {
    switch (status) {
        case 'missed':
            return {
                color: theme.errorTextDarker,
                backgroundColor: theme.errorBackground,
                Icon: SvgEditSkull1,
            };
        case 'due':
            return {
                color: theme.warningTextDark,
                backgroundColor: theme.warningBackground,
                Icon: SvgAlertTriangle,
            };
        case 'upcoming':
            return {
                color: theme.upcomingText,
                backgroundColor: theme.upcomingBackground,
                Icon: SvgCalendar3,
            };
        case 'paid':
            return {
                color: theme.noticeText,
                backgroundColor: theme.noticeBackgroundLight,
                Icon: SvgValidationCheck,
            };
        case 'completed':
            return {
                color: theme.tableHeaderText,
                backgroundColor: theme.tableRowHeaderBackground,
                Icon: SvgFavoriteStar,
            };
        case 'pending':
            return {
                color: theme.noticeTextLight,
                backgroundColor: theme.noticeBackgroundLight,
                Icon: SvgCalendar3,
            };
        case 'scheduled':
            return {
                color: theme.tableRowHeaderText,
                backgroundColor: theme.tableRowHeaderBackground,
                Icon: SvgCalendar3,
            };
        case 'cleared':
            return {
                color: theme.noticeTextLight,
                backgroundColor: theme.tableRowHeaderBackground,
                Icon: SvgCheckCircle1,
            };
        case 'reconciled':
            return {
                color: theme.noticeTextLight,
                backgroundColor: theme.tableRowHeaderBackground,
                Icon: SvgLockClosed,
            };
        default:
            return defaultStatusProps;
    }
}
export function StatusBadge({ status }) {
    const { color, backgroundColor, Icon } = getStatusProps(status);
    return (_jsxs(View, { style: {
            color,
            backgroundColor,
            padding: '6px 8px',
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 0,
        }, children: [_jsx(Icon, { style: {
                    width: 13,
                    height: 13,
                    marginRight: 7,
                } }), _jsx(Text, { style: { lineHeight: '1em' }, children: titleFirst(getStatusLabel(status)) })] }));
}
