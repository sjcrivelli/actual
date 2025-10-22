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
exports.execQuery = execQuery;
exports.runCompiledAqlQuery = runCompiledAqlQuery;
exports.compileAndRunAqlQuery = compileAndRunAqlQuery;
var db = require("../db");
var compiler_1 = require("./compiler");
var schema_helpers_1 = require("./schema-helpers");
// TODO (compiler):
// * Properly safeguard all inputs against SQL injection
// * Functions for incr/decr dates
// * Support HAVING
// * Allow creating in-memory tables to run queries against static
//   data
// * For aggregate functions on selected ids, manually implement
//   them only only support a specific few (sum amount / etc)
// * Select expressions should be evaluated first, and added to a
//   global "field lookup" table that other filter/groupBy/etc
//   expressions can reference
function applyTypes(data, outputTypes) {
    var _loop_1 = function (i) {
        var item = data[i];
        Object.keys(item).forEach(function (name) {
            item[name] = (0, schema_helpers_1.convertOutputType)(item[name], outputTypes.get(name));
        });
    };
    for (var i = 0; i < data.length; i++) {
        _loop_1(i);
    }
}
function execQuery(queryState, compilerState, sqlPieces, params, outputTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = (0, compiler_1.defaultConstructQuery)(queryState, compilerState, sqlPieces);
                    return [4 /*yield*/, db.all(sql, params)];
                case 1:
                    data = _a.sent();
                    applyTypes(data, outputTypes);
                    return [2 /*return*/, data];
            }
        });
    });
}
function runCompiledAqlQuery(queryState_1, sqlPieces_1, compilerState_1) {
    return __awaiter(this, arguments, void 0, function (queryState, sqlPieces, compilerState, _a) {
        var paramArray, data, row, k;
        var _b = _a === void 0 ? {} : _a, _c = _b.params, params = _c === void 0 ? {} : _c, _d = _b.executors, executors = _d === void 0 ? {} : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    paramArray = compilerState.namedParameters.map(function (param) {
                        var name = param.paramName;
                        if (params[name] === undefined) {
                            throw new Error("Parameter ".concat(name, " not provided to query"));
                        }
                        return (0, schema_helpers_1.convertInputType)(params[name], param.paramType);
                    });
                    data = [];
                    if (!executors[compilerState.implicitTableName]) return [3 /*break*/, 2];
                    return [4 /*yield*/, executors[compilerState.implicitTableName](compilerState, queryState, sqlPieces, paramArray, compilerState.outputTypes)];
                case 1:
                    data = _e.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, execQuery(queryState, compilerState, sqlPieces, paramArray, compilerState.outputTypes)];
                case 3:
                    data = _e.sent();
                    _e.label = 4;
                case 4:
                    if (queryState.calculation) {
                        if (data.length > 0) {
                            row = data[0];
                            k = Object.keys(row)[0];
                            // TODO: the function being run should be the one to
                            // determine the default value, not hardcoded as 0
                            return [2 /*return*/, row[k] || 0];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
function compileAndRunAqlQuery(schema, schemaConfig, queryState, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, sqlPieces, state, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, compiler_1.compileQuery)(queryState, schema, schemaConfig), sqlPieces = _a.sqlPieces, state = _a.state;
                    return [4 /*yield*/, runCompiledAqlQuery(queryState, sqlPieces, state, options)];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, { data: data, dependencies: state.dependencies }];
            }
        });
    });
}
