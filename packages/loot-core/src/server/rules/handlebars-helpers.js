"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlebarsHelpers = registerHandlebarsHelpers;
var date_fns_1 = require("date-fns");
var Handlebars = require("handlebars");
var log_1 = require("../../platform/server/log");
var months_1 = require("../../shared/months");
function registerHandlebarsHelpers() {
    var regexTest = /^\/(.*)\/([gimuy]*)$/;
    function mathHelper(fn) {
        return function (a) {
            var b = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                b[_i - 1] = arguments[_i];
            }
            return b.map(Number).reduce(fn, Number(a));
        };
    }
    function regexHelper(mapRegex, mapNonRegex, apply) {
        return function (value, regex, replace) {
            if (value == null) {
                return null;
            }
            if (typeof regex !== 'string' || typeof replace !== 'string') {
                return '';
            }
            var regexp;
            var match = regexTest.exec(regex);
            // Regex is in format /regex/flags
            if (match) {
                regexp = mapRegex(match[1], match[2]);
            }
            else {
                regexp = mapNonRegex(regex);
            }
            return apply(String(value), regexp, replace);
        };
    }
    var helpers = {
        regex: regexHelper(function (regex, flags) { return new RegExp(regex, flags); }, function (value) { return new RegExp(value); }, function (value, regex, replace) { return value.replace(regex, replace); }),
        replace: regexHelper(function (regex, flags) { return new RegExp(regex, flags); }, function (value) { return value; }, function (value, regex, replace) { return value.replace(regex, replace); }),
        replaceAll: regexHelper(function (regex, flags) { return new RegExp(regex, flags); }, function (value) { return value; }, function (value, regex, replace) { return value.replaceAll(regex, replace); }),
        add: mathHelper(function (a, b) { return a + b; }),
        sub: mathHelper(function (a, b) { return a - b; }),
        div: mathHelper(function (a, b) { return a / b; }),
        mul: mathHelper(function (a, b) { return a * b; }),
        mod: mathHelper(function (a, b) { return a % b; }),
        floor: function (a) { return Math.floor(Number(a)); },
        ceil: function (a) { return Math.ceil(Number(a)); },
        round: function (a) { return Math.round(Number(a)); },
        abs: function (a) { return Math.abs(Number(a)); },
        min: mathHelper(function (a, b) { return Math.min(a, b); }),
        max: mathHelper(function (a, b) { return Math.max(a, b); }),
        fixed: function (a, digits) { return Number(a).toFixed(Number(digits)); },
        day: function (date) { return date && (0, months_1.format)(date, 'd'); },
        month: function (date) { return date && (0, months_1.format)(date, 'M'); },
        year: function (date) { return date && (0, months_1.format)(date, 'yyyy'); },
        format: function (date, f) { return date && f && (0, months_1.format)(date, f); },
        addDays: function (date, days) {
            if (!date || !days)
                return date;
            return (0, months_1.format)((0, months_1.addDays)(date, days), 'yyyy-MM-dd');
        },
        subDays: function (date, days) {
            if (!date || !days)
                return date;
            return (0, months_1.format)((0, months_1.subDays)(date, days), 'yyyy-MM-dd');
        },
        addMonths: function (date, months) {
            if (!date || !months)
                return date;
            return (0, months_1.format)((0, date_fns_1.addMonths)((0, months_1.parseDate)(date), months), 'yyyy-MM-dd');
        },
        subMonths: function (date, months) {
            if (!date || !months)
                return date;
            return (0, months_1.format)((0, date_fns_1.subMonths)((0, months_1.parseDate)(date), months), 'yyyy-MM-dd');
        },
        addWeeks: function (date, weeks) {
            if (!date || !weeks)
                return date;
            return (0, months_1.format)((0, date_fns_1.addWeeks)((0, months_1.parseDate)(date), weeks), 'yyyy-MM-dd');
        },
        subWeeks: function (date, weeks) {
            if (!date || !weeks)
                return date;
            return (0, months_1.format)((0, date_fns_1.subWeeks)((0, months_1.parseDate)(date), weeks), 'yyyy-MM-dd');
        },
        addYears: function (date, years) {
            if (!date || !years)
                return date;
            return (0, months_1.format)((0, date_fns_1.addYears)((0, months_1.parseDate)(date), years), 'yyyy-MM-dd');
        },
        subYears: function (date, years) {
            if (!date || !years)
                return date;
            return (0, months_1.format)((0, date_fns_1.subYears)((0, months_1.parseDate)(date), years), 'yyyy-MM-dd');
        },
        setDay: function (date, day) {
            if (!date || day == null)
                return date;
            var actualDay = Number((0, months_1.format)(date, 'd'));
            return (0, months_1.format)((0, months_1.addDays)(date, day - actualDay), 'yyyy-MM-dd');
        },
        debug: function (value) {
            log_1.logger.log(value);
        },
        concat: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.join('');
        },
    };
    var _loop_1 = function (name_1, fn) {
        Handlebars.registerHelper(name_1, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            //The last argument is the Handlebars options object
            return fn.apply(void 0, args.slice(0, -1));
        });
    };
    for (var _i = 0, _a = Object.entries(helpers); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], fn = _b[1];
        _loop_1(name_1, fn);
    }
}
