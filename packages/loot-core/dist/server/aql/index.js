"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaConfig = exports.schema = exports.makeViews = exports.compileQuery = exports.convertInputType = exports.convertFromSelect = exports.convertForUpdate = exports.convertForInsert = void 0;
exports.aqlCompiledQuery = aqlCompiledQuery;
exports.aqlQuery = aqlQuery;
const query_1 = require("../../shared/query");
const exec_1 = require("./exec");
const schema_1 = require("./schema");
const executors_1 = require("./schema/executors");
var schema_helpers_1 = require("./schema-helpers");
Object.defineProperty(exports, "convertForInsert", { enumerable: true, get: function () { return schema_helpers_1.convertForInsert; } });
Object.defineProperty(exports, "convertForUpdate", { enumerable: true, get: function () { return schema_helpers_1.convertForUpdate; } });
Object.defineProperty(exports, "convertFromSelect", { enumerable: true, get: function () { return schema_helpers_1.convertFromSelect; } });
Object.defineProperty(exports, "convertInputType", { enumerable: true, get: function () { return schema_helpers_1.convertInputType; } });
var compiler_1 = require("./compiler");
Object.defineProperty(exports, "compileQuery", { enumerable: true, get: function () { return compiler_1.compileQuery; } });
var views_1 = require("./views");
Object.defineProperty(exports, "makeViews", { enumerable: true, get: function () { return views_1.makeViews; } });
var schema_2 = require("./schema");
Object.defineProperty(exports, "schema", { enumerable: true, get: function () { return schema_2.schema; } });
Object.defineProperty(exports, "schemaConfig", { enumerable: true, get: function () { return schema_2.schemaConfig; } });
function aqlCompiledQuery(queryState, sqlPieces, compilerState, params) {
    return (0, exec_1.runCompiledAqlQuery)(queryState, sqlPieces, compilerState, {
        params,
        executors: executors_1.schemaExecutors,
    });
}
function aqlQuery(query, params) {
    if (query instanceof query_1.Query) {
        query = query.serialize();
    }
    return (0, exec_1.compileAndRunAqlQuery)(schema_1.schema, schema_1.schemaConfig, query, {
        params,
        executors: executors_1.schemaExecutors,
    });
}
