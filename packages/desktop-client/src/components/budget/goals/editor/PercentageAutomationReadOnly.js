"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageAutomationReadOnly = void 0;
var react_i18next_1 = require("react-i18next");
var PercentageAutomationReadOnly = function (_a) {
    var _b, _c;
    var template = _a.template, categoryNameMap = _a.categoryNameMap;
    var t = (0, react_i18next_1.useTranslation)().t;
    if (template.category === 'total') {
        return template.previous ? (<react_i18next_1.Trans>
        Budget {{ percent: template.percent }}% of total income last month
      </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
        Budget {{ percent: template.percent }}% of total income this month
      </react_i18next_1.Trans>);
    }
    if (template.category === 'to-budget') {
        return template.previous ? (<react_i18next_1.Trans>
        Budget {{ percent: template.percent }}% of available funds to budget
        last month
      </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
        Budget {{ percent: template.percent }}% of available funds to budget
        this month
      </react_i18next_1.Trans>);
    }
    // Regular income categories
    return template.previous ? (<react_i18next_1.Trans>
      Budget {{ percent: template.percent }}% of &lsquo;
      {{
            category: (_b = categoryNameMap[template.category]) !== null && _b !== void 0 ? _b : t('Unknown category'),
        }}
      &rsquo; last month
    </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
      Budget {{ percent: template.percent }}% of &lsquo;
      {{
            category: (_c = categoryNameMap[template.category]) !== null && _c !== void 0 ? _c : t('Unknown category'),
        }}
      &rsquo; this month
    </react_i18next_1.Trans>);
};
exports.PercentageAutomationReadOnly = PercentageAutomationReadOnly;
