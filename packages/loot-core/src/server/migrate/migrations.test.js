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
var db = require("../db");
var migrations_1 = require("./migrations");
beforeEach(global.emptyDatabase(true));
describe('Migrations', function () {
    test('gets the latest migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
        var applied, available;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, migrations_1.getAppliedMigrations)(db.getDatabase())];
                case 1:
                    applied = _a.sent();
                    return [4 /*yield*/, (0, migrations_1.getMigrationList)(__dirname + '/../../mocks/migrations')];
                case 2:
                    available = _a.sent();
                    expect(applied.length).toBe(0);
                    expect(available).toMatchSnapshot();
                    expect((0, migrations_1.getPending)(applied, available)).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('applied migrations are returned in order', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, migrations_1.withMigrationsDir)(__dirname + '/../../mocks/migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var migrations, last, _i, migrations_2, migration;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, migrations_1.migrate)(db.getDatabase())];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, migrations_1.getAppliedMigrations)(db.getDatabase())];
                            case 2:
                                migrations = _a.sent();
                                last = 0;
                                for (_i = 0, migrations_2 = migrations; _i < migrations_2.length; _i++) {
                                    migration = migrations_2[_i];
                                    if (migration <= last) {
                                        throw new Error('Found older migration out of order');
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    }); });
    test('checks if there are unknown migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, migrations_1.withMigrationsDir)(__dirname + '/../../mocks/migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Insert a random migration id
                            return [4 /*yield*/, db.runQuery('INSERT INTO __migrations__ (id) VALUES (1000)')];
                            case 1:
                                // Insert a random migration id
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, (0, migrations_1.migrate)(db.getDatabase())];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                e_1 = _a.sent();
                                expect(e_1.message).toBe('out-of-sync-migrations');
                                return [2 /*return*/];
                            case 5:
                                expect('should never reach here').toBe(null);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    }); });
    test('app runs database migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, migrations_1.withMigrationsDir)(__dirname + '/../../mocks/migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var desc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, db.first("SELECT * FROM sqlite_master WHERE name = 'poop'")];
                            case 1:
                                desc = _a.sent();
                                expect(desc).toBe(null);
                                return [4 /*yield*/, (0, migrations_1.migrate)(db.getDatabase())];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, db.first("SELECT * FROM sqlite_master WHERE name = 'poop'")];
                            case 3:
                                desc = _a.sent();
                                expect(desc).toBeDefined();
                                expect(desc.sql.indexOf('is_income')).toBe(-1);
                                expect(desc.sql.indexOf('is_expense')).not.toBe(-1);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    }); });
});
