"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplierOption = MultiplierOption;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var input_1 = require("@actual-app/components/input");
var view_1 = require("@actual-app/components/view");
var CheckboxOption_1 = require("./CheckboxOption");
function MultiplierOption(_a) {
    var multiplierEnabled = _a.multiplierEnabled, multiplierAmount = _a.multiplierAmount, onToggle = _a.onToggle, onChangeAmount = _a.onChangeAmount;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{ flexDirection: 'row', gap: 10, height: 28 }}>
      <CheckboxOption_1.CheckboxOption id="add_multiplier" checked={multiplierEnabled} onChange={onToggle}>
        <react_i18next_1.Trans>Multiply amount</react_i18next_1.Trans>
      </CheckboxOption_1.CheckboxOption>
      <input_1.Input type="text" style={{ display: multiplierEnabled ? 'inherit' : 'none' }} value={multiplierAmount} placeholder={t('Multiplier')} onChangeValue={onChangeAmount}/>
    </view_1.View>);
}
