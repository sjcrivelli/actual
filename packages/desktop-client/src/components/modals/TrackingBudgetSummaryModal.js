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
exports.TrackingBudgetSummaryModal = TrackingBudgetSummaryModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var months_1 = require("loot-core/shared/months");
var monthUtils = require("loot-core/shared/months");
var ExpenseTotal_1 = require("@desktop-client/components/budget/tracking/budgetsummary/ExpenseTotal");
var IncomeTotal_1 = require("@desktop-client/components/budget/tracking/budgetsummary/IncomeTotal");
var Saved_1 = require("@desktop-client/components/budget/tracking/budgetsummary/Saved");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
function TrackingBudgetSummaryModal(_a) {
    var month = _a.month;
    var t = (0, react_i18next_1.useTranslation)().t;
    var currentMonth = monthUtils.currentMonth();
    return (<Modal_1.Modal name="tracking-budget-summary">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Budget Summary')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <useSheetName_1.SheetNameProvider name={(0, months_1.sheetForMonth)(month)}>
            <stack_1.Stack spacing={2} style={{
                    alignSelf: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                }}>
              <IncomeTotal_1.IncomeTotal style={__assign({}, styles_1.styles.mediumText)}/>
              <ExpenseTotal_1.ExpenseTotal style={__assign({}, styles_1.styles.mediumText)}/>
            </stack_1.Stack>
            <Saved_1.Saved projected={month >= currentMonth} style={__assign(__assign({}, styles_1.styles.mediumText), { marginTop: 20 })}/>
          </useSheetName_1.SheetNameProvider>
        </>);
        }}
    </Modal_1.Modal>);
}
