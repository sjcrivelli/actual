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
exports.EnvelopeBudgetSummaryModal = EnvelopeBudgetSummaryModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var months_1 = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var ToBudgetAmount_1 = require("@desktop-client/components/budget/envelope/budgetsummary/ToBudgetAmount");
var TotalsList_1 = require("@desktop-client/components/budget/envelope/budgetsummary/TotalsList");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function EnvelopeBudgetSummaryModal(_a) {
    var _b;
    var month = _a.month, onBudgetAction = _a.onBudgetAction;
    var t = (0, react_i18next_1.useTranslation)().t;
    var locale = (0, useLocale_1.useLocale)();
    var dispatch = (0, redux_1.useDispatch)();
    var prevMonthName = (0, months_1.format)((0, months_1.prevMonth)(month), 'MMM', locale);
    var sheetValue = (_b = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)({
        name: bindings_1.envelopeBudget.toBudget,
        value: 0,
    })) !== null && _b !== void 0 ? _b : 0;
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var categories = (0, useCategories_1.useCategories)().list;
    var categoriesById = (0, util_1.groupById)(categories);
    var openTransferAvailableModal = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'transfer',
                options: {
                    title: t('Transfer to category'),
                    month: month,
                    amount: sheetValue,
                    onSubmit: function (amount, toCategoryId) {
                        onBudgetAction(month, 'transfer-available', {
                            amount: amount,
                            month: month,
                            category: toCategoryId,
                        });
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'transfer' }));
                        showUndoNotification({
                            message: t('Transferred {{amount}} to {{categoryName}}', {
                                amount: (0, util_1.integerToCurrency)(amount),
                                categoryName: categoriesById[toCategoryId].name,
                            }),
                        });
                    },
                },
            },
        }));
    };
    var openCoverOverbudgetedModal = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'cover',
                options: {
                    title: t('Cover overbudgeted'),
                    month: month,
                    showToBeBudgeted: false,
                    onSubmit: function (categoryId) {
                        onBudgetAction(month, 'cover-overbudgeted', {
                            category: categoryId,
                        });
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'cover' }));
                        showUndoNotification({
                            message: t('Covered overbudgeted from {{categoryName}}', {
                                categoryName: categoriesById[categoryId].name,
                            }),
                        });
                    },
                },
            },
        }));
    };
    var onHoldBuffer = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'hold-buffer',
                options: {
                    month: month,
                    onSubmit: function (amount) {
                        onBudgetAction(month, 'hold', { amount: amount });
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: 'hold-buffer' }));
                    },
                },
            },
        }));
    };
    var onResetHoldBuffer = function () {
        onBudgetAction(month, 'reset-hold');
    };
    var onClick = function (_a) {
        var close = _a.close;
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'envelope-summary-to-budget-menu',
                options: {
                    month: month,
                    onTransfer: openTransferAvailableModal,
                    onCover: openCoverOverbudgetedModal,
                    onResetHoldBuffer: function () {
                        onResetHoldBuffer();
                        close();
                    },
                    onHoldBuffer: onHoldBuffer,
                    onBudgetAction: onBudgetAction,
                },
            },
        }));
    };
    return (<Modal_1.Modal name="envelope-budget-summary">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Budget Summary')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <useSheetName_1.SheetNameProvider name={(0, months_1.sheetForMonth)(month)}>
            <TotalsList_1.TotalsList prevMonthName={prevMonthName} style={__assign({}, styles_1.styles.mediumText)}/>
            <ToBudgetAmount_1.ToBudgetAmount prevMonthName={prevMonthName} style={__assign(__assign({}, styles_1.styles.mediumText), { marginTop: 15 })} amountStyle={__assign({}, styles_1.styles.underlinedText)} onClick={function () { return onClick({ close: close }); }} isTotalsListTooltipDisabled={true}/>
          </useSheetName_1.SheetNameProvider>
        </>);
        }}
    </Modal_1.Modal>);
}
