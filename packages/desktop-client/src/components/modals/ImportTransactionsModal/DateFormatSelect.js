"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormatSelect = DateFormatSelect;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var view_1 = require("@actual-app/components/view");
var utils_1 = require("./utils");
var forms_1 = require("@desktop-client/components/forms");
function DateFormatSelect(_a) {
    var transactions = _a.transactions, fieldMappings = _a.fieldMappings, parseDateFormat = _a.parseDateFormat, onChange = _a.onChange;
    var t = (0, react_i18next_1.useTranslation)().t;
    // We don't actually care about the delimiter, but we try to render
    // it based on the data we have so far. Look in a transaction and
    // try to figure out what delimiter the date is using, and default
    // to space if we can't figure it out.
    var delimiter = '-';
    if (transactions.length > 0 && fieldMappings && fieldMappings.date != null) {
        var date = transactions[0][fieldMappings.date];
        var m = date && String(date).match(/[/.,\-/\\]/);
        delimiter = m ? m[0] : ' ';
    }
    return (<view_1.View style={{ width: 120 }}>
      <forms_1.SectionLabel title={t('Date format')}/>
      <select_1.Select options={utils_1.dateFormats.map(function (f) { return [
            f.format,
            f.label.replace(/ /g, delimiter),
        ]; })} value={parseDateFormat || ''} onChange={onChange}/>
    </view_1.View>);
}
