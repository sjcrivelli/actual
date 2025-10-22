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
exports.app = exports.reportModel = void 0;
var uuid_1 = require("uuid");
var app_1 = require("../app");
var db = require("../db");
var errors_1 = require("../errors");
var models_1 = require("../models");
var mutators_1 = require("../mutators");
var undo_1 = require("../undo");
exports.reportModel = {
    validate: function (report, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        (0, models_1.requiredFields)('Report', report, ['conditionsOp'], update);
        if (!update || 'conditionsOp' in report) {
            if (!['and', 'or'].includes(report.conditionsOp)) {
                throw new errors_1.ValidationError('Invalid filter conditionsOp: ' + report.conditionsOp);
            }
        }
        return report;
    },
    toJS: function (row) {
        return {
            id: row.id,
            name: row.name,
            startDate: row.start_date,
            endDate: row.end_date,
            isDateStatic: row.date_static === 1,
            dateRange: row.date_range,
            mode: row.mode,
            groupBy: row.group_by,
            sortBy: row.sort_by,
            interval: row.interval,
            balanceType: row.balance_type,
            showEmpty: row.show_empty === 1,
            showOffBudget: row.show_offbudget === 1,
            showHiddenCategories: row.show_hidden === 1,
            showUncategorized: row.show_uncategorized === 1,
            trimIntervals: row.trim_intervals === 1,
            includeCurrentInterval: row.include_current === 1,
            graphType: row.graph_type,
            conditions: row.conditions,
            conditionsOp: row.conditions_op,
        };
    },
    fromJS: function (report) {
        return {
            id: report.id,
            name: report.name,
            start_date: report.startDate,
            end_date: report.endDate,
            date_static: report.isDateStatic ? 1 : 0,
            date_range: report.dateRange,
            mode: report.mode,
            group_by: report.groupBy,
            sort_by: report.sortBy,
            interval: report.interval,
            balance_type: report.balanceType,
            show_empty: report.showEmpty ? 1 : 0,
            show_offbudget: report.showOffBudget ? 1 : 0,
            show_hidden: report.showHiddenCategories ? 1 : 0,
            trim_intervals: report.trimIntervals ? 1 : 0,
            include_current: report.includeCurrentInterval ? 1 : 0,
            graph_type: report.graphType,
            conditions: report.conditions,
            conditions_op: report.conditionsOp,
        };
    },
};
function reportNameExists(name, reportId, newItem) {
    return __awaiter(this, void 0, void 0, function () {
        var idForName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.first('SELECT id from custom_reports WHERE tombstone = 0 AND name = ?', [name])];
                case 1:
                    idForName = _a.sent();
                    //no existing name found
                    if (idForName === null) {
                        return [2 /*return*/, false];
                    }
                    //for update/rename
                    if (!newItem) {
                        /*
                        -if the found item is the same as the existing item
                        then no name change was made.
                        -if they are not the same then there is another
                        item with that name already.
                        */
                        return [2 /*return*/, idForName.id !== reportId];
                    }
                    //default return: item was found but does not match current name
                    return [2 /*return*/, true];
            }
        });
    });
}
function createReport(report) {
    return __awaiter(this, void 0, void 0, function () {
        var reportId, item, nameExists;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reportId = (0, uuid_1.v4)();
                    item = __assign(__assign({}, report), { id: reportId });
                    if (!item.name) {
                        throw new Error('Report name is required');
                    }
                    return [4 /*yield*/, reportNameExists(item.name, (_a = item.id) !== null && _a !== void 0 ? _a : '', true)];
                case 1:
                    nameExists = _b.sent();
                    if (nameExists) {
                        throw new Error('There is already a report named ' + item.name);
                    }
                    // Create the report here based on the info
                    return [4 /*yield*/, db.insertWithSchema('custom_reports', exports.reportModel.fromJS(item))];
                case 2:
                    // Create the report here based on the info
                    _b.sent();
                    return [2 /*return*/, reportId];
            }
        });
    });
}
function updateReport(item) {
    return __awaiter(this, void 0, void 0, function () {
        var nameExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!item.name) {
                        throw new Error('Report name is required');
                    }
                    if (!item.id) {
                        throw new Error('Report recall error');
                    }
                    return [4 /*yield*/, reportNameExists(item.name, item.id, false)];
                case 1:
                    nameExists = _a.sent();
                    if (nameExists) {
                        throw new Error('There is already a report named ' + item.name);
                    }
                    return [4 /*yield*/, db.updateWithSchema('custom_reports', exports.reportModel.fromJS(item))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteReport(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.delete_('custom_reports', id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('report/create', (0, mutators_1.mutator)((0, undo_1.undoable)(createReport)));
exports.app.method('report/update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateReport)));
exports.app.method('report/delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteReport)));
