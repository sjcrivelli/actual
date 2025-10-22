"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InOutOption = InOutOption;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var input_1 = require("@actual-app/components/input");
var view_1 = require("@actual-app/components/view");
var CheckboxOption_1 = require("./CheckboxOption");
function InOutOption(_a) {
    var inOutMode = _a.inOutMode, outValue = _a.outValue, disabled = _a.disabled, onToggle = _a.onToggle, onChangeText = _a.onChangeText;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{ flexDirection: 'row', gap: 10, height: 28 }}>
      <CheckboxOption_1.CheckboxOption id="form_inOut" checked={inOutMode} disabled={disabled} onChange={onToggle}>
        {inOutMode
            ? t('In/Out outflow value')
            : t('Select column to specify if amount goes in/out')}
      </CheckboxOption_1.CheckboxOption>
      {inOutMode && (<input_1.Input type="text" value={outValue} onChangeValue={onChangeText} placeholder={t('Value for out rows, e.g: ‘Credit’')}/>)}
    </view_1.View>);
}
