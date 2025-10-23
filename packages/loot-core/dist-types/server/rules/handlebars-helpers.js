"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlebarsHelpers = registerHandlebarsHelpers;
const date_fns_1 = require("date-fns");
const Handlebars = __importStar(require("handlebars"));
const log_1 = require("../../platform/server/log");
const months_1 = require("../../shared/months");
function registerHandlebarsHelpers() {
    const regexTest = /^\/(.*)\/([gimuy]*)$/;
    function mathHelper(fn) {
        return (a, ...b) => {
            return b.map(Number).reduce(fn, Number(a));
        };
    }
    function regexHelper(mapRegex, mapNonRegex, apply) {
        return (value, regex, replace) => {
            if (value == null) {
                return null;
            }
            if (typeof regex !== 'string' || typeof replace !== 'string') {
                return '';
            }
            let regexp;
            const match = regexTest.exec(regex);
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
    const helpers = {
        regex: regexHelper((regex, flags) => new RegExp(regex, flags), value => new RegExp(value), (value, regex, replace) => value.replace(regex, replace)),
        replace: regexHelper((regex, flags) => new RegExp(regex, flags), value => value, (value, regex, replace) => value.replace(regex, replace)),
        replaceAll: regexHelper((regex, flags) => new RegExp(regex, flags), value => value, (value, regex, replace) => value.replaceAll(regex, replace)),
        add: mathHelper((a, b) => a + b),
        sub: mathHelper((a, b) => a - b),
        div: mathHelper((a, b) => a / b),
        mul: mathHelper((a, b) => a * b),
        mod: mathHelper((a, b) => a % b),
        floor: (a) => Math.floor(Number(a)),
        ceil: (a) => Math.ceil(Number(a)),
        round: (a) => Math.round(Number(a)),
        abs: (a) => Math.abs(Number(a)),
        min: mathHelper((a, b) => Math.min(a, b)),
        max: mathHelper((a, b) => Math.max(a, b)),
        fixed: (a, digits) => Number(a).toFixed(Number(digits)),
        day: (date) => date && (0, months_1.format)(date, 'd'),
        month: (date) => date && (0, months_1.format)(date, 'M'),
        year: (date) => date && (0, months_1.format)(date, 'yyyy'),
        format: (date, f) => date && f && (0, months_1.format)(date, f),
        addDays: (date, days) => {
            if (!date || !days)
                return date;
            return (0, months_1.format)((0, months_1.addDays)(date, days), 'yyyy-MM-dd');
        },
        subDays: (date, days) => {
            if (!date || !days)
                return date;
            return (0, months_1.format)((0, months_1.subDays)(date, days), 'yyyy-MM-dd');
        },
        addMonths: (date, months) => {
            if (!date || !months)
                return date;
            return (0, months_1.format)((0, date_fns_1.addMonths)((0, months_1.parseDate)(date), months), 'yyyy-MM-dd');
        },
        subMonths: (date, months) => {
            if (!date || !months)
                return date;
            return (0, months_1.format)((0, date_fns_1.subMonths)((0, months_1.parseDate)(date), months), 'yyyy-MM-dd');
        },
        addWeeks: (date, weeks) => {
            if (!date || !weeks)
                return date;
            return (0, months_1.format)((0, date_fns_1.addWeeks)((0, months_1.parseDate)(date), weeks), 'yyyy-MM-dd');
        },
        subWeeks: (date, weeks) => {
            if (!date || !weeks)
                return date;
            return (0, months_1.format)((0, date_fns_1.subWeeks)((0, months_1.parseDate)(date), weeks), 'yyyy-MM-dd');
        },
        addYears: (date, years) => {
            if (!date || !years)
                return date;
            return (0, months_1.format)((0, date_fns_1.addYears)((0, months_1.parseDate)(date), years), 'yyyy-MM-dd');
        },
        subYears: (date, years) => {
            if (!date || !years)
                return date;
            return (0, months_1.format)((0, date_fns_1.subYears)((0, months_1.parseDate)(date), years), 'yyyy-MM-dd');
        },
        setDay: (date, day) => {
            if (!date || day == null)
                return date;
            const actualDay = Number((0, months_1.format)(date, 'd'));
            return (0, months_1.format)((0, months_1.addDays)(date, day - actualDay), 'yyyy-MM-dd');
        },
        debug: (value) => {
            log_1.logger.log(value);
        },
        concat: (...args) => args.join(''),
    };
    for (const [name, fn] of Object.entries(helpers)) {
        Handlebars.registerHelper(name, (...args) => {
            //The last argument is the Handlebars options object
            return fn(...args.slice(0, -1));
        });
    }
}
//# sourceMappingURL=handlebars-helpers.js.map