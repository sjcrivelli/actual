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
// @ts-strict-ignore
const dateFns = __importStar(require("date-fns"));
const backups_1 = require("./backups");
describe('Backups', () => {
    test('backups work', async () => {
        async function getUpdatedBackups(backups) {
            const toRemove = await (0, backups_1.updateBackups)(backups);
            return backups.filter(b => !toRemove.includes(b.id));
        }
        function cleanDates(backups) {
            return backups.map(backup => ({
                id: backup.id,
                date: dateFns.format(backup.date, 'yyyy-MM-dd'),
            }));
        }
        // Should keep 3 backups on the current day
        expect(cleanDates(await getUpdatedBackups([
            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup3', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup4', date: dateFns.parseISO('2017-01-01') },
        ]))).toMatchSnapshot();
        // Should not delete any since up to 3 are allowed on the current
        // day
        expect(cleanDates(await getUpdatedBackups([
            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup3', date: dateFns.parseISO('2016-12-30') },
            { id: 'backup4', date: dateFns.parseISO('2016-12-29') },
        ]))).toMatchSnapshot();
        // Should delete any additional backups on other days (keep the
        // two on the current day but delete copies on other days)
        expect(cleanDates(await getUpdatedBackups([
            { id: 'backup1', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup2', date: dateFns.parseISO('2017-01-01') },
            { id: 'backup3', date: dateFns.parseISO('2016-12-29') },
            { id: 'backup4', date: dateFns.parseISO('2016-12-29') },
            { id: 'backup5', date: dateFns.parseISO('2016-12-29') },
        ]))).toMatchSnapshot();
        // Should only keep up to 10 backups
        expect(cleanDates(await getUpdatedBackups([
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
        ]))).toMatchSnapshot();
    });
});
//# sourceMappingURL=backups.test.js.map