"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSpreadsheet = makeSpreadsheet;
// @ts-strict-ignore
function makeSpreadsheet() {
    var cells = {};
    return {
        observers: [],
        _getNode: function (sheetName, name) {
            var resolvedName = "".concat(sheetName, "!").concat(name);
            var existing = cells[resolvedName];
            if (existing) {
                return existing;
            }
            cells[resolvedName] = {
                name: resolvedName,
                sheet: sheetName,
                value: null,
            };
            return cells[resolvedName];
        },
        prewarmCache: function (sheetName, name, value) {
            if (sheetName === void 0) { sheetName = '__global'; }
            this._getNode(sheetName, name).value = value;
        },
        bind: function (sheetName, binding, cb) {
            var _this = this;
            var name = binding.name;
            var resolvedName = "".concat(sheetName, "!").concat(name);
            if (!this.observers[resolvedName]) {
                this.observers[resolvedName] = [];
            }
            this.observers[resolvedName].push(cb);
            var node = this._getNode(sheetName, name);
            cb(node);
            // bind returns a function which unsubscribes itself. In this mock
            // it's a noop.
            return function () {
                _this.observers[resolvedName] = _this.observers[resolvedName].filter(function (x) { return x !== cb; });
            };
        },
        create: function (sheetName, name, expr) {
            this.set(sheetName, name, expr);
        },
        get: function (sheetName, name) {
            return this._getNode(sheetName, name);
        },
        getValue: function (sheetName, name) {
            return this._getNode(sheetName, name).value;
        },
        set: function (sheetName, name, expr) {
            var node = this._getNode(sheetName, name);
            node.value = expr;
            var resolvedName = "".concat(sheetName, "!").concat(name);
            if (this.observers[resolvedName]) {
                this.observers[resolvedName].forEach(function (cb) { return cb(node); });
            }
        },
        getCellNames: function (sheetName) {
            var names = Object.keys(cells);
            if (sheetName) {
                return names.filter(function (name) { return name.startsWith(sheetName + '!'); });
            }
            return names;
        },
        getCells: function () {
            return cells;
        },
        setCells: function (cells) {
            var _this = this;
            Object.keys(cells).forEach(function (sheet) {
                Object.keys(cells[sheet]).forEach(function (name) {
                    _this.set(sheet, name, cells[sheet][name]);
                });
            });
        },
        deleteCells: function (cells) {
            var _this = this;
            Object.keys(cells).forEach(function (sheet) {
                cells[sheet].forEach(function (name) {
                    _this.set(sheet, name, '');
                });
            });
        },
        batchChange: function (batch) {
            this.setCells(batch.updateCells);
            this.deleteCells(batch.deleteCells);
        },
    };
}
