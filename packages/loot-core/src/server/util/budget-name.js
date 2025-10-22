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
exports.uniqueBudgetName = uniqueBudgetName;
exports.validateBudgetName = validateBudgetName;
exports.idFromBudgetName = idFromBudgetName;
var uuid_1 = require("uuid");
var fs = require("../../platform/server/fs");
var main_1 = require("../main");
function uniqueBudgetName() {
    return __awaiter(this, arguments, void 0, function (initialName) {
        var budgets, idx, newName;
        if (initialName === void 0) { initialName = 'My Finances'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, main_1.handlers['get-budgets']()];
                case 1:
                    budgets = _a.sent();
                    idx = 1;
                    newName = initialName;
                    while (budgets.find(function (file) { return file.name === newName; })) {
                        newName = "".concat(initialName, " ").concat(idx);
                        idx++;
                    }
                    return [2 /*return*/, newName];
            }
        });
    });
}
function validateBudgetName(name) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmedName, uniqueName, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trimmedName = name.trim();
                    return [4 /*yield*/, uniqueBudgetName(trimmedName)];
                case 1:
                    uniqueName = _a.sent();
                    message = null;
                    if (trimmedName === '')
                        message = 'Budget name cannot be blank';
                    if (trimmedName.length > 100) {
                        message = 'Budget name is too long (max length 100)';
                    }
                    if (uniqueName !== trimmedName) {
                        message = "\u201C".concat(name, "\u201D already exists, try \u201C").concat(uniqueName, "\u201D instead");
                    }
                    return [2 /*return*/, message ? { valid: false, message: message } : { valid: true }];
            }
        });
    });
}
function idFromBudgetName(name) {
    return __awaiter(this, void 0, void 0, function () {
        var id, index, budgetDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = name.replace(/( |[^A-Za-z0-9])/g, '-') + '-' + (0, uuid_1.v4)().slice(0, 7);
                    index = 0;
                    budgetDir = fs.getBudgetDir(id);
                    _a.label = 1;
                case 1: return [4 /*yield*/, fs.exists(budgetDir)];
                case 2:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    index++;
                    budgetDir = fs.getBudgetDir(id + index.toString());
                    return [3 /*break*/, 1];
                case 3:
                    // If a suffix was added, update the id
                    if (index > 0) {
                        id = id + index.toString();
                    }
                    return [2 /*return*/, id];
            }
        });
    });
}
