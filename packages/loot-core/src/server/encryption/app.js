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
exports.app = void 0;
var uuid_1 = require("uuid");
var asyncStorage = require("../../platform/server/asyncStorage");
var log_1 = require("../../platform/server/log");
var app_1 = require("../app");
var post_1 = require("../post");
var prefs = require("../prefs");
var server_config_1 = require("../server-config");
var sync_1 = require("../sync");
var encryption = require(".");
exports.app = (0, app_1.createApp)();
exports.app.method('key-make', keyMake);
exports.app.method('key-test', keyTest);
// A user can only enable/change their key with the file loaded. This
// will change in the future: during onboarding the user should be
// able to enable encryption. (Imagine if they are importing data from
// another source, they should be able to encrypt first)
function keyMake(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var salt, id, key, testContent;
        var password = _b.password;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!prefs.getPrefs()) {
                        throw new Error('key-make must be called with file loaded');
                    }
                    salt = encryption.randomBytes(32).toString('base64');
                    id = (0, uuid_1.v4)();
                    return [4 /*yield*/, encryption.createKey({ id: id, password: password, salt: salt })];
                case 1:
                    key = _c.sent();
                    // Load the key
                    return [4 /*yield*/, encryption.loadKey(key)];
                case 2:
                    // Load the key
                    _c.sent();
                    return [4 /*yield*/, (0, sync_1.makeTestMessage)(key.getId())];
                case 3:
                    testContent = _c.sent();
                    return [4 /*yield*/, (0, sync_1.resetSync)({
                            key: key,
                            salt: salt,
                            testContent: JSON.stringify(__assign(__assign({}, testContent), { value: testContent.value.toString('base64') })),
                        })];
                case 4: 
                // Changing your key necessitates a sync reset as well. This will
                // clear all existing encrypted data from the server so you won't
                // have a mix of data encrypted with different keys.
                return [2 /*return*/, _c.sent()];
            }
        });
    });
}
// This can be called both while a file is already loaded or not. This
// will see if a key is valid and if so save it off.
function keyTest(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, validCloudFileId, res, serverConfig, e_1, id, salt, originalTest, test, key, e_2, keys, _c, _d;
        var cloudFileId = _b.cloudFileId, password = _b.password;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _e.sent();
                    if (cloudFileId == null) {
                        cloudFileId = prefs.getPrefs().cloudFileId;
                    }
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.SYNC_SERVER + '/user-get-key', {
                            token: userToken,
                            fileId: cloudFileId,
                        })];
                case 3:
                    res = _e.sent();
                    validCloudFileId = cloudFileId;
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _e.sent();
                    log_1.logger.log(e_1);
                    return [2 /*return*/, { error: { reason: 'network' } }];
                case 5:
                    id = res.id, salt = res.salt, originalTest = res.test;
                    if (!originalTest) {
                        return [2 /*return*/, { error: { reason: 'old-key-style' } }];
                    }
                    test = JSON.parse(originalTest);
                    return [4 /*yield*/, encryption.createKey({ id: id, password: password, salt: salt })];
                case 6:
                    key = _e.sent();
                    encryption.loadKey(key);
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, encryption.decrypt(Buffer.from(test.value, 'base64'), test.meta)];
                case 8:
                    _e.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _e.sent();
                    log_1.logger.log(e_2);
                    // Unload the key, it's invalid
                    encryption.unloadKey(key);
                    return [2 /*return*/, { error: { reason: 'decrypt-failure' } }];
                case 10:
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, asyncStorage.getItem("encrypt-keys")];
                case 11:
                    keys = _d.apply(_c, [(_e.sent()) || '{}']);
                    keys[validCloudFileId] = key.serialize();
                    return [4 /*yield*/, asyncStorage.setItem('encrypt-keys', JSON.stringify(keys))];
                case 12:
                    _e.sent();
                    if (!prefs.getPrefs()) return [3 /*break*/, 14];
                    return [4 /*yield*/, prefs.savePrefs({ encryptKeyId: key.getId() })];
                case 13:
                    _e.sent();
                    _e.label = 14;
                case 14: return [2 /*return*/, {}];
            }
        });
    });
}
