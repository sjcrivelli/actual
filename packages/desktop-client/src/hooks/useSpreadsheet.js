"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSpreadsheet = useSpreadsheet;
exports.SpreadsheetProvider = SpreadsheetProvider;
var react_1 = require("react");
var lru_cache_1 = require("lru-cache");
var fetch_1 = require("loot-core/platform/client/fetch");
var SpreadsheetContext = (0, react_1.createContext)(undefined);
function useSpreadsheet() {
    var context = (0, react_1.useContext)(SpreadsheetContext);
    if (!context) {
        throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
    }
    return context;
}
var GLOBAL_SHEET_NAME = '__global';
function makeSpreadsheet() {
    var cellObservers = {};
    var LRUValueCache = new lru_cache_1.LRUCache({ max: 1200 });
    var cellCache = {};
    var observersDisabled = false;
    var Spreadsheet = /** @class */ (function () {
        function Spreadsheet() {
        }
        Spreadsheet.prototype.observeCell = function (name, callback) {
            if (!cellObservers[name]) {
                cellObservers[name] = [];
            }
            cellObservers[name].push(callback);
            return function () {
                cellObservers[name] = cellObservers[name].filter(function (cb) { return cb !== callback; });
                if (cellObservers[name].length === 0) {
                    cellCache[name] = null;
                }
            };
        };
        Spreadsheet.prototype.disableObservers = function () {
            observersDisabled = true;
        };
        Spreadsheet.prototype.enableObservers = function () {
            observersDisabled = false;
        };
        Spreadsheet.prototype.prewarmCache = function (name, value) {
            LRUValueCache.set(name, value);
        };
        Spreadsheet.prototype.listen = function () {
            return (0, fetch_1.listen)('cells-changed', function (event) {
                if (!observersDisabled) {
                    // TODO: batch react so only renders once
                    event.forEach(function (node) {
                        var observers = cellObservers[node.name];
                        if (observers) {
                            observers.forEach(function (func) { return func(node); });
                            cellCache[node.name] = Promise.resolve(node);
                            LRUValueCache.set(node.name, node);
                        }
                    });
                }
            });
        };
        Spreadsheet.prototype.bind = function (sheetName, binding, callback) {
            if (sheetName === void 0) { sheetName = GLOBAL_SHEET_NAME; }
            binding = typeof binding === 'string' ? { name: binding } : binding;
            if (binding.query) {
                this.createQuery(sheetName, binding.name, binding.query);
            }
            var resolvedName = "".concat(sheetName, "!").concat(binding.name);
            var cleanup = this.observeCell(resolvedName, callback);
            // Always synchronously call with the existing value if it has one.
            // This is a display optimization to avoid flicker. The LRU cache
            // will keep a number of recent nodes in memory.
            if (LRUValueCache.has(resolvedName)) {
                var node = LRUValueCache.get(resolvedName);
                if (node) {
                    callback(node);
                }
            }
            if (cellCache[resolvedName] != null) {
                cellCache[resolvedName].then(callback);
            }
            else {
                var req_1 = this.get(sheetName, binding.name);
                cellCache[resolvedName] = req_1;
                req_1.then(function (result) {
                    // We only want to call the callback if it's still waiting on
                    // the same request. If we've received a `cells-changed` event
                    // for this already then it's already been called and we don't
                    // need to call it again (and potentially could be calling it
                    // with an old value depending on the order of messages)
                    if (cellCache[resolvedName] === req_1) {
                        LRUValueCache.set(resolvedName, result);
                        callback(result);
                    }
                });
            }
            return cleanup;
        };
        Spreadsheet.prototype.get = function (sheetName, name) {
            return (0, fetch_1.send)('get-cell', { sheetName: sheetName, name: name });
        };
        Spreadsheet.prototype.getCellNames = function (sheetName) {
            return (0, fetch_1.send)('get-cell-names', { sheetName: sheetName });
        };
        Spreadsheet.prototype.createQuery = function (sheetName, name, query) {
            return (0, fetch_1.send)('create-query', {
                sheetName: sheetName,
                name: name,
                query: query.serialize(),
            });
        };
        return Spreadsheet;
    }());
    return new Spreadsheet();
}
function SpreadsheetProvider(_a) {
    var children = _a.children;
    var spreadsheet = (0, react_1.useMemo)(function () { return makeSpreadsheet(); }, []);
    (0, react_1.useEffect)(function () {
        return spreadsheet.listen();
    }, [spreadsheet]);
    return (<SpreadsheetContext.Provider value={spreadsheet}>
      {children}
    </SpreadsheetContext.Provider>);
}
