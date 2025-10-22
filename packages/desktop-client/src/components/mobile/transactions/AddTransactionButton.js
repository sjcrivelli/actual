"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTransactionButton = AddTransactionButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function AddTransactionButton(_a) {
    var _b = _a.to, to = _b === void 0 ? '/transactions/new' : _b, accountId = _a.accountId, categoryId = _a.categoryId;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    return (<button_1.Button variant="bare" aria-label={t('Add transaction')} style={{ margin: 10 }} onPress={function () {
            navigate(to, { state: { accountId: accountId, categoryId: categoryId } });
        }}>
      <v1_1.SvgAdd width={20} height={20}/>
    </button_1.Button>);
}
