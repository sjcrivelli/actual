"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionsOpMenu = ConditionsOpMenu;
var react_1 = require("react");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var RuleEditor_1 = require("@desktop-client/components/rules/RuleEditor");
function ConditionsOpMenu(_a) {
    var conditionsOp = _a.conditionsOp, onChange = _a.onChange, conditions = _a.conditions;
    return conditions.length > 1 ? (<text_1.Text style={{ color: theme_1.theme.pageText, marginTop: 11, marginRight: 5 }}>
      <RuleEditor_1.FieldSelect style={{ display: 'inline-flex' }} fields={[
            ['and', 'all'],
            ['or', 'any'],
        ]} value={conditionsOp} onChange={onChange}/>
      of:
    </text_1.Text>) : (<view_1.View />);
}
