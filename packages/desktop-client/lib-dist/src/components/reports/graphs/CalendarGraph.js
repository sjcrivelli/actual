import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { addDays, format as formatDate, getDate, isSameMonth, startOfMonth, startOfWeek, } from 'date-fns';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { chartTheme } from '@desktop-client/components/reports/chart-theme';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useResizeObserver } from '@desktop-client/hooks/useResizeObserver';
export function CalendarGraph({ data, start, firstDayOfWeekIdx, isEditing, onDayClick, }) {
    const format = useFormat();
    const startingDate = startOfWeek(new Date(), {
        weekStartsOn: firstDayOfWeekIdx !== undefined &&
            !Number.isNaN(parseInt(firstDayOfWeekIdx)) &&
            parseInt(firstDayOfWeekIdx) >= 0 &&
            parseInt(firstDayOfWeekIdx) <= 6
            ? parseInt(firstDayOfWeekIdx)
            : 0,
    });
    const [fontSize, setFontSize] = useState(14);
    const buttonRef = useResizeObserver(rect => {
        const newValue = Math.floor(rect.height / 2);
        if (newValue > 14) {
            setFontSize(14);
        }
        else {
            setFontSize(newValue);
        }
    });
    return (_jsxs(_Fragment, { children: [_jsx(View, { style: {
                    color: theme.pageTextSubdued,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gridAutoRows: '1fr',
                    gap: 2,
                }, onClick: () => onDayClick(null), children: Array.from({ length: 7 }, (_, index) => (_jsx(View, { style: {
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: 500,
                        padding: '3px 0',
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                        marginBottom: 4,
                    }, children: formatDate(addDays(startingDate, index), 'EEEEE') }, index))) }), _jsx(View, { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gridAutoRows: '1fr',
                    gap: 2,
                    width: '100%',
                    height: '100%',
                    zIndex: isEditing ? -1 : 'auto', // Prevents interaction with calendar buttons when editing dashboard.
                }, children: data.map((day, index) => !isSameMonth(day.date, startOfMonth(start)) ? (_jsx(View, { onClick: () => onDayClick(null) }, `empty-${day.date.getTime()}`)) : day.incomeValue !== 0 || day.expenseValue !== 0 ? (_jsx(Tooltip, { content: _jsxs(View, { children: [_jsx(View, { style: { marginBottom: 10 }, children: _jsx("strong", { children: formatDate(day.date, 'MMM dd') }) }), _jsx(View, { style: { lineHeight: 1.5 }, children: _jsxs(View, { style: {
                                        display: 'grid',
                                        gridTemplateColumns: '70px 1fr 60px',
                                        gridAutoRows: '1fr',
                                    }, children: [_jsx(View, { style: {
                                                textAlign: 'right',
                                                marginRight: 4,
                                            }, children: _jsx(Trans, { children: "Income:" }) }), _jsx(View, { style: {
                                                color: chartTheme.colors.blue,
                                                flexDirection: 'row',
                                            }, children: day.incomeValue !== 0 ? (_jsx(PrivacyFilter, { children: format(day.incomeValue, 'financial') })) : ('') }), _jsxs(View, { style: { marginLeft: 4, flexDirection: 'row' }, children: ["(", _jsx(PrivacyFilter, { children: Math.round(day.incomeSize * 100) / 100 + '%' }), ")"] }), _jsx(View, { style: {
                                                textAlign: 'right',
                                                marginRight: 4,
                                            }, children: _jsx(Trans, { children: "Expenses:" }) }), _jsx(View, { style: {
                                                color: chartTheme.colors.red,
                                                flexDirection: 'row',
                                            }, children: day.expenseValue !== 0 ? (_jsx(PrivacyFilter, { children: format(day.expenseValue, 'financial') })) : ('') }), _jsxs(View, { style: { marginLeft: 4, flexDirection: 'row' }, children: ["(", _jsx(PrivacyFilter, { children: Math.round(day.expenseSize * 100) / 100 + '%' }), ")"] })] }) })] }), placement: "bottom end", style: {
                        ...styles.tooltip,
                        lineHeight: 1.5,
                        padding: '6px 10px',
                    }, children: _jsx(DayButton, { resizeRef: el => {
                            if (index === 15 && el) {
                                buttonRef(el);
                            }
                        }, fontSize: fontSize, day: day, onPress: () => onDayClick(day.date) }, day.date.getTime()) }, day.date.getTime())) : (_jsx(DayButton, { resizeRef: el => {
                        if (index === 15 && el) {
                            buttonRef(el);
                        }
                    }, fontSize: fontSize, day: day, onPress: () => onDayClick(day.date) }, day.date.getTime()))) })] }));
}
function DayButton({ day, onPress, fontSize, resizeRef }) {
    const [currentFontSize, setCurrentFontSize] = useState(fontSize);
    useEffect(() => {
        setCurrentFontSize(fontSize);
    }, [fontSize]);
    return (_jsxs(Button, { ref: resizeRef, "aria-label": formatDate(day.date, 'MMMM d, yyyy'), style: {
            borderColor: 'transparent',
            backgroundColor: theme.calendarCellBackground,
            position: 'relative',
            padding: 'unset',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
            margin: 0,
        }, onPress: () => onPress(), children: [day.expenseSize !== 0 && (_jsx(View, { style: {
                    position: 'absolute',
                    width: '50%',
                    height: '100%',
                    background: chartTheme.colors.red,
                    opacity: 0.2,
                    right: 0,
                } })), day.incomeSize !== 0 && (_jsx(View, { style: {
                    position: 'absolute',
                    width: '50%',
                    height: '100%',
                    background: chartTheme.colors.blue,
                    opacity: 0.2,
                    left: 0,
                } })), _jsx(View, { style: {
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    opacity: 0.9,
                    height: `${Math.ceil(day.incomeSize)}%`,
                    backgroundColor: chartTheme.colors.blue,
                    width: '50%',
                    transition: 'height 0.5s ease-out',
                } }), _jsx(View, { style: {
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    opacity: 0.9,
                    height: `${Math.ceil(day.expenseSize)}%`,
                    backgroundColor: chartTheme.colors.red,
                    width: '50%',
                    transition: 'height 0.5s ease-out',
                } }), _jsx("span", { style: {
                    fontSize: `${currentFontSize}px`,
                    fontWeight: 500,
                    position: 'relative',
                }, children: getDate(day.date) })] }));
}
