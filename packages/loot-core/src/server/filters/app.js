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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// @ts-strict-ignore
var uuid_1 = require("uuid");
var app_1 = require("../app");
var db = require("../db");
var models_1 = require("../models");
var mutators_1 = require("../mutators");
var transaction_rules_1 = require("../transactions/transaction-rules");
var undo_1 = require("../undo");
var filterModel = {
    validate: function (filter, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        (0, models_1.requiredFields)('transaction_filters', filter, ['conditions'], update);
        if (!update || 'conditionsOp' in filter) {
            if (!['and', 'or'].includes(filter.conditionsOp)) {
                throw new Error('Invalid filter conditionsOp: ' + filter.conditionsOp);
            }
        }
        return filter;
    },
    toJS: function (row) {
        var conditions = row.conditions, conditions_op = row.conditions_op, fields = __rest(row, ["conditions", "conditions_op"]);
        return __assign(__assign({}, fields), { conditionsOp: conditions_op, conditions: (0, transaction_rules_1.parseConditionsOrActions)(conditions) });
    },
    fromJS: function (filter) {
        var conditionsOp = filter.conditionsOp, row = __rest(filter, ["conditionsOp"]);
        if (conditionsOp) {
            row.conditions_op = conditionsOp;
        }
        return row;
    },
};
function filterNameExists(name, filterId, newItem) {
    return __awaiter(this, void 0, void 0, function () {
        var idForName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.first('SELECT id from transaction_filters WHERE tombstone = 0 AND name = ?', [name])];
                case 1:
                    idForName = _a.sent();
                    if (idForName === null) {
                        return [2 /*return*/, false];
                    }
                    if (!newItem) {
                        return [2 /*return*/, idForName.id !== filterId];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function conditionExists(item, filters, newItem) {
    var conditions = item.conditions, conditionsOp = item.conditionsOp;
    var fConditionFound = null;
    filters.some(function (filter) {
        if ((conditions.length === 1 || filter.conditionsOp === conditionsOp) &&
            !filter.tombstone &&
            filter.conditions.length === conditions.length) {
            var allConditionsMatch = !conditions.some(function (cond) {
                return !filter.conditions.some(function (fcond) {
                    return cond.value === fcond.value &&
                        cond.op === fcond.op &&
                        cond.field === fcond.field &&
                        filterOptionsMatch(cond.options, fcond.options);
                });
            });
            if (allConditionsMatch) {
                fConditionFound = filter;
                return true;
            }
        }
        return false;
    });
    if (!newItem) {
        return fConditionFound
            ? fConditionFound.id !== item.id
                ? fConditionFound.name
                : false
            : false;
    }
    return fConditionFound ? fConditionFound.name : false;
}
function filterOptionsMatch(options1, options2) {
    var opt1 = options1 !== null && options1 !== void 0 ? options1 : {};
    var opt2 = options2 !== null && options2 !== void 0 ? options2 : {};
    var keys1 = Object.keys(opt1);
    var keys2 = Object.keys(opt2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    return keys1.every(function (key) { return opt1[key] === opt2[key]; });
}
function createFilter(filter) {
    return __awaiter(this, void 0, void 0, function () {
        var filterId, item, condExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filterId = (0, uuid_1.v4)();
                    item = {
                        id: filterId,
                        conditions: filter.state.conditions,
                        conditionsOp: filter.state.conditionsOp,
                        name: filter.state.name,
                    };
                    if (!item.name) return [3 /*break*/, 2];
                    return [4 /*yield*/, filterNameExists(item.name, item.id, true)];
                case 1:
                    if (_a.sent()) {
                        throw new Error('There is already a filter named ' + item.name);
                    }
                    return [3 /*break*/, 3];
                case 2: throw new Error('Filter name is required');
                case 3:
                    if (item.conditions.length > 0) {
                        condExists = conditionExists(item, filter.filters, true);
                        if (condExists) {
                            throw new Error('Duplicate filter warning: conditions already exist. Filter name: ' +
                                condExists);
                        }
                    }
                    else {
                        throw new Error('Conditions are required');
                    }
                    // Create the filter here based on the info
                    return [4 /*yield*/, db.insertWithSchema('transaction_filters', filterModel.fromJS(item))];
                case 4:
                    // Create the filter here based on the info
                    _a.sent();
                    return [2 /*return*/, filterId];
            }
        });
    });
}
function updateFilter(filter) {
    return __awaiter(this, void 0, void 0, function () {
        var item, condExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    item = {
                        id: filter.state.id,
                        conditions: filter.state.conditions,
                        conditionsOp: filter.state.conditionsOp,
                        name: filter.state.name,
                    };
                    if (!item.name) return [3 /*break*/, 2];
                    return [4 /*yield*/, filterNameExists(item.name, item.id, false)];
                case 1:
                    if (_a.sent()) {
                        throw new Error('There is already a filter named ' + item.name);
                    }
                    return [3 /*break*/, 3];
                case 2: throw new Error('Filter name is required');
                case 3:
                    if (item.conditions.length > 0) {
                        condExists = conditionExists(item, filter.filters, false);
                        if (condExists) {
                            throw new Error('Duplicate filter warning: conditions already exist. Filter name: ' +
                                condExists);
                        }
                    }
                    else {
                        throw new Error('Conditions are required');
                    }
                    return [4 /*yield*/, db.updateWithSchema('transaction_filters', filterModel.fromJS(item))];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteFilter(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.delete_('transaction_filters', id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.app = (0, app_1.createApp)();
exports.app.method('filter-create', (0, mutators_1.mutator)(createFilter));
exports.app.method('filter-update', (0, mutators_1.mutator)(updateFilter));
exports.app.method('filter-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteFilter)));
