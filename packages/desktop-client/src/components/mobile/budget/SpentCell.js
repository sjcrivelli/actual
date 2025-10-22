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
exports.SpentCell = SpentCell;
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var auto_text_size_1 = require("auto-text-size");
var BudgetTable_1 = require("./BudgetTable");
var util_1 = require("@desktop-client/components/budget/util");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useCategoryScheduleGoalTemplateIndicator_1 = require("@desktop-client/hooks/useCategoryScheduleGoalTemplateIndicator");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
function SpentCell(_a) {
    var binding = _a.binding, category = _a.category, month = _a.month, show3Columns = _a.show3Columns, onPress = _a.onPress;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var columnWidth = (0, BudgetTable_1.getColumnWidth)({
        show3Columns: show3Columns,
    });
    var _b = (0, useCategoryScheduleGoalTemplateIndicator_1.useCategoryScheduleGoalTemplateIndicator)({
        category: category,
        month: month,
    }), schedule = _b.schedule, scheduleStatus = _b.scheduleStatus, isScheduleRecurring = _b.isScheduleRecurring;
    return (<CellValue_1.CellValue binding={binding} type="financial" aria-label={t('Spent amount for {{categoryName}} category', {
            categoryName: category.name,
        })}>
      {function (_a) {
            var type = _a.type, value = _a.value;
            return (<>
          <button_1.Button variant="bare" style={__assign({}, BudgetTable_1.PILL_STYLE)} onPress={onPress} aria-label={t('Show transactions for {{categoryName}} category', {
                    categoryName: category.name,
                })}>
            <PrivacyFilter_1.PrivacyFilter>
              <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={__assign(__assign({}, (0, util_1.makeAmountGrey)(value)), { maxWidth: columnWidth, textAlign: 'right', fontSize: 12 })}>
                {format(value, type)}
              </auto_text_size_1.AutoTextSize>
            </PrivacyFilter_1.PrivacyFilter>
          </button_1.Button>
          {schedule && scheduleStatus && (<view_1.View style={{
                        position: 'absolute',
                        right: '-3px',
                        top: '-5px',
                        borderRadius: '50%',
                        color: scheduleStatus === 'missed'
                            ? theme_1.theme.errorText
                            : scheduleStatus === 'due'
                                ? theme_1.theme.warningText
                                : theme_1.theme.upcomingText,
                    }}>
              {isScheduleRecurring ? (<v2_1.SvgArrowsSynchronize width={11} height={11}/>) : (<v2_1.SvgCalendar3 width={10} height={10}/>)}
            </view_1.View>)}
        </>);
        }}
    </CellValue_1.CellValue>);
}
