import { addMonths, addWeeks, addYears, subMonths, subWeeks, subYears, } from 'date-fns';
import * as Handlebars from 'handlebars';
import { logger } from '../../platform/server/log';
import { addDays, subDays, parseDate, format } from '../../shared/months';
export function registerHandlebarsHelpers() {
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
        day: (date) => date && format(date, 'd'),
        month: (date) => date && format(date, 'M'),
        year: (date) => date && format(date, 'yyyy'),
        format: (date, f) => date && f && format(date, f),
        addDays: (date, days) => {
            if (!date || !days)
                return date;
            return format(addDays(date, days), 'yyyy-MM-dd');
        },
        subDays: (date, days) => {
            if (!date || !days)
                return date;
            return format(subDays(date, days), 'yyyy-MM-dd');
        },
        addMonths: (date, months) => {
            if (!date || !months)
                return date;
            return format(addMonths(parseDate(date), months), 'yyyy-MM-dd');
        },
        subMonths: (date, months) => {
            if (!date || !months)
                return date;
            return format(subMonths(parseDate(date), months), 'yyyy-MM-dd');
        },
        addWeeks: (date, weeks) => {
            if (!date || !weeks)
                return date;
            return format(addWeeks(parseDate(date), weeks), 'yyyy-MM-dd');
        },
        subWeeks: (date, weeks) => {
            if (!date || !weeks)
                return date;
            return format(subWeeks(parseDate(date), weeks), 'yyyy-MM-dd');
        },
        addYears: (date, years) => {
            if (!date || !years)
                return date;
            return format(addYears(parseDate(date), years), 'yyyy-MM-dd');
        },
        subYears: (date, years) => {
            if (!date || !years)
                return date;
            return format(subYears(parseDate(date), years), 'yyyy-MM-dd');
        },
        setDay: (date, day) => {
            if (!date || day == null)
                return date;
            const actualDay = Number(format(date, 'd'));
            return format(addDays(date, day - actualDay), 'yyyy-MM-dd');
        },
        debug: (value) => {
            logger.log(value);
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
