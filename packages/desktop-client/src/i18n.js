"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setI18NextLanguage = exports.availableLanguages = void 0;
var react_i18next_1 = require("react-i18next");
var i18next_1 = require("i18next");
var i18next_resources_to_backend_1 = require("i18next-resources-to-backend");
var Platform = require("loot-core/shared/platform");
var languages = import.meta.glob(['/locale/*.json', '!/locale/*_old.json']);
exports.availableLanguages = Object.keys(languages).map(function (path) { return path.split('/')[2].split('.')[0]; });
var isLanguageAvailable = function (language) {
    return Object.hasOwn(languages, "/locale/".concat(language, ".json"));
};
var loadLanguage = function (language) {
    if (!isLanguageAvailable(language)) {
        throw new Error("Unknown locale ".concat(language));
    }
    return languages["/locale/".concat(language, ".json")]();
};
i18next_1.default
    .use(react_i18next_1.initReactI18next)
    .use((0, i18next_resources_to_backend_1.default)(loadLanguage))
    .init({
    lng: 'en',
    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,
    // do not load a fallback
    fallbackLng: false,
    interpolation: {
        escapeValue: false,
    },
    react: {
        transSupportBasicHtmlNodes: false,
    },
});
var setI18NextLanguage = function (language) {
    if (!language) {
        // System default
        (0, exports.setI18NextLanguage)(Platform.isPlaywright ? 'cimode' : navigator.language || 'en');
        return;
    }
    if (!isLanguageAvailable(language)) {
        if (language === 'en') {
            // English is always available since we use natural-language keys.
            return;
        }
        if (language.includes('-')) {
            var fallback = language.split('-')[0];
            console.info("Unknown locale ".concat(language, ", falling back to ").concat(fallback));
            (0, exports.setI18NextLanguage)(fallback);
            return;
        }
        var lowercaseLanguage = language.toLowerCase();
        if (lowercaseLanguage !== language) {
            console.info("Unknown locale ".concat(language, ", falling back to ").concat(lowercaseLanguage));
            (0, exports.setI18NextLanguage)(lowercaseLanguage);
            return;
        }
        // Fall back to English
        console.info("Unknown locale ".concat(language, ", falling back to en"));
        (0, exports.setI18NextLanguage)('en');
        return;
    }
    if (language === i18next_1.default.language) {
        return; // language is already set
    }
    i18next_1.default.changeLanguage(language || 'en');
};
exports.setI18NextLanguage = setI18NextLanguage;
