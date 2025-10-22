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
exports.DateRange = DateRange;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var d = require("date-fns");
var monthUtils = require("loot-core/shared/months");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
function checkDate(date) {
    var dateParsed = monthUtils.parseDate(date);
    if (dateParsed) {
        return d.format(dateParsed, 'yyyy-MM-dd');
    }
    else {
        return null;
    }
}
function DateRange(_a) {
    var start = _a.start, end = _a.end, type = _a.type;
    var t = (0, react_i18next_1.useTranslation)().t;
    var locale = (0, useLocale_1.useLocale)();
    var checkStart = checkDate(start);
    var checkEnd = checkDate(end);
    var startDate;
    var endDate;
    if (checkStart && checkEnd) {
        startDate = d.parseISO(checkStart);
        endDate = d.parseISO(checkEnd);
    }
    else {
        return (<text_1.Text style={__assign(__assign({}, styles_1.styles.mediumText), { color: theme_1.theme.errorText })}>
        <react_i18next_1.Trans>There was a problem loading your date range</react_i18next_1.Trans>
      </text_1.Text>);
    }
    var formattedStartDate = d.format(startDate, 'MMM yyyy', { locale: locale });
    var formattedEndDate = d.format(endDate, 'MMM yyyy', { locale: locale });
    var typeOrFormattedEndDate;
    if (type && ['budget', 'average'].includes(type)) {
        typeOrFormattedEndDate = type === 'budget' ? t('budgeted') : t('average');
    }
    else {
        typeOrFormattedEndDate = formattedEndDate;
    }
    var content;
    if (['budget', 'average'].includes(type || '')) {
        content = (<div>
        <react_i18next_1.Trans>
          Compare {{ formattedStartDate: formattedStartDate }} to {{ typeOrFormattedEndDate: typeOrFormattedEndDate }}
        </react_i18next_1.Trans>
      </div>);
    }
    else if (startDate.getFullYear() !== endDate.getFullYear() ||
        startDate.getMonth() !== endDate.getMonth()) {
        content = (<div>
        {type ? (<react_i18next_1.Trans>
            Compare {{ formattedStartDate: formattedStartDate }} to {{ typeOrFormattedEndDate: typeOrFormattedEndDate }}
          </react_i18next_1.Trans>) : (<>
            {formattedStartDate} - {formattedEndDate}
          </>)}
      </div>);
    }
    else {
        content = d.format(endDate, 'MMMM yyyy', { locale: locale });
    }
    return <block_1.Block style={{ color: theme_1.theme.pageTextSubdued }}>{content}</block_1.Block>;
}
