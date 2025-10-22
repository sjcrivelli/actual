"use strict";
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
exports.Spreadsheet = void 0;
// @ts-strict-ignore
var mitt_1 = require("mitt");
var log_1 = require("../../platform/server/log");
var aql_1 = require("../aql");
var graph_data_structure_1 = require("./graph-data-structure");
var util_1 = require("./util");
var Spreadsheet = /** @class */ (function () {
    function Spreadsheet(saveCache, setCacheStatus) {
        // @ts-expect-error Graph should be converted to class
        this.graph = new graph_data_structure_1.Graph();
        this.nodes = new Map();
        this.transactionDepth = 0;
        this.saveCache = saveCache;
        this.setCacheStatus = setCacheStatus;
        this.dirtyCells = [];
        this.computeQueue = [];
        this.events = (0, mitt_1.default)();
        this._meta = {
            createdMonths: new Set(),
            budgetType: 'envelope',
        };
    }
    Spreadsheet.prototype.meta = function () {
        return this._meta;
    };
    Spreadsheet.prototype.setMeta = function (meta) {
        this._meta = meta;
    };
    // Spreadsheet interface
    Spreadsheet.prototype._getNode = function (name) {
        var sheet = (0, util_1.unresolveName)(name).sheet;
        if (!this.nodes.has(name)) {
            this.nodes.set(name, {
                name: name,
                expr: null,
                value: null,
                sheet: sheet,
            });
        }
        return this.nodes.get(name);
    };
    Spreadsheet.prototype.getNode = function (name) {
        return this._getNode(name);
    };
    Spreadsheet.prototype.hasCell = function (name) {
        return this.nodes.has(name);
    };
    Spreadsheet.prototype.add = function (name, expr) {
        this.set(name, expr);
    };
    Spreadsheet.prototype.getNodes = function () {
        return this.nodes;
    };
    Spreadsheet.prototype.serialize = function () {
        return {
            graph: this.graph.getEdges(),
            nodes: __spreadArray([], this.nodes.entries(), true),
        };
    };
    Spreadsheet.prototype.transaction = function (func) {
        this.startTransaction();
        try {
            func();
        }
        catch (e) {
            log_1.logger.log(e);
        }
        return this.endTransaction();
    };
    Spreadsheet.prototype.startTransaction = function () {
        this.transactionDepth++;
    };
    Spreadsheet.prototype.endTransaction = function () {
        this.transactionDepth--;
        if (this.transactionDepth === 0) {
            var cells = this.dirtyCells;
            this.dirtyCells = [];
            this.queueComputation(this.graph.topologicalSort(cells));
        }
        return [];
    };
    Spreadsheet.prototype.queueComputation = function (cellNames) {
        // TODO: Formally write out the different cases when the existing
        // queue is not empty. There should be cases where we can easily
        // optimize this by skipping computations if we know they are
        // going to be computed again. The hard thing is to ensure that
        // the order of computations stays correct
        var _this = this;
        this.computeQueue = this.computeQueue.concat(cellNames);
        // Begin running on the next tick so we guarantee that it doesn't finish
        // within the same tick. Since some computations are async, this makes it
        // consistent (otherwise it would only sometimes finish sync)
        Promise.resolve().then(function () {
            if (!_this.running) {
                _this.runComputations();
            }
        });
    };
    Spreadsheet.prototype.runComputations = function (idx) {
        var _this = this;
        if (idx === void 0) { idx = 0; }
        this.running = true;
        var _loop_1 = function () {
            var name_1 = this_1.computeQueue[idx];
            var node;
            var result = void 0;
            try {
                node = this_1.getNode(name_1);
                if (node._run) {
                    var args = node._dependencies.map(function (dep) {
                        return _this.getNode(dep).value;
                    });
                    result = node._run.apply(node, args);
                    if (result instanceof Promise) {
                        log_1.logger.warn("dynamic cell ".concat(name_1, " returned a promise! this is discouraged because errors are not handled properly"));
                    }
                }
                else if (node.sql) {
                    result = (0, aql_1.aqlCompiledQuery)(node.query, node.sql.sqlPieces, node.sql.state);
                }
                else {
                    idx++;
                    return "continue";
                }
            }
            catch (e) {
                log_1.logger.log('Error while evaluating ' + name_1 + ':', e);
                // If an error happens, bail on the rest of the computations
                this_1.running = false;
                this_1.computeQueue = [];
                return { value: void 0 };
            }
            if (result instanceof Promise) {
                // When the cell is finished computing, finish computing the
                // rest
                result.then(function (value) {
                    node.value = value;
                    _this.runComputations(idx + 1);
                }, function (err) {
                    // TODO: use captureException here
                    log_1.logger.warn("Failed running ".concat(node.name, "!"), err);
                    _this.runComputations(idx + 1);
                });
                return { value: void 0 };
            }
            else {
                node.value = result;
            }
            idx++;
        };
        var this_1 = this;
        while (idx < this.computeQueue.length) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // If everything computed in one loop (no async operations) notify
        // the user and empty the queue
        if (idx === this.computeQueue.length) {
            this.events.emit('change', { names: this.computeQueue });
            // Cache the updated cells
            if (typeof this.saveCache === 'function') {
                this.saveCache(this.computeQueue);
            }
            this.markCacheSafe();
            this.running = false;
            this.computeQueue = [];
        }
    };
    Spreadsheet.prototype.markCacheSafe = function () {
        if (!this.cacheBarrier) {
            if (this.setCacheStatus) {
                this.setCacheStatus({ clean: true });
            }
        }
    };
    Spreadsheet.prototype.markCacheDirty = function () {
        if (this.setCacheStatus) {
            this.setCacheStatus({ clean: false });
        }
    };
    Spreadsheet.prototype.startCacheBarrier = function () {
        this.cacheBarrier = true;
        this.markCacheDirty();
    };
    Spreadsheet.prototype.endCacheBarrier = function () {
        this.cacheBarrier = false;
        var pendingChange = this.running || this.computeQueue.length > 0;
        if (!pendingChange) {
            this.markCacheSafe();
        }
    };
    Spreadsheet.prototype.addEventListener = function (name, func) {
        var _this = this;
        this.events.on(name, func);
        return function () { return _this.events.off(name, func); };
    };
    Spreadsheet.prototype.onFinish = function (func) {
        if (this.transactionDepth !== 0) {
            throw new Error('onFinish called while inside a spreadsheet transaction. This is not allowed as it will lead to race conditions');
        }
        if (!this.running && this.computeQueue.length === 0) {
            func([]);
            // The remove function does nothing
            return function () { };
        }
        var remove = this.addEventListener('change', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            remove();
            return func.apply(void 0, args);
        });
        return remove;
    };
    Spreadsheet.prototype.unload = function () {
        this.events.all.clear();
    };
    Spreadsheet.prototype.getValue = function (name) {
        return this.getNode(name).value;
    };
    Spreadsheet.prototype.getExpr = function (name) {
        return this.getNode(name).expr;
    };
    Spreadsheet.prototype.getCellValue = function (sheet, name) {
        return this.getNode((0, util_1.resolveName)(sheet, name)).value;
    };
    Spreadsheet.prototype.getCellExpr = function (sheet, name) {
        return this.getNode((0, util_1.resolveName)(sheet, name)).expr;
    };
    Spreadsheet.prototype.getCellValueLoose = function (sheetName, cellName) {
        var name = (0, util_1.resolveName)(sheetName, cellName);
        if (this.nodes.has(name)) {
            return this.getNode(name).value;
        }
        return null;
    };
    Spreadsheet.prototype.bootup = function (onReady) {
        this.onFinish(function () {
            onReady();
        });
    };
    Spreadsheet.prototype.load = function (name, value) {
        var node = this._getNode(name);
        node.expr = value;
        node.value = value;
    };
    Spreadsheet.prototype.create = function (name, value) {
        var _this = this;
        return this.transaction(function () {
            var node = _this._getNode(name);
            node.expr = value;
            node.value = value;
            _this._markDirty(name);
        });
    };
    Spreadsheet.prototype.set = function (name, value) {
        this.create(name, value);
    };
    Spreadsheet.prototype.recompute = function (name) {
        var _this = this;
        this.transaction(function () {
            _this.dirtyCells.push(name);
        });
    };
    Spreadsheet.prototype.recomputeAll = function () {
        var _this = this;
        // Recompute everything!
        this.transaction(function () {
            _this.dirtyCells = __spreadArray([], _this.nodes.keys(), true);
        });
    };
    Spreadsheet.prototype.createQuery = function (sheetName, cellName, query) {
        var _this = this;
        var name = (0, util_1.resolveName)(sheetName, cellName);
        var node = this._getNode(name);
        if (node.query !== query) {
            node.query = query;
            var _a = (0, aql_1.compileQuery)(node.query, aql_1.schema, aql_1.schemaConfig), sqlPieces = _a.sqlPieces, state = _a.state;
            node.sql = { sqlPieces: sqlPieces, state: state };
            this.transaction(function () {
                _this._markDirty(name);
            });
        }
    };
    Spreadsheet.prototype.createStatic = function (sheetName, cellName, initialValue) {
        var name = (0, util_1.resolveName)(sheetName, cellName);
        var exists = this.nodes.has(name);
        if (!exists) {
            this.create(name, initialValue);
        }
    };
    Spreadsheet.prototype.createDynamic = function (sheetName, cellName, _a) {
        var _this = this;
        var _b = _a.dependencies, dependencies = _b === void 0 ? [] : _b, run = _a.run, initialValue = _a.initialValue, _c = _a.refresh, refresh = _c === void 0 ? false : _c;
        var name = (0, util_1.resolveName)(sheetName, cellName);
        var node = this._getNode(name);
        if (node.dynamic) {
            // If it already exists, do nothing
            return;
        }
        node.dynamic = true;
        node._run = run;
        dependencies = dependencies.map(function (dep) {
            var resolved;
            if (!(0, util_1.unresolveName)(dep).sheet) {
                resolved = (0, util_1.resolveName)(sheetName, dep);
            }
            else {
                resolved = dep;
            }
            return resolved;
        });
        node._dependencies = dependencies;
        // TODO: diff these
        this.graph.removeIncomingEdges(name);
        dependencies.forEach(function (dep) {
            _this.graph.addEdge(dep, name);
        });
        if (node.value == null || refresh) {
            this.transaction(function () {
                node.value = initialValue;
                _this._markDirty(name);
            });
        }
    };
    Spreadsheet.prototype.clearSheet = function (sheetName) {
        for (var _i = 0, _a = this.nodes.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], name_2 = _b[0], node = _b[1];
            if (node.sheet === sheetName) {
                this.nodes.delete(name_2);
            }
        }
    };
    Spreadsheet.prototype.voidCell = function (sheetName, name, voidValue) {
        if (voidValue === void 0) { voidValue = null; }
        var node = this.getNode((0, util_1.resolveName)(sheetName, name));
        node._run = null;
        node.dynamic = false;
        node.value = voidValue;
    };
    Spreadsheet.prototype.deleteCell = function (sheetName, name) {
        this.voidCell(sheetName, name);
        this.nodes.delete((0, util_1.resolveName)(sheetName, name));
    };
    Spreadsheet.prototype.addDependencies = function (sheetName, cellName, deps) {
        var _this = this;
        var name = (0, util_1.resolveName)(sheetName, cellName);
        deps = deps.map(function (dep) {
            if (!(0, util_1.unresolveName)(dep).sheet) {
                return (0, util_1.resolveName)(sheetName, dep);
            }
            return dep;
        });
        var node = this.getNode(name);
        var newDeps = deps.filter(function (dep) { return (node._dependencies || []).indexOf(dep) === -1; });
        if (newDeps.length > 0) {
            node._dependencies = (node._dependencies || []).concat(newDeps);
            newDeps.forEach(function (dep) {
                _this.graph.addEdge(dep, name);
            });
            this.recompute(name);
        }
    };
    Spreadsheet.prototype.removeDependencies = function (sheetName, cellName, deps) {
        var _this = this;
        var name = (0, util_1.resolveName)(sheetName, cellName);
        deps = deps.map(function (dep) {
            if (!(0, util_1.unresolveName)(dep).sheet) {
                return (0, util_1.resolveName)(sheetName, dep);
            }
            return dep;
        });
        var node = this.getNode(name);
        node._dependencies = (node._dependencies || []).filter(function (dep) { return deps.indexOf(dep) === -1; });
        deps.forEach(function (dep) {
            _this.graph.removeEdge(dep, name);
        });
        this.recompute(name);
    };
    Spreadsheet.prototype._markDirty = function (name) {
        this.dirtyCells.push(name);
    };
    Spreadsheet.prototype.triggerDatabaseChanges = function (oldValues, newValues) {
        var _this = this;
        var tables = new Set(__spreadArray(__spreadArray([], oldValues.keys(), true), newValues.keys(), true));
        this.startTransaction();
        // TODO: Create an index of deps so we don't have to iterate
        // across all nodes
        this.nodes.forEach(function (node) {
            if (node.sql &&
                node.sql.state.dependencies.some(function (dep) { return tables.has(dep); })) {
                _this._markDirty(node.name);
            }
        });
        this.endTransaction();
    };
    return Spreadsheet;
}());
exports.Spreadsheet = Spreadsheet;
