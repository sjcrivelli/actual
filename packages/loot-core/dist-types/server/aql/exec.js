"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.execQuery = execQuery;
exports.runCompiledAqlQuery = runCompiledAqlQuery;
exports.compileAndRunAqlQuery = compileAndRunAqlQuery;
const db = __importStar(require("../db"));
const compiler_1 = require("./compiler");
const schema_helpers_1 = require("./schema-helpers");
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
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        Object.keys(item).forEach(name => {
            item[name] = (0, schema_helpers_1.convertOutputType)(item[name], outputTypes.get(name));
        });
    }
}
async function execQuery(queryState, compilerState, sqlPieces, params, outputTypes) {
    const sql = (0, compiler_1.defaultConstructQuery)(queryState, compilerState, sqlPieces);
    const data = await db.all(sql, params);
    applyTypes(data, outputTypes);
    return data;
}
async function runCompiledAqlQuery(queryState, sqlPieces, compilerState, { params = {}, executors = {} } = {}) {
    const paramArray = compilerState.namedParameters.map(param => {
        const name = param.paramName;
        if (params[name] === undefined) {
            throw new Error(`Parameter ${name} not provided to query`);
        }
        return (0, schema_helpers_1.convertInputType)(params[name], param.paramType);
    });
    let data = [];
    if (executors[compilerState.implicitTableName]) {
        data = await executors[compilerState.implicitTableName](compilerState, queryState, sqlPieces, paramArray, compilerState.outputTypes);
    }
    else {
        data = await execQuery(queryState, compilerState, sqlPieces, paramArray, compilerState.outputTypes);
    }
    if (queryState.calculation) {
        if (data.length > 0) {
            const row = data[0];
            const k = Object.keys(row)[0];
            // TODO: the function being run should be the one to
            // determine the default value, not hardcoded as 0
            return row[k] || 0;
        }
        else {
            return null;
        }
    }
    return data;
}
async function compileAndRunAqlQuery(schema, schemaConfig, queryState, options) {
    const { sqlPieces, state } = (0, compiler_1.compileQuery)(queryState, schema, schemaConfig);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await runCompiledAqlQuery(queryState, sqlPieces, state, options);
    return { data, dependencies: state.dependencies };
}
//# sourceMappingURL=exec.js.map