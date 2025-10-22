"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUpcomingLength = CustomUpcomingLength;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var input_1 = require("@actual-app/components/input");
var select_1 = require("@actual-app/components/select");
function CustomUpcomingLength(_a) {
    var onChange = _a.onChange, tempValue = _a.tempValue;
    var t = (0, react_i18next_1.useTranslation)().t;
    var options = [
        { value: 'day', label: t('Days') },
        { value: 'week', label: t('Weeks') },
        { value: 'month', label: t('Months') },
        { value: 'year', label: t('Years') },
    ];
    var timePeriod = [];
    if (tempValue === 'custom') {
        timePeriod = ['1', 'day'];
    }
    else {
        timePeriod = tempValue.split('-');
    }
    var _b = (0, react_1.useState)(parseInt(timePeriod[0])), numValue = _b[0], setNumValue = _b[1];
    var _c = (0, react_1.useState)(timePeriod[1]), unit = _c[0], setUnit = _c[1];
    (0, react_1.useEffect)(function () {
        onChange("".concat(numValue, "-").concat(unit));
    }, [numValue, onChange, unit]);
    return (<div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
      <input_1.Input id="length" style={{ width: 40 }} type="number" min={1} onChangeValue={function (value) { return setNumValue(parseInt(value)); }} defaultValue={numValue || 1}/>
      <select_1.Select options={options.map(function (x) { return [x.value, x.label]; })} value={unit} onChange={function (newValue) { return setUnit(newValue); }}/>
    </div>);
}
