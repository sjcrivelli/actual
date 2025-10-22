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
exports.RulesPage = void 0;
var RulesPage = /** @class */ (function () {
    function RulesPage(page) {
        this.page = page;
        this.searchBox = page.getByPlaceholder('Filter rules...');
    }
    /**
     * Create a new rule
     */
    RulesPage.prototype.createRule = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page
                            .getByRole('button', {
                            name: 'Create new rule',
                        })
                            .click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._fillRuleFields(data)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'Save' }).click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve the data for the nth-rule.
     * 0-based index
     */
    RulesPage.prototype.getNthRule = function (index) {
        var row = this.page.getByTestId('table').getByTestId('row').nth(index);
        return {
            conditions: row.getByTestId('conditions').locator(':scope > div'),
            actions: row.getByTestId('actions').locator(':scope > div'),
        };
    };
    RulesPage.prototype.searchFor = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchBox.fill(text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RulesPage.prototype._fillRuleFields = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var idx, _i, _a, splitActions;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!data.conditionsOp) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page
                                .getByTestId('conditions-op')
                                .getByRole('button')
                                .first()
                                .click()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { exact: true, name: data.conditionsOp })
                                .click()];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        if (!data.conditions) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._fillEditorFields(data.conditions, this.page.getByTestId('condition-list'), true)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        if (!data.actions) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._fillEditorFields(data.actions, this.page.getByTestId('action-list'))];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        if (!data.splits) return [3 /*break*/, 12];
                        idx = (_c = (_b = data.actions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                        _i = 0, _a = data.splits;
                        _d.label = 8;
                    case 8:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        splitActions = _a[_i];
                        return [4 /*yield*/, this.page.getByTestId('add-split-transactions').click()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, this._fillEditorFields(splitActions, this.page.getByTestId('action-list').nth(idx))];
                    case 10:
                        _d.sent();
                        idx++;
                        _d.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 8];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    RulesPage.prototype._fillEditorFields = function (data_1, rootElement_1) {
        return __awaiter(this, arguments, void 0, function (data, rootElement, fieldFirst) {
            var _i, _a, _b, idx, entry, field, op, value, row;
            if (fieldFirst === void 0) { fieldFirst = false; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = data.entries();
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 20];
                        _b = _a[_i], idx = _b[0], entry = _b[1];
                        field = entry.field, op = entry.op, value = entry.value;
                        row = rootElement.getByTestId('editor-row').nth(idx);
                        return [4 /*yield*/, row.isVisible()];
                    case 2:
                        if (!!(_c.sent())) return [3 /*break*/, 4];
                        return [4 /*yield*/, rootElement.getByRole('button', { name: 'Add entry' }).click()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!(op && !fieldFirst)) return [3 /*break*/, 8];
                        return [4 /*yield*/, row.getByTestId('op-select').getByRole('button').first().click()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: op, exact: true })
                                .first()
                                .waitFor({ state: 'visible' })];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: op, exact: true })
                                .first()
                                .click({ force: true })];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        if (!field) return [3 /*break*/, 12];
                        return [4 /*yield*/, row
                                .getByTestId('field-select')
                                .getByRole('button')
                                .first()
                                .click()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: field, exact: true })
                                .first()
                                .waitFor({ state: 'visible' })];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: field, exact: true })
                                .first()
                                .click({ force: true })];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        if (!(op && fieldFirst)) return [3 /*break*/, 16];
                        return [4 /*yield*/, row.getByTestId('op-select').getByRole('button').first().click()];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: op, exact: true })
                                .first()
                                .waitFor({ state: 'visible' })];
                    case 14:
                        _c.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: op, exact: true })
                                .first()
                                .click({ force: true })];
                    case 15:
                        _c.sent();
                        _c.label = 16;
                    case 16:
                        if (!value) return [3 /*break*/, 19];
                        return [4 /*yield*/, row.getByRole('textbox').fill(value)];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Enter')];
                    case 18:
                        _c.sent();
                        _c.label = 19;
                    case 19:
                        _i++;
                        return [3 /*break*/, 1];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    return RulesPage;
}());
exports.RulesPage = RulesPage;
