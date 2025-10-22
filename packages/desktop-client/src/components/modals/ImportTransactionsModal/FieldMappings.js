"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMappings = FieldMappings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var stack_1 = require("@actual-app/components/stack");
var view_1 = require("@actual-app/components/view");
var SelectField_1 = require("./SelectField");
var SubLabel_1 = require("./SubLabel");
var utils_1 = require("./utils");
var forms_1 = require("@desktop-client/components/forms");
function FieldMappings(_a) {
    var transactions = _a.transactions, _b = _a.mappings, mappings = _b === void 0 ? {
        date: null,
        amount: null,
        payee: null,
        notes: null,
        inOut: null,
        category: null,
        outflow: null,
        inflow: null,
    } : _b, onChange = _a.onChange, splitMode = _a.splitMode, inOutMode = _a.inOutMode, hasHeaderRow = _a.hasHeaderRow;
    var t = (0, react_i18next_1.useTranslation)().t;
    if (transactions.length === 0) {
        return null;
    }
    var trans = (0, utils_1.stripCsvImportTransaction)(transactions[0]);
    var options = Object.keys(trans);
    return (<view_1.View>
      <forms_1.SectionLabel title={t('CSV FIELDS')}/>
      <stack_1.Stack direction="row" align="flex-start" spacing={1} style={{ marginTop: 5 }}>
        <view_1.View style={{ flex: 1, marginRight: 10 }}>
          <SubLabel_1.SubLabel title={t('Date')}/>
          <SelectField_1.SelectField options={options} value={mappings.date} onChange={function (name) { return onChange('date', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
        </view_1.View>
        <view_1.View style={{ flex: 1, marginRight: 10 }}>
          <SubLabel_1.SubLabel title={t('Payee')}/>
          <SelectField_1.SelectField options={options} value={mappings.payee} onChange={function (name) { return onChange('payee', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
        </view_1.View>
        <view_1.View style={{ flex: 1, marginRight: 10 }}>
          <SubLabel_1.SubLabel title={t('Notes')}/>
          <SelectField_1.SelectField options={options} value={mappings.notes} onChange={function (name) { return onChange('notes', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
        </view_1.View>
        <view_1.View style={{ flex: 1, marginRight: 10 }}>
          <SubLabel_1.SubLabel title={t('Category')}/>
          <SelectField_1.SelectField options={options} value={mappings.category} onChange={function (name) { return onChange('category', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
        </view_1.View>
        {splitMode && !inOutMode ? (<>
            <view_1.View style={{ flex: 0.5 }}>
              <SubLabel_1.SubLabel title={t('Outflow')}/>
              <SelectField_1.SelectField options={options} value={mappings.outflow} onChange={function (name) { return onChange('outflow', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
            </view_1.View>
            <view_1.View style={{ flex: 0.5 }}>
              <SubLabel_1.SubLabel title={t('Inflow')}/>
              <SelectField_1.SelectField options={options} value={mappings.inflow} onChange={function (name) { return onChange('inflow', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
            </view_1.View>
          </>) : (<>
            {inOutMode && (<view_1.View style={{ flex: 1 }}>
                <SubLabel_1.SubLabel title={t('In/Out')}/>
                <SelectField_1.SelectField options={options} value={mappings.inOut} onChange={function (name) { return onChange('inOut', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
              </view_1.View>)}
            <view_1.View style={{ flex: 1 }}>
              <SubLabel_1.SubLabel title={t('Amount')}/>
              <SelectField_1.SelectField options={options} value={mappings.amount} onChange={function (name) { return onChange('amount', name); }} hasHeaderRow={hasHeaderRow} firstTransaction={transactions[0]}/>
            </view_1.View>
          </>)}
      </stack_1.Stack>
    </view_1.View>);
}
