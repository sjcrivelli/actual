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
exports.DateSelect = DateSelect;
// @ts-strict-ignore
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var input_1 = require("@actual-app/components/input");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var date_fns_1 = require("date-fns");
var pikaday_1 = require("pikaday");
var months_1 = require("loot-core/shared/months");
require("pikaday/css/pikaday.css");
var DateSelect_left_png_1 = require("./DateSelect.left.png");
var DateSelect_right_png_1 = require("./DateSelect.right.png");
var MobileForms_1 = require("@desktop-client/components/mobile/MobileForms");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var pickerStyles = {
    '& .pika-single.actual-date-picker': {
        color: theme_1.theme.calendarText,
        background: theme_1.theme.calendarBackground,
        border: 'none',
        boxShadow: '0 0px 4px rgba(0, 0, 0, .25)',
        borderRadius: 4,
    },
    '& .actual-date-picker': {
        '& .pika-lendar': {
            float: 'none',
            width: 'auto',
        },
        // month/year
        '& .pika-label': {
            backgroundColor: theme_1.theme.calendarBackground,
        },
        // Back/forward buttons
        '& .pika-prev': {
            backgroundImage: "url(".concat(DateSelect_left_png_1.default, ")"),
        },
        '& .pika-next': {
            backgroundImage: "url(".concat(DateSelect_right_png_1.default, ")"),
        },
        // Day of week
        '& .pika-table th': {
            color: theme_1.theme.calendarItemText,
            '& abbr': { textDecoration: 'none' },
        },
        // Numbered days
        '& .pika-button': {
            backgroundColor: theme_1.theme.calendarItemBackground,
            color: theme_1.theme.calendarItemText,
        },
        '& .is-today .pika-button': {
            textDecoration: 'underline',
        },
        '& .is-selected .pika-button': {
            backgroundColor: theme_1.theme.calendarSelectedBackground,
            boxShadow: 'none',
        },
    },
};
function createPikadayLocale(dateFnsLocale) {
    var months = Array.from({ length: 12 }, function (_, i) {
        return (0, date_fns_1.format)(new Date(2023, i, 1), 'MMMM', { locale: dateFnsLocale });
    });
    var weekdays = Array.from({ length: 7 }, function (_, i) {
        return (0, date_fns_1.format)(new Date(2023, 0, i + 1), 'EEEE', { locale: dateFnsLocale });
    });
    var weekdaysShort = Array.from({ length: 7 }, function (_, i) {
        return (0, date_fns_1.format)(new Date(2023, 0, i + 1), 'EEE', { locale: dateFnsLocale }).slice(0, 3);
    });
    return {
        previousMonth: 'Previous',
        nextMonth: 'Next',
        months: months,
        weekdays: weekdays,
        weekdaysShort: weekdaysShort,
    };
}
var DatePicker = (0, react_1.forwardRef)(function (_a, ref) {
    var value = _a.value, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, dateFormat = _a.dateFormat, onUpdate = _a.onUpdate, onSelect = _a.onSelect;
    var locale = (0, useLocale_1.useLocale)();
    var picker = (0, react_1.useRef)(null);
    var mountPoint = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        handleInputKeyDown: function (e) {
            var newDate = null;
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    newDate = (0, date_fns_1.subDays)(picker.current.getDate(), 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    newDate = (0, date_fns_1.subDays)(picker.current.getDate(), 7);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    newDate = (0, date_fns_1.addDays)(picker.current.getDate(), 1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    newDate = (0, date_fns_1.addDays)(picker.current.getDate(), 7);
                    break;
                default:
            }
            if (newDate) {
                picker.current.setDate(newDate, true);
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(newDate);
            }
        },
    }); }, []);
    (0, react_1.useLayoutEffect)(function () {
        var pikadayLocale = createPikadayLocale(locale);
        picker.current = new pikaday_1.default({
            theme: 'actual-date-picker',
            keyboardInput: false,
            firstDay: parseInt(firstDayOfWeekIdx),
            defaultDate: value
                ? (0, date_fns_1.parse)(value, dateFormat, (0, months_1.currentDate)())
                : (0, months_1.currentDate)(),
            setDefaultDate: true,
            toString: function (date) {
                return (0, date_fns_1.format)(date, dateFormat);
            },
            parse: function (dateString) {
                return (0, date_fns_1.parse)(dateString, dateFormat, new Date());
            },
            onSelect: onSelect,
            i18n: pikadayLocale,
        });
        mountPoint.current.appendChild(picker.current.el);
        return function () {
            picker.current.destroy();
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (value && picker.current.getDate() !== value) {
            picker.current.setDate((0, date_fns_1.parse)(value, dateFormat, new Date()), true);
        }
    }, [value, dateFormat]);
    return (<view_1.View className={(0, css_1.css)([pickerStyles, { flex: 1 }])} innerRef={mountPoint}/>);
});
DatePicker.displayName = 'DatePicker';
function defaultShouldSaveFromKey(e) {
    return e.key === 'Enter';
}
function DateSelectDesktop(_a) {
    var id = _a.id, containerProps = _a.containerProps, inputProps = _a.inputProps, defaultValue = _a.value, isOpen = _a.isOpen, embedded = _a.embedded, _b = _a.dateFormat, dateFormat = _b === void 0 ? 'yyyy-MM-dd' : _b, _c = _a.openOnFocus, openOnFocus = _c === void 0 ? true : _c, originalInputRef = _a.inputRef, _d = _a.shouldSaveFromKey, shouldSaveFromKey = _d === void 0 ? defaultShouldSaveFromKey : _d, _e = _a.clearOnBlur, clearOnBlur = _e === void 0 ? true : _e, onUpdate = _a.onUpdate, onSelect = _a.onSelect;
    var parsedDefaultValue = (0, react_1.useMemo)(function () {
        if (defaultValue) {
            var date = (0, date_fns_1.parseISO)(defaultValue);
            if ((0, date_fns_1.isValid)(date)) {
                return (0, date_fns_1.format)(date, dateFormat);
            }
        }
        return '';
    }, [defaultValue, dateFormat]);
    var picker = (0, react_1.useRef)(null);
    var _f = (0, react_1.useState)(parsedDefaultValue), value = _f[0], setValue = _f[1];
    var _g = (0, react_1.useState)(embedded || isOpen || false), open = _g[0], setOpen = _g[1];
    var inputRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(function () {
        if (originalInputRef) {
            originalInputRef.current = inputRef.current;
        }
    }, []);
    // This is confusing, so let me explain: `selectedValue` should be
    // renamed to `currentValue`. It represents the current highlighted
    // value in the date select and always changes as the user moves
    // around. `userSelectedValue` represents the last value that the
    // user actually selected (with enter or click). Having both allows
    // us to make various UX decisions
    var _h = (0, react_1.useState)(value), selectedValue = _h[0], setSelectedValue = _h[1];
    var userSelectedValue = (0, react_1.useRef)(selectedValue);
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    (0, react_1.useEffect)(function () {
        userSelectedValue.current = value;
    }, [value]);
    (0, react_1.useEffect)(function () { return setValue(parsedDefaultValue); }, [parsedDefaultValue]);
    (0, react_1.useEffect)(function () {
        if ((0, months_1.getDayMonthRegex)(dateFormat).test(value)) {
            // Support only entering the month and day (4/5). This is complex
            // because of the various date formats - we need to derive
            // the right day/month format from it
            var test = (0, date_fns_1.parse)(value, (0, months_1.getDayMonthFormat)(dateFormat), new Date());
            if ((0, date_fns_1.isValid)(test)) {
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate((0, date_fns_1.format)(test, 'yyyy-MM-dd'));
                setSelectedValue((0, date_fns_1.format)(test, dateFormat));
            }
        }
        else if ((0, months_1.getShortYearRegex)(dateFormat).test(value)) {
            // Support entering the year as only two digits (4/5/19)
            var test = (0, date_fns_1.parse)(value, (0, months_1.getShortYearFormat)(dateFormat), new Date());
            if ((0, date_fns_1.isValid)(test)) {
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate((0, date_fns_1.format)(test, 'yyyy-MM-dd'));
                setSelectedValue((0, date_fns_1.format)(test, dateFormat));
            }
        }
        else {
            var test = (0, date_fns_1.parse)(value, dateFormat, new Date());
            if ((0, date_fns_1.isValid)(test)) {
                var date = (0, date_fns_1.format)(test, 'yyyy-MM-dd');
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(date);
                setSelectedValue(value);
            }
        }
    }, [value]);
    function onKeyDown(e) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
            !e.shiftKey &&
            !e.metaKey &&
            !e.altKey &&
            open) {
            picker.current.handleInputKeyDown(e);
        }
        else if (e.key === 'Escape') {
            setValue(parsedDefaultValue);
            setSelectedValue(parsedDefaultValue);
            if (parsedDefaultValue === value) {
                if (open) {
                    if (!embedded) {
                        e.stopPropagation();
                    }
                    setOpen(false);
                }
            }
            else {
                setOpen(true);
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(defaultValue);
            }
        }
        else if (shouldSaveFromKey(e)) {
            if (selectedValue) {
                setValue(selectedValue);
                var date = (0, date_fns_1.parse)(selectedValue, dateFormat, new Date());
                onSelect((0, date_fns_1.format)(date, 'yyyy-MM-dd'));
            }
            setOpen(false);
            if (open && e.key === 'Enter') {
                // This stops the event from propagating up
                e.stopPropagation();
                e.preventDefault();
            }
            var onKeyDown_1 = (inputProps || {}).onKeyDown;
            onKeyDown_1 === null || onKeyDown_1 === void 0 ? void 0 : onKeyDown_1(e);
        }
        else if (!open) {
            setOpen(true);
            if (inputRef.current) {
                inputRef.current.setSelectionRange(0, 10000);
            }
        }
    }
    function onChange(e) {
        setValue(e.target.value);
    }
    var maybeWrapTooltip = function (content) {
        if (embedded) {
            return open ? content : null;
        }
        return (<popover_1.Popover triggerRef={inputRef} placement="bottom start" offset={2} isOpen={open} isNonModal onOpenChange={function () { return setOpen(false); }} style={__assign(__assign({}, styles_1.styles.popover), { minWidth: 225 })} data-testid="date-select-tooltip">
        {content}
      </popover_1.Popover>);
    };
    return (<view_1.View {...containerProps}>
      <input_1.Input id={id} {...inputProps} ref={inputRef} value={value} onPointerUp={function () {
            if (!embedded) {
                setOpen(true);
            }
        }} onKeyDown={onKeyDown} onChange={onChange} onFocus={function (e) {
            var _a;
            if (!embedded && openOnFocus) {
                setOpen(true);
            }
            (_a = inputProps === null || inputProps === void 0 ? void 0 : inputProps.onFocus) === null || _a === void 0 ? void 0 : _a.call(inputProps, e);
        }} onBlur={function (e) {
            var _a;
            if (!embedded) {
                setOpen(false);
            }
            (_a = inputProps === null || inputProps === void 0 ? void 0 : inputProps.onBlur) === null || _a === void 0 ? void 0 : _a.call(inputProps, e);
            if (clearOnBlur) {
                // If value is empty, that drives what gets selected.
                // Otherwise the input is reset to whatever is already
                // selected
                if (value === '') {
                    setSelectedValue(null);
                    onSelect(null);
                }
                else {
                    setValue(selectedValue || '');
                    var date = (0, date_fns_1.parse)(selectedValue, dateFormat, new Date());
                    if (date instanceof Date && !isNaN(date.valueOf())) {
                        onSelect((0, date_fns_1.format)(date, 'yyyy-MM-dd'));
                    }
                }
            }
        }}/>
      {maybeWrapTooltip(<DatePicker ref={picker} value={selectedValue} firstDayOfWeekIdx={firstDayOfWeekIdx} dateFormat={dateFormat} onUpdate={function (date) {
                setSelectedValue((0, date_fns_1.format)(date, dateFormat));
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate((0, date_fns_1.format)(date, 'yyyy-MM-dd'));
            }} onSelect={function (date) {
                setValue((0, date_fns_1.format)(date, dateFormat));
                onSelect((0, date_fns_1.format)(date, 'yyyy-MM-dd'));
                setOpen(false);
            }}/>)}
    </view_1.View>);
}
function DateSelectMobile(props) {
    var _a;
    return (<MobileForms_1.InputField id={props.id} type="date" value={(_a = props.value) !== null && _a !== void 0 ? _a : ''} onChange={function (event) {
            props.onSelect(event.target.value);
        }} style={{ height: 28 }} {...props.inputProps}/>);
}
function DateSelect(props) {
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    if (isNarrowWidth) {
        return <DateSelectMobile {...props}/>;
    }
    return <DateSelectDesktop {...props}/>;
}
