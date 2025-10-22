"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayeeRuleCountLabel = PayeeRuleCountLabel;
var react_i18next_1 = require("react-i18next");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
function PayeeRuleCountLabel(_a) {
    var count = _a.count, isLoading = _a.isLoading, style = _a.style;
    return (<text_1.Text style={style}>
      {isLoading ? (<view_1.View>
          <AnimatedLoading_1.AnimatedLoading style={{ width: 12, height: 12 }}/>
        </view_1.View>) : count > 0 ? (<react_i18next_1.Trans count={count}>{{ count: count }} associated rules</react_i18next_1.Trans>) : (<react_i18next_1.Trans>Create rule</react_i18next_1.Trans>)}
    </text_1.Text>);
}
