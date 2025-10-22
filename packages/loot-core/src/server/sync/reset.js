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
exports.resetSync = resetSync;
// @ts-strict-ignore
var exceptions_1 = require("../../platform/exceptions");
var asyncStorage = require("../../platform/server/asyncStorage");
var connection = require("../../platform/server/connection");
var cloudStorage = require("../cloud-storage");
var db = require("../db");
var mutators_1 = require("../mutators");
var prefs = require("../prefs");
function resetSync(keyState) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, valid, error_1, error, key, cloudFileId, keys, _b, _c, e_1;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!!keyState) return [3 /*break*/, 2];
                    return [4 /*yield*/, cloudStorage.checkKey()];
                case 1:
                    _a = _d.sent(), valid = _a.valid, error_1 = _a.error;
                    if (error_1) {
                        return [2 /*return*/, { error: error_1 }];
                    }
                    else if (!valid) {
                        return [2 /*return*/, { error: { reason: 'file-has-new-key' } }];
                    }
                    _d.label = 2;
                case 2: return [4 /*yield*/, cloudStorage.resetSyncState(keyState)];
                case 3:
                    error = (_d.sent()).error;
                    if (error) {
                        return [2 /*return*/, { error: error }];
                    }
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // TOOD: We could automatically generate the list of tables to
                                    // cleanup by looking at the schema
                                    //
                                    // Be VERY careful here since we are bulk deleting data. It should
                                    // never delete any data that doesn't have `tombstone = 1`
                                    return [4 /*yield*/, db.execQuery("\n      DELETE FROM messages_crdt;\n      DELETE FROM messages_clock;\n      DELETE FROM transactions WHERE tombstone = 1;\n      DELETE FROM accounts WHERE tombstone = 1;\n      DELETE FROM payees WHERE tombstone = 1;\n      DELETE FROM categories WHERE tombstone = 1;\n      DELETE FROM category_groups WHERE tombstone = 1;\n      DELETE FROM schedules WHERE tombstone = 1;\n      DELETE FROM rules WHERE tombstone = 1;\n      ANALYZE;\n      VACUUM;\n    ")];
                                    case 1:
                                        // TOOD: We could automatically generate the list of tables to
                                        // cleanup by looking at the schema
                                        //
                                        // Be VERY careful here since we are bulk deleting data. It should
                                        // never delete any data that doesn't have `tombstone = 1`
                                        _a.sent();
                                        return [4 /*yield*/, db.loadClock()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, prefs.savePrefs({
                            groupId: null,
                            lastSyncedTimestamp: null,
                            lastUploaded: null,
                        })];
                case 5:
                    _d.sent();
                    if (!keyState) return [3 /*break*/, 9];
                    key = keyState.key;
                    cloudFileId = prefs.getPrefs().cloudFileId;
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, asyncStorage.getItem("encrypt-keys")];
                case 6:
                    keys = _c.apply(_b, [(_d.sent()) || '{}']);
                    keys[cloudFileId] = key.serialize();
                    return [4 /*yield*/, asyncStorage.setItem('encrypt-keys', JSON.stringify(keys))];
                case 7:
                    _d.sent();
                    // Save the key id in prefs
                    return [4 /*yield*/, prefs.savePrefs({ encryptKeyId: key.getId() })];
                case 8:
                    // Save the key id in prefs
                    _d.sent();
                    _d.label = 9;
                case 9:
                    _d.trys.push([9, 11, 12, 13]);
                    return [4 /*yield*/, cloudStorage.upload()];
                case 10:
                    _d.sent();
                    return [3 /*break*/, 13];
                case 11:
                    e_1 = _d.sent();
                    if (e_1.reason) {
                        return [2 /*return*/, { error: e_1 }];
                    }
                    (0, exceptions_1.captureException)(e_1);
                    return [2 /*return*/, { error: { reason: 'upload-failure' } }];
                case 12:
                    connection.send('prefs-updated');
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/, {}];
            }
        });
    });
}
