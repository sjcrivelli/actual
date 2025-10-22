"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.test = void 0;
/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/rules-of-hooks */
var node_path_1 = require("node:path");
var test_1 = require("@playwright/test");
var fs_extra_1 = require("fs-extra");
// Create the extended test with fixtures
exports.test = test_1.test.extend({
    electronApp: function (_a, use_1, testInfo_1) { return __awaiter(void 0, [_a, use_1, testInfo_1], void 0, function (_b, use, testInfo) {
        var uniqueTestId, testDataDir, app;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    uniqueTestId = testInfo.testId.replace(/[^\w-]/g, '-');
                    testDataDir = node_path_1.default.join('e2e/data/', uniqueTestId);
                    return [4 /*yield*/, (0, fs_extra_1.remove)(testDataDir)];
                case 1:
                    _c.sent(); // ensure any leftover test data is removed
                    return [4 /*yield*/, (0, fs_extra_1.ensureDir)(testDataDir)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, test_1._electron.launch({
                            args: ['.'],
                            env: __assign(__assign({}, process.env), { ACTUAL_DOCUMENT_DIR: testDataDir, ACTUAL_DATA_DIR: testDataDir, EXECUTION_CONTEXT: 'playwright', NODE_ENV: 'development' }),
                        })];
                case 3:
                    app = _c.sent();
                    return [4 /*yield*/, use(app)];
                case 4:
                    _c.sent();
                    // Cleanup after tests
                    return [4 /*yield*/, app.close()];
                case 5:
                    // Cleanup after tests
                    _c.sent();
                    return [4 /*yield*/, (0, fs_extra_1.remove)(testDataDir)];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    electronPage: function (_a, use_1) { return __awaiter(void 0, [_a, use_1], void 0, function (_b, use) {
        var page;
        var electronApp = _b.electronApp;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, electronApp.firstWindow()];
                case 1:
                    page = _c.sent();
                    return [4 /*yield*/, use(page)];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
