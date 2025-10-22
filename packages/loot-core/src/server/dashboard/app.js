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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var isMatch_1 = require("lodash/isMatch");
var exceptions_1 = require("../../platform/exceptions");
var fs = require("../../platform/server/fs");
var dashboard_1 = require("../../shared/dashboard");
var query_1 = require("../../shared/query");
var app_1 = require("../app");
var aql_1 = require("../aql");
var db = require("../db");
var errors_1 = require("../errors");
var models_1 = require("../models");
var mutators_1 = require("../mutators");
var app_2 = require("../reports/app");
var sync_1 = require("../sync");
var undo_1 = require("../undo");
function isExportedCustomReportWidget(widget) {
    return widget.type === 'custom-report';
}
var exportModel = {
    validate: function (dashboard) {
        (0, models_1.requiredFields)('Dashboard', dashboard, ['version', 'widgets']);
        if (!Array.isArray(dashboard.widgets)) {
            throw new errors_1.ValidationError('Invalid dashboard.widgets data type: it must be an array of widgets.');
        }
        dashboard.widgets.forEach(function (widget, idx) {
            (0, models_1.requiredFields)("Dashboard widget #".concat(idx), widget, __spreadArray([
                'type',
                'x',
                'y',
                'width',
                'height'
            ], (isExportedCustomReportWidget(widget) ? ['meta'] : []), true));
            if (!Number.isInteger(widget.x)) {
                throw new errors_1.ValidationError("Invalid widget.".concat(idx, ".x data-type for value ").concat(widget.x, "."));
            }
            if (!Number.isInteger(widget.y)) {
                throw new errors_1.ValidationError("Invalid widget.".concat(idx, ".y data-type for value ").concat(widget.y, "."));
            }
            if (!Number.isInteger(widget.width)) {
                throw new errors_1.ValidationError("Invalid widget.".concat(idx, ".width data-type for value ").concat(widget.width, "."));
            }
            if (!Number.isInteger(widget.height)) {
                throw new errors_1.ValidationError("Invalid widget.".concat(idx, ".height data-type for value ").concat(widget.height, "."));
            }
            if (![
                'net-worth-card',
                'cash-flow-card',
                'spending-card',
                'custom-report',
                'markdown-card',
                'summary-card',
                'calendar-card',
            ].includes(widget.type)) {
                throw new errors_1.ValidationError("Invalid widget.".concat(idx, ".type value ").concat(widget.type, "."));
            }
            if (isExportedCustomReportWidget(widget)) {
                app_2.reportModel.validate(widget.meta);
            }
        });
    },
};
function updateDashboard(widgets) {
    return __awaiter(this, void 0, void 0, function () {
        var dbWidgets, dbWidgetMap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('dashboard')
                        .filter({ id: { $oneof: widgets.map(function (_a) {
                                var id = _a.id;
                                return id;
                            }) } })
                        .select('*'))];
                case 1:
                    dbWidgets = (_a.sent()).data;
                    dbWidgetMap = new Map(dbWidgets.map(function (widget) { return [widget.id, widget]; }));
                    return [4 /*yield*/, Promise.all(widgets
                            // Perform an update query only if the widget actually has changes
                            .filter(function (widget) { var _a; return !(0, isMatch_1.default)((_a = dbWidgetMap.get(widget.id)) !== null && _a !== void 0 ? _a : {}, widget); })
                            .map(function (widget) { return db.update('dashboard', widget); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateDashboardWidget(widget) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.updateWithSchema('dashboard', widget)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resetDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.all(__spreadArray([
                                        // Delete all widgets
                                        db.deleteAll('dashboard')
                                    ], dashboard_1.DEFAULT_DASHBOARD_STATE.map(function (widget) {
                                        return db.insertWithSchema('dashboard', widget);
                                    }), true))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addDashboardWidget(widget) {
    return __awaiter(this, void 0, void 0, function () {
        var data, xBoundaryCheck;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!('x' in widget) && !('y' in widget))) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.first('SELECT x, y, width, height FROM dashboard WHERE tombstone = 0 ORDER BY y DESC, x DESC')];
                case 1:
                    data = _a.sent();
                    if (!data) {
                        widget.x = 0;
                        widget.y = 0;
                    }
                    else {
                        xBoundaryCheck = data.x + data.width + widget.width;
                        widget.x = xBoundaryCheck > 12 ? 0 : data.x + data.width;
                        widget.y = data.y + (xBoundaryCheck > 12 ? data.height : 0);
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, db.insertWithSchema('dashboard', widget)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function removeDashboardWidget(widgetId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.delete_('dashboard', widgetId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function importDashboard(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var content, parsedContent_1, customReportIds, customReportIdSet_1, err_1;
        var _this = this;
        var filepath = _b.filepath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fs.exists(filepath)];
                case 1:
                    if (!(_c.sent())) {
                        throw new Error("File not found at the provided path: ".concat(filepath));
                    }
                    return [4 /*yield*/, fs.readFile(filepath)];
                case 2:
                    content = _c.sent();
                    parsedContent_1 = JSON.parse(content);
                    exportModel.validate(parsedContent_1);
                    return [4 /*yield*/, db.all('SELECT id from custom_reports')];
                case 3:
                    customReportIds = _c.sent();
                    customReportIdSet_1 = new Set(customReportIds.map(function (_a) {
                        var id = _a.id;
                        return id;
                    }));
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray(__spreadArray([
                                            // Delete all widgets
                                            db.deleteAll('dashboard')
                                        ], parsedContent_1.widgets.map(function (widget) {
                                            return db.insertWithSchema('dashboard', {
                                                type: widget.type,
                                                width: widget.width,
                                                height: widget.height,
                                                x: widget.x,
                                                y: widget.y,
                                                meta: isExportedCustomReportWidget(widget)
                                                    ? { id: widget.meta.id }
                                                    : widget.meta,
                                            });
                                        }), true), parsedContent_1.widgets
                                            .filter(isExportedCustomReportWidget)
                                            .filter(function (_a) {
                                            var meta = _a.meta;
                                            return !customReportIdSet_1.has(meta.id);
                                        })
                                            .map(function (_a) {
                                            var meta = _a.meta;
                                            return db.insertWithSchema('custom_reports', app_2.reportModel.fromJS(meta));
                                        }), true), parsedContent_1.widgets
                                            .filter(isExportedCustomReportWidget)
                                            .filter(function (_a) {
                                            var meta = _a.meta;
                                            return customReportIdSet_1.has(meta.id);
                                        })
                                            .map(function (_a) {
                                            var meta = _a.meta;
                                            return db.updateWithSchema('custom_reports', __assign(__assign({}, Object.fromEntries(Object.entries(app_2.reportModel.fromJS(meta)).map(function (_a) {
                                                var key = _a[0], value = _a[1];
                                                return [
                                                    key,
                                                    value !== null && value !== void 0 ? value : null,
                                                ];
                                            }))), { tombstone: false }));
                                        }), true))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, { status: 'ok' }];
                case 5:
                    err_1 = _c.sent();
                    if (err_1 instanceof Error) {
                        err_1.message = 'Error importing file: ' + err_1.message;
                        (0, exceptions_1.captureException)(err_1);
                    }
                    if (err_1 instanceof SyntaxError) {
                        return [2 /*return*/, { error: 'json-parse-error' }];
                    }
                    if (err_1 instanceof errors_1.ValidationError) {
                        return [2 /*return*/, { error: 'validation-error', message: err_1.message }];
                    }
                    return [2 /*return*/, { error: 'internal-error' }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.app = (0, app_1.createApp)();
exports.app.method('dashboard-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateDashboard)));
exports.app.method('dashboard-update-widget', (0, mutators_1.mutator)((0, undo_1.undoable)(updateDashboardWidget)));
exports.app.method('dashboard-reset', (0, mutators_1.mutator)((0, undo_1.undoable)(resetDashboard)));
exports.app.method('dashboard-add-widget', (0, mutators_1.mutator)((0, undo_1.undoable)(addDashboardWidget)));
exports.app.method('dashboard-remove-widget', (0, mutators_1.mutator)((0, undo_1.undoable)(removeDashboardWidget)));
exports.app.method('dashboard-import', (0, mutators_1.mutator)((0, undo_1.undoable)(importDashboard)));
