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
exports.SchedulesPage = void 0;
var SchedulesPage = /** @class */ (function () {
    function SchedulesPage(page) {
        this.page = page;
        this.addNewScheduleButton = this.page.getByRole('button', {
            name: 'Add new schedule',
        });
        this.schedulesTableRow = this.page.getByTestId('table').getByTestId('row');
    }
    /**
     * Add a new schedule
     */
    SchedulesPage.prototype.addNewSchedule = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addNewScheduleButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._fillScheduleFields(data)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page
                                .getByTestId('schedule-edit-modal')
                                .getByRole('button', { name: 'Add' })
                                .click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve the row element for the nth-schedule.
     * 0-based index
     */
    SchedulesPage.prototype.getNthScheduleRow = function (index) {
        return this.schedulesTableRow.nth(index);
    };
    /**
     * Retrieve the data for the nth-schedule.
     * 0-based index
     */
    SchedulesPage.prototype.getNthSchedule = function (index) {
        var row = this.getNthScheduleRow(index);
        return {
            payee: row.getByTestId('payee'),
            account: row.getByTestId('account'),
            date: row.getByTestId('date'),
            status: row.getByTestId('status'),
            amount: row.getByTestId('amount'),
        };
    };
    /**
     * Create a transaction for the nth-schedule.
     * 0-based index
     */
    SchedulesPage.prototype.postNthSchedule = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._performNthAction(index, 'Post transaction today')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitForTimeout(1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Complete the nth-schedule.
     * 0-based index
     */
    SchedulesPage.prototype.completeNthSchedule = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._performNthAction(index, 'Complete')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitForTimeout(1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SchedulesPage.prototype._performNthAction = function (index, actionName) {
        return __awaiter(this, void 0, void 0, function () {
            var row, actions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getNthScheduleRow(index);
                        actions = row.getByTestId('actions');
                        return [4 /*yield*/, actions.getByRole('button').click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.getByRole('button', { name: actionName }).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SchedulesPage.prototype._fillScheduleFields = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.payee) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.getByRole('textbox', { name: 'Payee' }).fill(data.payee)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Enter')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!data.account) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.page
                                .getByRole('textbox', { name: 'Account' })
                                .fill(data.account)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Enter')];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!data.amount) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.page.getByLabel('Amount').fill(String(data.amount))];
                    case 7:
                        _a.sent();
                        // For some readon, the input field does not trigger the change event on tests
                        // but it works on the browser. We can revisit this once migration to
                        // react aria components is complete.
                        return [4 /*yield*/, this.page.keyboard.press('Enter')];
                    case 8:
                        // For some readon, the input field does not trigger the change event on tests
                        // but it works on the browser. We can revisit this once migration to
                        // react aria components is complete.
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return SchedulesPage;
}());
exports.SchedulesPage = SchedulesPage;
