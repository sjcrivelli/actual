"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatSettings = FormatSettings;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var util_1 = require("loot-core/shared/util");
var UI_1 = require("./UI");
var forms_1 = require("@desktop-client/components/forms");
var SidebarProvider_1 = require("@desktop-client/components/sidebar/SidebarProvider");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
// Follows Pikaday 'firstDay' numbering
// https://github.com/Pikaday/Pikaday
function useDaysOfWeek() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var daysOfWeek = [
        { value: '0', label: t('Sunday') },
        { value: '1', label: t('Monday') },
        { value: '2', label: t('Tuesday') },
        { value: '3', label: t('Wednesday') },
        { value: '4', label: t('Thursday') },
        { value: '5', label: t('Friday') },
        { value: '6', label: t('Saturday') },
    ];
    return { daysOfWeek: daysOfWeek };
}
var dateFormats = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
    { value: 'MM.dd.yyyy', label: 'MM.DD.YYYY' },
    { value: 'dd.MM.yyyy', label: 'DD.MM.YYYY' },
    { value: 'dd-MM-yyyy', label: 'DD-MM-YYYY' },
];
function FormatSettings() {
    var _a;
    var t = (0, react_i18next_1.useTranslation)().t;
    var sidebar = (0, SidebarProvider_1.useSidebar)();
    var _b = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx'), _firstDayOfWeekIdx = _b[0], setFirstDayOfWeekIdxPref = _b[1]; // Sunday;
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var _c = (0, useSyncedPref_1.useSyncedPref)('dateFormat'), setDateFormatPref = _c[1];
    var _d = (0, useSyncedPref_1.useSyncedPref)('numberFormat'), _numberFormat = _d[0], setNumberFormatPref = _d[1];
    var numberFormat = _numberFormat || 'comma-dot';
    var _e = (0, useSyncedPref_1.useSyncedPref)('hideFraction'), hideFraction = _e[0], setHideFractionPref = _e[1];
    var daysOfWeek = useDaysOfWeek().daysOfWeek;
    var selectButtonClassName = (0, css_1.css)({
        '&[data-hovered]': {
            backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
        },
    });
    return (<UI_1.Setting primaryAction={<view_1.View style={_a = {
                    flexDirection: 'column',
                    gap: '1em',
                    width: '100%'
                },
                _a["@media (min-width: ".concat(sidebar.floating
                    ? tokens_1.tokens.breakpoint_small
                    : tokens_1.tokens.breakpoint_medium, ")")] = {
                    flexDirection: 'row',
                },
                _a}>
          <UI_1.Column title={t('Numbers')}>
            <select_1.Select key={String(hideFraction)} // needed because label does not update
         value={numberFormat} onChange={function (format) { return setNumberFormatPref(format); }} options={util_1.numberFormats.map(function (f) { return [
                f.value,
                String(hideFraction) === 'true' ? f.labelNoFraction : f.label,
            ]; })} className={selectButtonClassName}/>

            <text_1.Text style={{ display: 'flex' }}>
              <forms_1.Checkbox id="settings-textDecimal" checked={String(hideFraction) === 'true'} onChange={function (e) {
                return setHideFractionPref(String(e.currentTarget.checked));
            }}/>
              <label htmlFor="settings-textDecimal">
                <react_i18next_1.Trans>Hide decimal places</react_i18next_1.Trans>
              </label>
            </text_1.Text>
          </UI_1.Column>

          <UI_1.Column title={t('Dates')}>
            <select_1.Select value={dateFormat} onChange={function (format) { return setDateFormatPref(format); }} options={dateFormats.map(function (f) { return [f.value, f.label]; })} className={selectButtonClassName}/>
          </UI_1.Column>

          <UI_1.Column title={t('First day of the week')}>
            <select_1.Select value={firstDayOfWeekIdx} onChange={function (idx) { return setFirstDayOfWeekIdxPref(idx); }} options={daysOfWeek.map(function (f) { return [f.value, f.label]; })} className={selectButtonClassName}/>
          </UI_1.Column>
        </view_1.View>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Formatting</strong> does not affect how budget data is stored,
          and can be changed at any time.
        </react_i18next_1.Trans>
      </text_1.Text>
    </UI_1.Setting>);
}
