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
exports.Value = Value;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var date_fns_1 = require("date-fns");
var months_1 = require("loot-core/shared/months");
var schedules_1 = require("loot-core/shared/schedules");
var Link_1 = require("@desktop-client/components/common/Link");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
function Value(_a) {
    var value = _a.value, field = _a.field, valueIsRaw = _a.valueIsRaw, _b = _a.inline, inline = _b === void 0 ? false : _b, dataProp = _a.data, 
    // @ts-expect-error fix this later
    _c = _a.describe, 
    // @ts-expect-error fix this later
    describe = _c === void 0 ? function (x) { return x.name; } : _c, style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var payees = (0, usePayees_1.usePayees)();
    var categories = (0, useCategories_1.useCategories)().list;
    var accounts = (0, useAccounts_1.useAccounts)();
    var valueStyle = __assign({ color: theme_1.theme.pageTextPositive }, style);
    var locale = (0, useLocale_1.useLocale)();
    var data = dataProp ||
        (field === 'payee'
            ? payees
            : field === 'category'
                ? categories
                : field === 'account'
                    ? accounts
                    : []);
    var _d = (0, react_1.useState)(false), expanded = _d[0], setExpanded = _d[1];
    function onExpand(e) {
        e.preventDefault();
        setExpanded(true);
    }
    function formatValue(value) {
        if (value == null || value === '') {
            return t('(nothing)');
        }
        else if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        }
        else {
            switch (field) {
                case 'amount':
                    return format(value, 'financial');
                case 'date':
                    if (value) {
                        if (value.frequency) {
                            return (0, schedules_1.getRecurringDescription)(value, dateFormat, locale);
                        }
                        return (0, date_fns_1.format)((0, date_fns_1.parseISO)(value), dateFormat);
                    }
                    return null;
                case 'month':
                    return value
                        ? (0, date_fns_1.format)((0, date_fns_1.parseISO)(value), (0, months_1.getMonthYearFormat)(dateFormat))
                        : null;
                case 'year':
                    return value ? (0, date_fns_1.format)((0, date_fns_1.parseISO)(value), 'yyyy') : null;
                case 'notes':
                case 'imported_payee':
                case 'payee_name':
                    return value;
                case 'payee':
                case 'category':
                case 'account':
                case 'rule':
                    if (valueIsRaw) {
                        return value;
                    }
                    if (data && Array.isArray(data)) {
                        var item = data.find(function (item) { return item.id === value; });
                        if (item) {
                            return describe(item);
                        }
                        else {
                            return t('(deleted)');
                        }
                    }
                    return '…';
                default:
                    throw new Error("Unknown field ".concat(field));
            }
        }
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return <text_1.Text style={valueStyle}>(empty)</text_1.Text>;
        }
        else if (value.length === 1) {
            return (<text_1.Text>
          [<text_1.Text style={valueStyle}>{formatValue(value[0])}</text_1.Text>]
        </text_1.Text>);
        }
        var displayed = value;
        if (!expanded && value.length > 4) {
            displayed = value.slice(0, 3);
        }
        var numHidden = value.length - displayed.length;
        return (<text_1.Text style={{ color: theme_1.theme.tableText }}>
        [
        {displayed.map(function (v, i) {
                var text = <text_1.Text style={valueStyle}>{formatValue(v)}</text_1.Text>;
                var spacing;
                if (inline) {
                    spacing = i !== 0 ? ' ' : '';
                }
                else {
                    spacing = (<>
                {i === 0 && <br />}
                &nbsp;&nbsp;
              </>);
                }
                return (<text_1.Text key={i}>
              {spacing}
              {text}
              {i === value.length - 1 ? '' : ','}
              {!inline && <br />}
            </text_1.Text>);
            })}
        {numHidden > 0 && (<text_1.Text style={valueStyle}>
            &nbsp;&nbsp;
            <Link_1.Link variant="text" onClick={onExpand} style={valueStyle}>
              {t('{{num}} more items...', { num: numHidden })}
            </Link_1.Link>
            {!inline && <br />}
          </text_1.Text>)}
        ]
      </text_1.Text>);
        // @ts-expect-error Fix typechecker here
    }
    else if (value && value.num1 != null && value.num2 != null) {
        // An "in between" type
        // @ts-expect-error Fix typechecker here
        var num1 = value.num1, num2 = value.num2;
        return (<text_1.Text>
        <text_1.Text style={valueStyle}>{formatValue(num1)}</text_1.Text> {t('and')}{' '}
        <text_1.Text style={valueStyle}>{formatValue(num2)}</text_1.Text>
      </text_1.Text>);
    }
    else {
        return <text_1.Text style={valueStyle}>{formatValue(value)}</text_1.Text>;
    }
}
