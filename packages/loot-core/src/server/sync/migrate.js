"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = listen;
exports.unlisten = unlisten;
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var index_1 = require("./index");
function migrateParentIds(_oldValues, newValues) {
    newValues.forEach(function (items, table) {
        if (table === 'transactions') {
            var toApply_1 = [];
            items.forEach(function (newValue) {
                if (newValue.isChild === 1 &&
                    newValue.parent_id == null &&
                    newValue.id.includes('/')) {
                    var parentId = newValue.id.split('/')[0];
                    toApply_1.push({
                        dataset: 'transactions',
                        row: newValue.id,
                        column: 'parent_id',
                        value: parentId,
                        timestamp: crdt_1.Timestamp.send(),
                    });
                }
            });
            if (toApply_1.length > 0) {
                (0, index_1.applyMessages)(toApply_1);
            }
        }
    });
}
var _unlisten = null;
function listen() {
    unlisten();
    _unlisten = (0, index_1.addSyncListener)(migrateParentIds);
}
function unlisten() {
    if (_unlisten) {
        _unlisten();
        _unlisten = null;
    }
}
