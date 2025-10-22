"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocale = useLocale;
var react_1 = require("react");
var locale_1 = require("loot-core/shared/locale");
var useGlobalPref_1 = require("./useGlobalPref");
function useLocale() {
    var language = (0, useGlobalPref_1.useGlobalPref)('language')[0];
    var locale = (0, react_1.useMemo)(function () { var _a; return (0, locale_1.getLocale)(language ? language : ((_a = navigator.language) !== null && _a !== void 0 ? _a : 'en-US')); }, [language]);
    return locale;
}
