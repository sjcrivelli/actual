"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMapping = FieldMapping;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var select_1 = require("@actual-app/components/select");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var table_1 = require("@desktop-client/components/table");
var useTransactionDirectionOptions = function () {
    var t = (0, react_i18next_1.useTranslation)().t;
    var transactionDirectionOptions = [
        {
            value: 'payment',
            label: t('Payment'),
        },
        {
            value: 'deposit',
            label: t('Deposit'),
        },
    ];
    return { transactionDirectionOptions: transactionDirectionOptions };
};
function FieldMapping(_a) {
    var transactionDirection = _a.transactionDirection, setTransactionDirection = _a.setTransactionDirection, fields = _a.fields, mapping = _a.mapping, setMapping = _a.setMapping;
    var t = (0, react_i18next_1.useTranslation)().t;
    var transactionDirectionOptions = useTransactionDirectionOptions().transactionDirectionOptions;
    return (<>
      <select_1.Select aria-label={t('Transaction direction')} options={transactionDirectionOptions.map(function (x) { return [x.value, x.label]; })} value={transactionDirection} onChange={function (newValue) {
            return setTransactionDirection(newValue);
        }} style={{
            width: '25%',
            margin: '1em 0',
        }}/>

      {fields.length === 0 ? (<text_1.Text style={{ margin: '1em 0 .5em 0' }}>
          <react_i18next_1.Trans>
            No transactions found with mappable fields, accounts must have been
            synced at least once for this function to be available.
          </react_i18next_1.Trans>
        </text_1.Text>) : (<>
          <table_1.TableHeader>
            <table_1.Cell value={t('Actual field')} width={100} style={{ paddingLeft: '10px' }}/>
            <table_1.Cell value={t('Bank field')} width={330} style={{ paddingLeft: '10px' }}/>
            <table_1.Cell value={t('Example')} width="flex" style={{ paddingLeft: '10px' }}/>
          </table_1.TableHeader>

          {fields.map(function (field) {
                var _a;
                return (<table_1.Row key={field.actualField} style={{
                        fontSize: 13,
                        backgroundColor: theme_1.theme.tableRowBackgroundHover,
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-tableBorder)',
                        minHeight: '40px',
                    }} collapsed={true}>
                <table_1.Cell value={field.actualField} width={75} style={{ paddingLeft: '10px', height: '100%', border: 0 }}/>

                <text_1.Text>
                  <v0_1.SvgRightArrow2 style={{
                        width: 15,
                        height: 15,
                        color: theme_1.theme.tableText,
                        marginRight: '20px',
                    }}/>
                </text_1.Text>

                <select_1.Select aria-label={t('Synced field to map to {{field}}', {
                        field: field.actualField,
                    })} options={field.syncFields.map(function (_a) {
                    var field = _a.field;
                    return [field, field];
                })} value={mapping.get(field.actualField)} style={{
                        width: 290,
                    }} onChange={function (newValue) {
                        if (newValue)
                            setMapping(field.actualField, newValue);
                    }}/>

                <text_1.Text>
                  <v1_1.SvgEquals style={{
                        width: 12,
                        height: 12,
                        color: theme_1.theme.tableText,
                        marginLeft: '20px',
                    }}/>
                </text_1.Text>

                <table_1.Cell value={(_a = field.syncFields.find(function (f) { return f.field === mapping.get(field.actualField); })) === null || _a === void 0 ? void 0 : _a.example} width="flex" style={{ paddingLeft: '10px', height: '100%', border: 0 }}/>
              </table_1.Row>);
            })}
        </>)}
    </>);
}
