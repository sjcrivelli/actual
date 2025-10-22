"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeMenu = IncomeMenu;
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var EnvelopeBudgetComponents_1 = require("./EnvelopeBudgetComponents");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function IncomeMenu(_a) {
    var categoryId = _a.categoryId, month = _a.month, onBudgetAction = _a.onBudgetAction, onShowActivity = _a.onShowActivity, _b = _a.onClose, onClose = _b === void 0 ? function () { } : _b;
    var t = (0, react_i18next_1.useTranslation)().t;
    var carryover = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.catCarryover(categoryId));
    return (<span>
      <menu_1.Menu onMenuSelect={function (name) {
            switch (name) {
                case 'view':
                    onShowActivity(categoryId, month);
                    break;
                case 'carryover':
                    if (!carryover)
                        onBudgetAction(month, 'reset-hold');
                    onBudgetAction(month, 'carryover', {
                        category: categoryId,
                        flag: !carryover,
                    });
                    onClose();
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
        }} items={[
            {
                name: 'carryover',
                text: carryover ? t('Disable auto hold') : t('Enable auto hold'),
            },
            {
                name: 'view',
                text: t('View transactions'),
            },
        ]}/>
    </span>);
}
