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
exports.app = void 0;
var app_1 = require("../app");
var db = require("../db");
var mutators_1 = require("../mutators");
var sync_1 = require("../sync");
var undo_1 = require("../undo");
exports.app = (0, app_1.createApp)();
exports.app.method('tags-get', getTags);
exports.app.method('tags-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createTag)));
exports.app.method('tags-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteTag)));
exports.app.method('tags-delete-all', (0, mutators_1.mutator)(deleteAllTags));
exports.app.method('tags-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateTag)));
exports.app.method('tags-find', (0, mutators_1.mutator)(findTags));
function getTags() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getTags()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function createTag(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var allTags, _c, tagId, id;
        var tag = _b.tag, _d = _b.color, color = _d === void 0 ? null : _d, _e = _b.description, description = _e === void 0 ? null : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, db.getAllTags()];
                case 1:
                    allTags = _f.sent();
                    _c = (allTags.find(function (t) { return t.tag === tag; }) || {}).id, tagId = _c === void 0 ? null : _c;
                    if (!tagId) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.updateTag({
                            id: tagId,
                            tag: tag,
                            color: color,
                            description: description,
                            tombstone: 0,
                        })];
                case 2:
                    _f.sent();
                    return [2 /*return*/, { id: tagId, tag: tag, color: color, description: description }];
                case 3: return [4 /*yield*/, db.insertTag({
                        tag: tag.trim(),
                        color: color ? color.trim() : null,
                        description: description,
                    })];
                case 4:
                    id = _f.sent();
                    return [2 /*return*/, { id: id, tag: tag, color: color, description: description }];
            }
        });
    });
}
function deleteTag(tag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.deleteTag(tag)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, tag.id];
            }
        });
    });
}
function deleteAllTags(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _i, ids_1, id;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _i = 0, ids_1 = ids;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                                    id = ids_1[_i];
                                    return [4 /*yield*/, db.deleteTag({ id: id })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, ids];
            }
        });
    });
}
function updateTag(tag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.updateTag(tag)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, tag];
            }
        });
    });
}
function findTags() {
    return __awaiter(this, void 0, void 0, function () {
        var taggedNotes, tags, _i, taggedNotes_1, notes, _loop_1, _a, _b, _c, _1, tag;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, db.findTags()];
                case 1:
                    taggedNotes = _d.sent();
                    return [4 /*yield*/, getTags()];
                case 2:
                    tags = _d.sent();
                    _i = 0, taggedNotes_1 = taggedNotes;
                    _d.label = 3;
                case 3:
                    if (!(_i < taggedNotes_1.length)) return [3 /*break*/, 8];
                    notes = taggedNotes_1[_i].notes;
                    _loop_1 = function (_1, tag) {
                        var _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    if (!!tags.find(function (t) { return t.tag === tag; })) return [3 /*break*/, 2];
                                    _f = (_e = tags).push;
                                    return [4 /*yield*/, createTag({ tag: tag })];
                                case 1:
                                    _f.apply(_e, [_g.sent()]);
                                    _g.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, _b = notes.matchAll(/(?<!#)#([^#\s]+)/g);
                    _d.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_a], _1 = _c[0], tag = _c[1];
                    return [5 /*yield**/, _loop_1(_1, tag)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/, tags.sort(function (a, b) {
                        if (a.tag < b.tag) {
                            return -1;
                        }
                        if (a.tag > b.tag) {
                            return 1;
                        }
                        return 0;
                    })];
            }
        });
    });
}
