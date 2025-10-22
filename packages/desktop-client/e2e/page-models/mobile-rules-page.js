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
exports.MobileRulesPage = void 0;
var MobileRulesPage = /** @class */ (function () {
    function MobileRulesPage(page) {
        this.page = page;
        this.searchBox = page.getByPlaceholder('Filter rules…');
        this.addButton = page.getByRole('button', { name: 'Add new rule' });
        this.rulesList = page.getByRole('main');
        this.emptyMessage = page.getByText('No rules found');
    }
    MobileRulesPage.prototype.waitFor = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesList.waitFor(options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search for rules using the search box
     */
    MobileRulesPage.prototype.searchFor = function (text) {
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
    /**
     * Clear the search box
     */
    MobileRulesPage.prototype.clearSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchBox.fill('')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the nth rule item (0-based index)
     */
    MobileRulesPage.prototype.getNthRule = function (index) {
        return this.getAllRules().nth(index);
    };
    /**
     * Get all visible rule items
     */
    MobileRulesPage.prototype.getAllRules = function () {
        return this.page.getByRole('grid', { name: 'Rules' }).getByRole('row');
    };
    /**
     * Click on a rule to edit it
     */
    MobileRulesPage.prototype.clickRule = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rule = this.getNthRule(index);
                        return [4 /*yield*/, rule.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click the add button to create a new rule
     */
    MobileRulesPage.prototype.clickAddRule = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the number of visible rules
     */
    MobileRulesPage.prototype.getRuleCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rules = this.getAllRules();
                        return [4 /*yield*/, rules.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Check if a rule contains specific text
     */
    MobileRulesPage.prototype.ruleContainsText = function (index, text) {
        return __awaiter(this, void 0, void 0, function () {
            var rule, ruleText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rule = this.getNthRule(index);
                        return [4 /*yield*/, rule.textContent()];
                    case 1:
                        ruleText = _a.sent();
                        return [2 /*return*/, (ruleText === null || ruleText === void 0 ? void 0 : ruleText.includes(text)) || false];
                }
            });
        });
    };
    /**
     * Get the stage badge text for a rule (PRE/DEFAULT/POST)
     */
    MobileRulesPage.prototype.getRuleStage = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var rule, stageBadge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rule = this.getNthRule(index);
                        stageBadge = rule.getByTestId('rule-stage-badge');
                        return [4 /*yield*/, stageBadge.textContent()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MobileRulesPage;
}());
exports.MobileRulesPage = MobileRulesPage;
