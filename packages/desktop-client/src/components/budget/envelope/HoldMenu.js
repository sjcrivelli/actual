"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldMenu = HoldMenu;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var view_1 = require("@actual-app/components/view");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var util_1 = require("loot-core/shared/util");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
function HoldMenu(_a) {
    var onSubmit = _a.onSubmit, onClose = _a.onClose;
    var _b = (0, react_1.useState)(null), amount = _b[0], setAmount = _b[1];
    (0, useSheetValue_1.useSheetValue)('to-budget', function (_a) {
        var value = _a.value;
        setAmount((0, util_1.integerToCurrency)(Math.max(value || 0, 0)));
    });
    function _onSubmit(newAmount) {
        var parsedAmount = (0, arithmetic_1.evalArithmetic)(newAmount);
        if (parsedAmount) {
            onSubmit((0, util_1.amountToInteger)(parsedAmount));
        }
        onClose();
    }
    if (amount === null) {
        // See `TransferMenu` for more info about this
        return null;
    }
    return (<react_aria_components_1.Form onSubmit={function (e) {
            e.preventDefault();
            _onSubmit(amount);
        }}>
      <view_1.View style={{ padding: 10 }}>
        <view_1.View style={{ marginBottom: 5 }}>
          <react_i18next_1.Trans>Hold this amount:</react_i18next_1.Trans>
        </view_1.View>
        <view_1.View>
          <initial_focus_1.InitialFocus>
            <input_1.Input value={amount} onChangeValue={setAmount}/>
          </initial_focus_1.InitialFocus>
        </view_1.View>
        <view_1.View style={{
            alignItems: 'flex-end',
            marginTop: 10,
        }}>
          <button_1.Button type="submit" variant="primary" style={{
            fontSize: 12,
            paddingTop: 3,
            paddingBottom: 3,
        }}>
            <react_i18next_1.Trans>Hold</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
      </view_1.View>
    </react_aria_components_1.Form>);
}
