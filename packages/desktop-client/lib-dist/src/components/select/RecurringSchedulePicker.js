import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useReducer, useRef, useState, } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgAdd, SvgSubtract } from '@actual-app/components/icons/v0';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { Select } from '@actual-app/components/select';
import { SpaceBetween } from '@actual-app/components/space-between';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { sendCatch } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { getRecurringDescription } from 'loot-core/shared/schedules';
import { DateSelect } from './DateSelect';
import { Modal } from '@desktop-client/components/common/Modal';
import { Checkbox } from '@desktop-client/components/forms';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
// ex: There is no 6th Friday of the Month
const MAX_DAY_OF_WEEK_INTERVAL = 5;
function useFrequencyOptions() {
    const { t } = useTranslation();
    const FREQUENCY_OPTIONS = [
        { id: 'daily', name: t('Days') },
        { id: 'weekly', name: t('Weeks') },
        { id: 'monthly', name: t('Months') },
        { id: 'yearly', name: t('Years') },
    ];
    return { FREQUENCY_OPTIONS };
}
const DAY_OF_MONTH_OPTIONS = [...Array(31).keys()].map(day => day + 1);
function useDayOfWeekOptions() {
    const { t } = useTranslation();
    const DAY_OF_WEEK_OPTIONS = [
        { id: 'SU', name: t('Sunday') },
        { id: 'MO', name: t('Monday') },
        { id: 'TU', name: t('Tuesday') },
        { id: 'WE', name: t('Wednesday') },
        { id: 'TH', name: t('Thursday') },
        { id: 'FR', name: t('Friday') },
        { id: 'SA', name: t('Saturday') },
    ];
    return { DAY_OF_WEEK_OPTIONS };
}
function parsePatternValue(value) {
    if (value === 'last') {
        return -1;
    }
    return Number(value);
}
function parseConfig(config) {
    return {
        start: monthUtils.currentDay(),
        interval: 1,
        frequency: 'monthly',
        patterns: [createMonthlyRecurrence(monthUtils.currentDay())],
        skipWeekend: false,
        weekendSolveMode: 'before',
        endMode: 'never',
        endOccurrences: 1,
        endDate: monthUtils.currentDay(),
        ...config,
    };
}
function unparseConfig(parsed) {
    return {
        ...parsed,
        interval: validInterval(parsed.interval),
        endOccurrences: validInterval(parsed.endOccurrences),
    };
}
function createMonthlyRecurrence(startDate) {
    return {
        value: parseInt(monthUtils.format(startDate, 'd')),
        type: 'day',
    };
}
function boundedRecurrence({ field, value, recurrence, }) {
    if ((field === 'value' &&
        recurrence.type !== 'day' &&
        value > MAX_DAY_OF_WEEK_INTERVAL) ||
        (field === 'type' &&
            value !== 'day' &&
            recurrence.value > MAX_DAY_OF_WEEK_INTERVAL)) {
        return { [field]: value, value: MAX_DAY_OF_WEEK_INTERVAL };
    }
    return { [field]: value };
}
function reducer(state, action) {
    switch (action.type) {
        case 'replace-config':
            return { ...state, config: action.config };
        case 'change-field':
            return {
                ...state,
                config: {
                    ...state.config,
                    [action.field]: action.value,
                    patterns: state.config.frequency !== 'monthly' ? [] : state.config.patterns,
                },
            };
        case 'update-recurrence':
            return {
                ...state,
                config: {
                    ...state.config,
                    patterns: state.config.patterns.map(p => p === action.recurrence
                        ? { ...action.recurrence, ...boundedRecurrence(action) }
                        : p),
                },
            };
        case 'add-recurrence':
            return {
                ...state,
                config: {
                    ...state.config,
                    patterns: [
                        ...(state.config.patterns || []),
                        createMonthlyRecurrence(state.config.start),
                    ],
                },
            };
        case 'remove-recurrence':
            return {
                ...state,
                config: {
                    ...state.config,
                    patterns: state.config.patterns.filter(p => p !== action.recurrence),
                },
            };
        case 'set-skip-weekend':
            return {
                ...state,
                config: {
                    ...state.config,
                    skipWeekend: action.skipWeekend,
                },
            };
        case 'set-weekend-solve':
            return {
                ...state,
                config: {
                    ...state.config,
                    weekendSolveMode: action.value,
                },
            };
        default:
            return state;
    }
}
function SchedulePreview({ previewDates, }) {
    const locale = useLocale();
    const dateFormat = (useDateFormat() || 'MM/dd/yyyy')
        .replace('MM', 'M')
        .replace('dd', 'd');
    if (!previewDates) {
        return null;
    }
    let content = null;
    if (typeof previewDates === 'string') {
        content = _jsx(Text, { children: previewDates });
    }
    else {
        content = (_jsxs(View, { children: [_jsx(Text, { style: { fontWeight: 600 }, children: _jsx(Trans, { children: "Upcoming dates" }) }), _jsx(Stack, { direction: "row", spacing: 4, style: { marginTop: 10 }, children: previewDates.map((d, idx) => (_jsxs(View, { children: [_jsx(Text, { children: monthUtils.format(d, dateFormat, locale) }), _jsx(Text, { children: monthUtils.format(d, 'EEEE', locale) })] }, idx))) })] }));
    }
    return (_jsx(Stack, { direction: "column", spacing: 1, style: { marginTop: 15, color: theme.tableText }, children: content }));
}
function validInterval(interval) {
    const intInterval = Number(interval);
    return Number.isInteger(intInterval) && intInterval > 0 ? intInterval : 1;
}
function MonthlyPatterns({ config, dispatch, }) {
    const { t } = useTranslation();
    const { DAY_OF_WEEK_OPTIONS } = useDayOfWeekOptions();
    return (_jsx(Stack, { spacing: 2, style: { marginTop: 10 }, children: config.patterns.map((recurrence, idx) => (_jsxs(View, { style: {
                display: 'flex',
                flexDirection: 'row',
            }, children: [_jsx(Select, { options: [
                        [-1, t('Last')],
                        Menu.line,
                        ...DAY_OF_MONTH_OPTIONS.map(opt => [opt, String(opt)]),
                    ], value: recurrence.value, onChange: value => dispatch({
                        type: 'update-recurrence',
                        recurrence,
                        field: 'value',
                        value: parsePatternValue(value),
                    }), style: { flex: 1, marginRight: 10 } }), _jsx(Select, { options: [
                        ['day', t('Day')],
                        Menu.line,
                        ...DAY_OF_WEEK_OPTIONS.map(opt => [opt.id, opt.name]),
                    ], value: recurrence.type, onChange: value => {
                        dispatch({
                            type: 'update-recurrence',
                            recurrence,
                            field: 'type',
                            value,
                        });
                    }, style: { flex: 1, marginRight: 10 } }), _jsx(Button, { variant: "bare", "aria-label": t('Remove recurrence'), style: { padding: 7 }, onPress: () => dispatch({
                        type: 'remove-recurrence',
                        recurrence,
                    }), children: _jsx(SvgSubtract, { style: { width: 8, height: 8 } }) }), _jsx(Button, { variant: "bare", "aria-label": t('Add recurrence'), style: { padding: 7, marginLeft: 5 }, onPress: () => dispatch({ type: 'add-recurrence' }), children: _jsx(SvgAdd, { style: { width: 10, height: 10 } }) })] }, idx))) }));
}
function RecurringScheduleTooltip({ config: currentConfig, onClose, onSave, }) {
    const { t } = useTranslation();
    const [previewDates, setPreviewDates] = useState(null);
    const { FREQUENCY_OPTIONS } = useFrequencyOptions();
    const [state, dispatch] = useReducer(reducer, {
        config: parseConfig(currentConfig),
    });
    const skipWeekend = state.config.hasOwnProperty('skipWeekend')
        ? state.config.skipWeekend
        : false;
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    useEffect(() => {
        dispatch({
            type: 'replace-config',
            config: parseConfig(currentConfig),
        });
    }, [currentConfig]);
    const { config } = state;
    const updateField = (field, value) => dispatch({ type: 'change-field', field, value });
    useEffect(() => {
        async function run() {
            const { data, error } = await sendCatch('schedule/get-upcoming-dates', {
                config: unparseConfig(config),
                count: 4,
            });
            setPreviewDates(error ? t('Invalid rule') : data);
        }
        run();
    }, [config, t]);
    if (previewDates == null) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 5 }, children: [_jsx("label", { htmlFor: "start", children: _jsx(Trans, { children: "From" }) }), _jsx(InitialFocus, { children: _jsx(DateSelect, { id: "start", inputProps: { placeholder: t('Start Date') }, value: config.start, onSelect: value => updateField('start', value), containerProps: { style: { width: 100 } }, dateFormat: dateFormat }) }), _jsx(Select, { id: "repeat_end_dropdown", options: [
                            ['never', t('indefinitely')],
                            ['after_n_occurrences', t('for')],
                            ['on_date', t('until')],
                        ], value: config.endMode, onChange: value => updateField('endMode', value) }), config.endMode === 'after_n_occurrences' && (_jsxs(_Fragment, { children: [_jsx(Input, { id: "end_occurrences", style: { width: 40 }, type: "number", min: 1, onChangeValue: value => updateField('endOccurrences', value), defaultValue: config.endOccurrences || 1 }), config.endOccurrences === '1' ? (_jsx(Trans, { children: "occurrence" })) : (_jsx(Trans, { children: "occurrences" }))] })), config.endMode === 'on_date' && (_jsx(DateSelect, { id: "end_date", inputProps: { placeholder: t('End Date') }, value: config.endDate, onSelect: value => updateField('endDate', value), containerProps: { style: { width: 100 } }, dateFormat: dateFormat }))] }), _jsxs(SpaceBetween, { direction: "horizontal", style: { marginTop: 10 }, gap: 5, children: [_jsx(Text, { style: { whiteSpace: 'nowrap' }, children: _jsx(Trans, { children: "Repeat every" }) }), _jsx(Input, { id: "interval", style: {
                            minWidth: '7ch',
                            width: `${String(config.interval || 1).length + 4}ch`,
                            maxWidth: '12ch',
                        }, type: "number", min: 1, onChangeValue: value => updateField('interval', value), defaultValue: config.interval || 1 }), _jsx(Select, { options: FREQUENCY_OPTIONS.map(opt => [opt.id, opt.name]), value: config.frequency, onChange: value => updateField('frequency', value) }), config.frequency === 'monthly' &&
                        (config.patterns == null || config.patterns.length === 0) ? (_jsx(Button, { style: {
                            backgroundColor: theme.tableBackground,
                        }, onPress: () => dispatch({ type: 'add-recurrence' }), children: _jsx(Trans, { children: "Add specific days" }) })) : null] }), config.frequency === 'monthly' &&
                config.patterns &&
                config.patterns.length > 0 && (_jsx(MonthlyPatterns, { config: config, dispatch: dispatch })), _jsx(Stack, { direction: "column", style: { marginTop: 5 }, children: _jsxs(View, { style: {
                        marginTop: 5,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        userSelect: 'none',
                    }, children: [_jsx(Checkbox, { id: "form_skipwe", checked: skipWeekend, onChange: e => {
                                dispatch({
                                    type: 'set-skip-weekend',
                                    skipWeekend: e.target.checked,
                                });
                            } }), _jsxs(Trans, { children: [_jsxs("label", { htmlFor: "form_skipwe", style: {
                                        userSelect: 'none',
                                        marginRight: 5,
                                    }, children: ["Move schedule", ' '] }), _jsx(Select, { id: "solve_dropdown", options: [
                                        ['before', t('before')],
                                        ['after', t('after')],
                                    ], value: state.config.weekendSolveMode, onChange: value => dispatch({ type: 'set-weekend-solve', value }), disabled: !skipWeekend }), _jsxs("label", { htmlFor: "solve_dropdown", style: { userSelect: 'none', marginLeft: 5 }, children: [' ', { beforeOrAfter: '' }, " weekend"] })] })] }) }), _jsx(SchedulePreview, { previewDates: previewDates }), _jsxs("div", { style: { display: 'flex', marginTop: 15, justifyContent: 'flex-end' }, children: [_jsx(Button, { onPress: onClose, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", onPress: () => onSave(unparseConfig(config)), style: { marginLeft: 10 }, children: _jsx(Trans, { children: "Apply" }) })] })] }));
}
export function RecurringSchedulePicker({ value, buttonStyle, onChange, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const triggerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const locale = useLocale();
    function onSave(config) {
        onChange(config);
        setIsOpen(false);
    }
    const recurringDescription = useMemo(() => getRecurringDescription(value, dateFormat, locale), [locale, value, dateFormat]);
    const tooltip = (_jsx(RecurringScheduleTooltip, { config: value, onClose: () => setIsOpen(false), onSave: onSave }));
    return (_jsxs(View, { children: [_jsx(Button, { ref: triggerRef, style: { textAlign: 'left', ...buttonStyle }, onPress: () => setIsOpen(true), children: value ? recurringDescription : t('No recurring date') }), isNarrowWidth ? (_jsx(Modal, { name: "recurring-schedule-picker", isOpen: isOpen, onClose: () => setIsOpen(false), children: tooltip })) : (_jsx(Popover, { triggerRef: triggerRef, style: {
                    padding: 10,
                    minWidth: 380,
                    width: 'auto',
                    maxWidth: '100%',
                }, placement: "bottom start", isOpen: isOpen, onOpenChange: () => setIsOpen(false), children: tooltip }))] }));
}
