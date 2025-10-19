import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { Select } from '@actual-app/components/select';
import { Text } from '@actual-app/components/text';
import { Setting } from './UI';
import { Link } from '@desktop-client/components/common/Link';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { availableLanguages, setI18NextLanguage } from '@desktop-client/i18n';
const languageDisplayNameOverride = {
    'pt-BR': 'Português (Brasil)',
};
const languageOptions = (t) => [
    ['', t('System default')],
    Menu.line,
].concat(availableLanguages.map(lang => [
    lang,
    lang in languageDisplayNameOverride
        ? languageDisplayNameOverride[lang]
        : new Intl.DisplayNames([lang], {
            type: 'language',
        }).of(lang) || lang,
]));
export function LanguageSettings() {
    const { t } = useTranslation();
    const [language, setLanguage] = useGlobalPref('language');
    const isEnabled = !!availableLanguages.length;
    return (_jsx(Setting, { primaryAction: _jsx(Select, { "aria-label": t('Select language'), options: languageOptions(t), value: isEnabled ? (language ?? '') : 'not-available', defaultLabel: isEnabled ? t('Select language') : t('No languages available'), onChange: value => {
                setLanguage(value);
                setI18NextLanguage(value);
            }, disabled: !isEnabled }), children: _jsx(Text, { children: isEnabled ? (_jsxs(Trans, { children: [_jsx("strong", { children: "Language" }), " is the display language of all text. Please note that no warranty is provided for the accuracy or completeness of non-English translations. If you encounter a translation error, feel free to make a suggestion on", ' ', _jsx(Link, { variant: "external", to: 'https://hosted.weblate.org/projects/actualbudget/actual/' +
                            (language ?? ''), linkColor: "purple", children: "Weblate" }), "."] })) : (_jsxs(Trans, { children: [_jsx("strong", { children: "Language" }), " support is not available. Please follow the instructions", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/install/build-from-source#translations", children: "here" }), ' ', "to add missing translation files."] })) }) }));
}
