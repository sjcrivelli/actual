"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRuleButton = AddRuleButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function AddRuleButton() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var handleAddRule = (0, react_1.useCallback)(function () {
        navigate('/rules/new');
    }, [navigate]);
    return (<button_1.Button variant="bare" aria-label={t('Add new rule')} style={{ margin: 10 }} onPress={handleAddRule}>
      <v1_1.SvgAdd width={20} height={20}/>
    </button_1.Button>);
}
