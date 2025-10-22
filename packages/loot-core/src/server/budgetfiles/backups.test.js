"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var dateFns = require("date-fns");
var backups_1 = require("./backups");
describe('Backups', function () {
    test('backups work', function () { return __awaiter(void 0, void 0, void 0, function () {
        function getUpdatedBackups(backups) {
            return __awaiter(this, void 0, void 0, function () {
                var toRemove;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, backups_1.updateBackups)(backups)];
                        case 1:
                            toRemove = _a.sent();
                            return [2 /*return*/, backups.filter(function (b) { return !toRemove.includes(b.id); })];
                    }
                });
            });
        }
        function cleanDates(backups) {
            return backups.map(function (backup) { return ({
                id: backup.id,
                date: dateFns.format(backup.date, 'yyyy-MM-dd'),
            }); });
        }
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    // Should keep 3 backups on the current day
                    _a = expect;
                    _b = cleanDates;
                    return [4 /*yield*/, getUpdatedBackups([
                            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup3', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup4', date: dateFns.parseISO('2017-01-01') },
                        ])];
                case 1:
                    // Should keep 3 backups on the current day
                    _a.apply(void 0, [_b.apply(void 0, [_j.sent()])]).toMatchSnapshot();
                    // Should not delete any since up to 3 are allowed on the current
                    // day
                    _c = expect;
                    _d = cleanDates;
                    return [4 /*yield*/, getUpdatedBackups([
                            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup3', date: dateFns.parseISO('2016-12-30') },
                            { id: 'backup4', date: dateFns.parseISO('2016-12-29') },
                        ])];
                case 2:
                    // Should not delete any since up to 3 are allowed on the current
                    // day
                    _c.apply(void 0, [_d.apply(void 0, [_j.sent()])]).toMatchSnapshot();
                    // Should delete any additional backups on other days (keep the
                    // two on the current day but delete copies on other days)
                    _e = expect;
                    _f = cleanDates;
                    return [4 /*yield*/, getUpdatedBackups([
                            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup3', date: dateFns.parseISO('2016-12-29') },
                            { id: 'backup4', date: dateFns.parseISO('2016-12-29') },
                            { id: 'backup5', date: dateFns.parseISO('2016-12-29') },
                        ])];
                case 3:
                    // Should delete any additional backups on other days (keep the
                    // two on the current day but delete copies on other days)
                    _e.apply(void 0, [_f.apply(void 0, [_j.sent()])]).toMatchSnapshot();
                    // Should only keep up to 10 backups
                    _g = expect;
                    _h = cleanDates;
                    return [4 /*yield*/, getUpdatedBackups([
                            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
                            { id: 'backup3', date: dateFns.parseISO('2016-12-29') },
                            { id: 'backup4', date: dateFns.parseISO('2016-12-28') },
                            { id: 'backup5', date: dateFns.parseISO('2016-12-27') },
                            { id: 'backup6', date: dateFns.parseISO('2016-12-26') },
                            { id: 'backup7', date: dateFns.parseISO('2016-12-25') },
                            { id: 'backup8', date: dateFns.parseISO('2016-12-24') },
                            { id: 'backup9', date: dateFns.parseISO('2016-12-23') },
                            { id: 'backup10', date: dateFns.parseISO('2016-12-22') },
                            { id: 'backup11', date: dateFns.parseISO('2016-12-21') },
                            { id: 'backup12', date: dateFns.parseISO('2016-12-20') },
                        ])];
                case 4:
                    // Should only keep up to 10 backups
                    _g.apply(void 0, [_h.apply(void 0, [_j.sent()])]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
