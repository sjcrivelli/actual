import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgCheveronLeft, SvgCheveronRight, } from '@actual-app/components/icons/v1';
import { SvgCalendar } from '@actual-app/components/icons/v2';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { Link } from '@desktop-client/components/common/Link';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useResizeObserver } from '@desktop-client/hooks/useResizeObserver';
export const MonthPicker = ({ startMonth, numDisplayed, monthBounds, style, onSelect, }) => {
    const locale = useLocale();
    const { t } = useTranslation();
    const [hoverId, setHoverId] = useState(null);
    const [targetMonthCount, setTargetMonthCount] = useState(12);
    const currentMonth = monthUtils.currentMonth();
    const firstSelectedMonth = startMonth;
    const lastSelectedMonth = monthUtils.addMonths(firstSelectedMonth, numDisplayed - 1);
    const range = monthUtils.rangeInclusive(monthUtils.subMonths(firstSelectedMonth, Math.floor(targetMonthCount / 2 - numDisplayed / 2)), monthUtils.addMonths(lastSelectedMonth, Math.floor(targetMonthCount / 2 - numDisplayed / 2)));
    const firstSelectedIndex = Math.floor(range.length / 2) - Math.floor(numDisplayed / 2);
    const lastSelectedIndex = firstSelectedIndex + numDisplayed - 1;
    const [size, setSize] = useState('small');
    const containerRef = useResizeObserver(rect => {
        setSize(rect.width <= 400 ? 'small' : 'big');
        setTargetMonthCount(Math.min(Math.max(Math.floor(rect.width / 50), 12), 24));
    });
    const yearHeadersShown = [];
    return (_jsx(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...style,
        }, children: _jsxs(View, { innerRef: containerRef, style: {
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }, children: [_jsx(Link, { variant: "button", buttonVariant: "bare", onPress: () => onSelect(currentMonth), style: {
                        padding: '3px 3px',
                        marginRight: '12px',
                    }, children: _jsx(View, { title: t('Today'), children: _jsx(SvgCalendar, { style: {
                                width: 16,
                                height: 16,
                            } }) }) }), _jsx(Link, { variant: "button", buttonVariant: "bare", onPress: () => onSelect(monthUtils.prevMonth(startMonth)), style: {
                        padding: '3px 3px',
                        marginRight: '12px',
                    }, children: _jsx(View, { title: t('Previous month'), children: _jsx(SvgCheveronLeft, { style: {
                                width: 16,
                                height: 16,
                            } }) }) }), range.map((month, idx) => {
                    const monthName = monthUtils.format(month, 'MMM', locale);
                    const selected = idx >= firstSelectedIndex && idx <= lastSelectedIndex;
                    const lastHoverId = hoverId + numDisplayed - 1;
                    const hovered = hoverId === null ? false : idx >= hoverId && idx <= lastHoverId;
                    const current = currentMonth === month;
                    const year = monthUtils.getYear(month);
                    let showYearHeader = false;
                    if (!yearHeadersShown.includes(year)) {
                        yearHeadersShown.push(year);
                        showYearHeader = true;
                    }
                    const isMonthBudgeted = month >= monthBounds.start && month <= monthBounds.end;
                    return (_jsx(View, { style: {
                            alignItems: 'center',
                            padding: '3px 3px',
                            width: size === 'big' ? '35px' : '20px',
                            textAlign: 'center',
                            userSelect: 'none',
                            cursor: 'default',
                            borderRadius: 2,
                            border: 'none',
                            ...(!isMonthBudgeted && {
                                textDecoration: 'line-through',
                                color: theme.pageTextSubdued,
                            }),
                            ...styles.smallText,
                            ...(selected && {
                                backgroundColor: theme.tableBorderHover,
                                color: theme.buttonPrimaryText,
                            }),
                            ...((hovered || selected) && {
                                borderRadius: 0,
                                cursor: 'pointer',
                            }),
                            ...(hoverId !== null &&
                                !hovered &&
                                selected && {
                                filter: 'brightness(65%)',
                            }),
                            ...(hovered &&
                                !selected && {
                                backgroundColor: theme.buttonBareBackgroundHover,
                            }),
                            ...(!hovered &&
                                !selected &&
                                current && {
                                backgroundColor: theme.buttonBareBackgroundHover,
                                filter: 'brightness(120%)',
                            }),
                            ...(hovered &&
                                selected &&
                                current && {
                                filter: 'brightness(120%)',
                            }),
                            ...(hovered &&
                                selected && {
                                backgroundColor: theme.tableBorderHover,
                            }),
                            ...((idx === firstSelectedIndex ||
                                (idx === hoverId && !selected)) && {
                                borderTopLeftRadius: 2,
                                borderBottomLeftRadius: 2,
                            }),
                            ...((idx === lastSelectedIndex ||
                                (idx === lastHoverId && !selected)) && {
                                borderTopRightRadius: 2,
                                borderBottomRightRadius: 2,
                            }),
                            ...(current && { fontWeight: 'bold' }),
                        }, onClick: () => onSelect(month), onMouseEnter: () => setHoverId(idx), onMouseLeave: () => setHoverId(null), children: _jsxs(View, { children: [size === 'small' ? monthName[0] : monthName, showYearHeader && (_jsx(View, { style: {
                                        position: 'absolute',
                                        top: -16,
                                        left: 0,
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                        color: isMonthBudgeted
                                            ? theme.pageText
                                            : theme.pageTextSubdued,
                                    }, children: year }))] }) }, month));
                }), _jsx(Link, { variant: "button", buttonVariant: "bare", onPress: () => onSelect(monthUtils.nextMonth(startMonth)), style: {
                        padding: '3px 3px',
                        marginLeft: '12px',
                    }, children: _jsx(View, { title: t('Next month'), children: _jsx(SvgCheveronRight, { style: {
                                width: 16,
                                height: 16,
                            } }) }) }), _jsx("span", { style: {
                        width: '22px',
                        marginLeft: '12px',
                    } })] }) }));
};
