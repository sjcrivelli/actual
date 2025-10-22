"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocale = getLocale;
var locales = require("date-fns/locale");
function getLocale(language) {
    if (!language || typeof language !== 'string') {
        return locales.enUS;
    }
    var localeKey = language.replace('-', '');
    if (localeKey in locales) {
        return locales[localeKey];
    }
    //if language was not found with four letters, try with two
    localeKey = language.replace('-', '').substring(0, 2);
    if (localeKey in locales) {
        return locales[localeKey];
    }
    return locales.enUS;
}
