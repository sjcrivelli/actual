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
exports.importActual = importActual;
// @ts-strict-ignore
var fs = require("../../platform/server/fs");
var sqlite = require("../../platform/server/sqlite");
var cloudStorage = require("../cloud-storage");
var main_1 = require("../main");
var sheet_1 = require("../sheet");
function importActual(_filepath, buffer) {
    return __awaiter(this, void 0, void 0, function () {
        var id, e_1, sqliteDb;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Importing Actual files is a special case because we can directly
                // write down the files, but because it doesn't go through the API
                // layer we need to duplicate some of the workflow
                return [4 /*yield*/, main_1.handlers['close-budget']()];
                case 1:
                    // Importing Actual files is a special case because we can directly
                    // write down the files, but because it doesn't go through the API
                    // layer we need to duplicate some of the workflow
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cloudStorage.importBuffer({ cloudFileId: null, groupId: null }, buffer)];
                case 3:
                    (id = (_a.sent()).id);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    if (e_1.type === 'FileDownloadError') {
                        return [2 /*return*/, { error: e_1.reason }];
                    }
                    throw e_1;
                case 5: return [4 /*yield*/, sqlite.openDatabase(fs.join(fs.getBudgetDir(id), 'db.sqlite'))];
                case 6:
                    sqliteDb = _a.sent();
                    sqlite.execQuery(sqliteDb, "\n          DELETE FROM kvcache;\n          DELETE FROM kvcache_key;\n        ");
                    sqlite.closeDatabase(sqliteDb);
                    // Load the budget, force everything to be computed, and try
                    // to upload it as a cloud file
                    return [4 /*yield*/, main_1.handlers['load-budget']({ id: id })];
                case 7:
                    // Load the budget, force everything to be computed, and try
                    // to upload it as a cloud file
                    _a.sent();
                    return [4 /*yield*/, main_1.handlers['get-budget-bounds']()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, sheet_1.waitOnSpreadsheet)()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, cloudStorage.upload().catch(function () { })];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
