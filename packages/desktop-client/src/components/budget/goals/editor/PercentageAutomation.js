"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageAutomation = void 0;
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var view_1 = require("@actual-app/components/view");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var actions_1 = require("@desktop-client/components/budget/goals/actions");
var forms_1 = require("@desktop-client/components/forms");
var PercentInput_1 = require("@desktop-client/components/util/PercentInput");
var PercentageAutomation = function (_a) {
    var dispatch = _a.dispatch, template = _a.template, categories = _a.categories;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<>
      <stack_1.Stack direction="row" align="center" spacing={10} style={{ marginTop: 10 }}>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Category')} htmlFor="category-field"/>
          <CategoryAutocomplete_1.CategoryAutocomplete inputProps={{ id: 'category-field' }} onSelect={function (category) {
            return dispatch((0, actions_1.updateTemplate)({ type: 'percentage', category: category }));
        }} value={template.category} categoryGroups={template.previous
            ? categories.map(function (group) {
                var _a;
                return (__assign(__assign({}, group), { categories: (_a = group.categories) === null || _a === void 0 ? void 0 : _a.filter(function (category) { return category.id !== 'to-budget'; }) }));
            })
            : categories}/>
        </forms_1.FormField>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Percentage')} htmlFor="percent-field"/>
          <PercentInput_1.PercentInput id="percent-field" key="percent-input" value={template.percent} onUpdatePercent={function (percent) {
            return dispatch((0, actions_1.updateTemplate)({
                type: 'percentage',
                percent: percent,
            }));
        }}/>
        </forms_1.FormField>
      </stack_1.Stack>
      <stack_1.Stack direction="row" align="center" spacing={10} style={{ marginTop: 10 }}>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormLabel title={t('Percentage of')} htmlFor="previous-field"/>
          <select_1.Select id="previous-field" key="previous-month" options={[
            [false, t('This month')],
            [true, t('Last month')],
        ]} value={template.previous} onChange={function (previous) {
            if (template.type !== 'percentage') {
                return;
            }
            return dispatch((0, actions_1.updateTemplate)(__assign({ type: 'percentage', previous: previous }, (previous && template.category === 'to-budget'
                ? { category: '' }
                : {}))));
        }}/>
        </forms_1.FormField>
        <view_1.View style={{ flex: 1 }}/>
      </stack_1.Stack>
    </>);
};
exports.PercentageAutomation = PercentageAutomation;
