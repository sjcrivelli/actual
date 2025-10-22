"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedDate = ParsedDate;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var utils_1 = require("./utils");
function ParsedDate(_a) {
    var parseDateFormat = _a.parseDateFormat, dateFormat = _a.dateFormat, date = _a.date;
    var parsed = date &&
        (0, utils_1.formatDate)(parseDateFormat ? (0, utils_1.parseDate)(date, parseDateFormat) : date, dateFormat);
    return (<text_1.Text>
      <text_1.Text>
        {date || (<text_1.Text style={{ color: theme_1.theme.pageTextLight, fontStyle: 'italic' }}>
            <react_i18next_1.Trans>Empty</react_i18next_1.Trans>
          </text_1.Text>)}{' '}
        &rarr;{' '}
      </text_1.Text>
      <text_1.Text style={{ color: parsed ? theme_1.theme.noticeTextLight : theme_1.theme.errorText }}>
        {parsed || <react_i18next_1.Trans>Invalid</react_i18next_1.Trans>}
      </text_1.Text>
    </text_1.Text>);
}
