"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSettings = LanguageSettings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var select_1 = require("@actual-app/components/select");
var text_1 = require("@actual-app/components/text");
var UI_1 = require("./UI");
var Link_1 = require("@desktop-client/components/common/Link");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var i18n_1 = require("@desktop-client/i18n");
var languageDisplayNameOverride = {
    'pt-BR': 'Português (Brasil)',
};
var languageOptions = function (t) {
    return [
        ['', t('System default')],
        menu_1.Menu.line,
    ].concat(i18n_1.availableLanguages.map(function (lang) { return [
        lang,
        lang in languageDisplayNameOverride
            ? languageDisplayNameOverride[lang]
            : new Intl.DisplayNames([lang], {
                type: 'language',
            }).of(lang) || lang,
    ]; }));
};
function LanguageSettings() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, useGlobalPref_1.useGlobalPref)('language'), language = _a[0], setLanguage = _a[1];
    var isEnabled = !!i18n_1.availableLanguages.length;
    return (<UI_1.Setting primaryAction={<select_1.Select aria-label={t('Select language')} options={languageOptions(t)} value={isEnabled ? (language !== null && language !== void 0 ? language : '') : 'not-available'} defaultLabel={isEnabled ? t('Select language') : t('No languages available')} onChange={function (value) {
                setLanguage(value);
                (0, i18n_1.setI18NextLanguage)(value);
            }} disabled={!isEnabled}/>}>
      <text_1.Text>
        {isEnabled ? (<react_i18next_1.Trans>
            <strong>Language</strong> is the display language of all text.
            Please note that no warranty is provided for the accuracy or
            completeness of non-English translations. If you encounter a
            translation error, feel free to make a suggestion on{' '}
            <Link_1.Link variant="external" to={'https://hosted.weblate.org/projects/actualbudget/actual/' +
                (language !== null && language !== void 0 ? language : '')} linkColor="purple">
              Weblate
            </Link_1.Link>
            .
          </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
            <strong>Language</strong> support is not available. Please follow
            the instructions{' '}
            <Link_1.Link variant="external" to="https://actualbudget.org/docs/install/build-from-source#translations">
              here
            </Link_1.Link>{' '}
            to add missing translation files.
          </react_i18next_1.Trans>)}
      </text_1.Text>
    </UI_1.Setting>);
}
