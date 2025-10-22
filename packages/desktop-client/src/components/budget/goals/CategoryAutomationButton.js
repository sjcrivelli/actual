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
exports.CategoryAutomationButton = CategoryAutomationButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function CategoryAutomationButton(_a) {
    var _b;
    var category = _a.category, _c = _a.width, width = _c === void 0 ? 12 : _c, _d = _a.height, height = _d === void 0 ? 12 : _d, _e = _a.defaultColor, defaultColor = _e === void 0 ? theme_1.theme.buttonNormalText : _e, style = _a.style, _f = _a.showPlaceholder, showPlaceholder = _f === void 0 ? false : _f;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var goalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var goalTemplatesUIEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesUIEnabled');
    var hasAutomations = !!((_b = category.goal_def) === null || _b === void 0 ? void 0 : _b.length);
    if (!goalTemplatesEnabled || !goalTemplatesUIEnabled) {
        return null;
    }
    return (<button_1.Button variant="bare" aria-label={t('Change category automations')} className={(0, css_1.cx)(!hasAutomations && !showPlaceholder ? 'hover-visible' : '', (0, css_1.css)(__assign({ color: defaultColor, opacity: hasAutomations || !showPlaceholder ? 1 : 0.3, '&:hover': {
                opacity: 1,
            } }, style)))} onPress={function () {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'category-automations-edit',
                    options: { categoryId: category.id },
                },
            }));
        }}>
      <v1_1.SvgChartPie style={{ width: width, height: height, flexShrink: 0 }}/>
    </button_1.Button>);
}
