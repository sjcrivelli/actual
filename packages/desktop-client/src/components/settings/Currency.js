"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencySettings = CurrencySettings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var currencies_1 = require("loot-core/shared/currencies");
var UI_1 = require("./UI");
var forms_1 = require("@desktop-client/components/forms");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function CurrencySettings() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var currencyTranslations = (0, react_1.useMemo)(function () {
        return new Map([
            ['', t('None')],
            ['AED', t('UAE Dirham')],
            ['ARS', t('Argentinian Peso')],
            ['AUD', t('Australian Dollar')],
            ['BRL', t('Brazilian Real')],
            ['CAD', t('Canadian Dollar')],
            ['CHF', t('Swiss Franc')],
            ['CNY', t('Yuan Renminbi')],
            ['CRC', t('Costa Rican Colón')],
            ['EGP', t('Egyptian Pound')],
            ['EUR', t('Euro')],
            ['GBP', t('Pound Sterling')],
            ['HKD', t('Hong Kong Dollar')],
            ['INR', t('Indian Rupee')],
            ['JMD', t('Jamaican Dollar')],
            // ['JPY', t('Japanese Yen')],
            ['LKR', t('Sri Lankan Rupee')],
            ['MDL', t('Moldovan Leu')],
            ['PHP', t('Philippine Peso')],
            ['PLN', t('Polish Złoty')],
            ['QAR', t('Qatari Riyal')],
            ['RON', t('Romanian Leu')],
            ['RSD', t('Serbian Dinar')],
            ['RUB', t('Russian Ruble')],
            ['SAR', t('Saudi Riyal')],
            ['SEK', t('Swedish Krona')],
            ['SGD', t('Singapore Dollar')],
            ['THB', t('Thai Baht')],
            ['TRY', t('Turkish Lira')],
            ['UAH', t('Ukrainian Hryvnia')],
            ['USD', t('US Dollar')],
            ['UZS', t('Uzbek Soum')],
        ]);
    }, [t]);
    var _a = (0, useSyncedPref_1.useSyncedPref)('defaultCurrencyCode'), defaultCurrencyCode = _a[0], setDefaultCurrencyCodePref = _a[1];
    var selectedCurrencyCode = defaultCurrencyCode || '';
    var _b = (0, useSyncedPref_1.useSyncedPref)('currencySymbolPosition'), symbolPosition = _b[0], setSymbolPositionPref = _b[1];
    var _c = (0, useSyncedPref_1.useSyncedPref)('currencySpaceBetweenAmountAndSymbol'), spaceEnabled = _c[0], setSpaceEnabledPref = _c[1];
    var _d = (0, useSyncedPref_1.useSyncedPref)('numberFormat'), setNumberFormatPref = _d[1];
    var _e = (0, useSyncedPref_1.useSyncedPref)('hideFraction'), setHideFractionPref = _e[1];
    var selectButtonClassName = (0, css_1.css)({
        '&[data-hovered]': {
            backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
        },
    });
    var currencyOptions = currencies_1.currencies.map(function (currency) {
        var _a;
        var translatedName = (_a = currencyTranslations.get(currency.code)) !== null && _a !== void 0 ? _a : currency.name;
        if (currency.code === '') {
            return [currency.code, translatedName];
        }
        return [
            currency.code,
            "".concat(currency.code, " - ").concat(translatedName, " (").concat(currency.symbol, ")"),
        ];
    });
    var handleCurrencyChange = function (code) {
        setDefaultCurrencyCodePref(code);
        if (code !== '') {
            var cur = (0, currencies_1.getCurrency)(code);
            setNumberFormatPref(cur.numberFormat);
            setHideFractionPref(cur.decimalPlaces === 0 ? 'true' : 'false');
            setSpaceEnabledPref(cur.symbolFirst ? 'false' : 'true');
            setSymbolPositionPref(cur.symbolFirst ? 'before' : 'after');
        }
    };
    var symbolPositionOptions = (0, react_1.useMemo)(function () {
        var selectedCurrency = (0, currencies_1.getCurrency)(selectedCurrencyCode);
        var symbol = selectedCurrency.symbol || '$';
        var space = spaceEnabled === 'true' ? ' ' : '';
        return [
            {
                value: 'before',
                label: "".concat(t('Before amount'), " (").concat(t('e.g.'), " ").concat(symbol).concat(space, "100)"),
            },
            {
                value: 'after',
                label: "".concat(t('After amount'), " (").concat(t('e.g.'), " 100").concat(space).concat(symbol, ")"),
            },
        ];
    }, [selectedCurrencyCode, spaceEnabled, t]);
    return (<UI_1.Setting primaryAction={<view_1.View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5em',
                width: '100%',
            }}>
          <view_1.View style={{ display: 'flex', flexDirection: 'row', gap: '1.5em' }}>
            <UI_1.Column title={t('Default Currency')}>
              <select_1.Select value={selectedCurrencyCode} onChange={handleCurrencyChange} options={currencyOptions} className={selectButtonClassName} style={{ width: '100%' }}/>
            </UI_1.Column>

            <UI_1.Column title={t('Symbol Position')} style={{
                visibility: selectedCurrencyCode === '' ? 'hidden' : 'visible',
            }}>
              <select_1.Select value={symbolPosition || 'before'} onChange={function (value) { return setSymbolPositionPref(value); }} options={symbolPositionOptions.map(function (f) { return [f.value, f.label]; })} className={selectButtonClassName} style={{ width: '100%' }} disabled={selectedCurrencyCode === ''}/>
            </UI_1.Column>
          </view_1.View>

          {selectedCurrencyCode !== '' && (<view_1.View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}>
              <forms_1.Checkbox id="settings-spaceEnabled" checked={spaceEnabled === 'true'} onChange={function (e) {
                    return setSpaceEnabledPref(e.target.checked ? 'true' : 'false');
                }}/>
              <label htmlFor="settings-spaceEnabled" style={{ marginLeft: '0.5em' }}>
                <react_i18next_1.Trans>Add space between amount and symbol</react_i18next_1.Trans>
              </label>
            </view_1.View>)}
        </view_1.View>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Currency settings</strong> affect how amounts are displayed
          throughout the application. Changing the currency will affect the
          number format, symbol position, and whether fractions are shown. These
          can be adjusted after the currency is set.
        </react_i18next_1.Trans>
      </text_1.Text>
    </UI_1.Setting>);
}
