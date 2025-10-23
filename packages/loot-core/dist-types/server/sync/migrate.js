"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = listen;
exports.unlisten = unlisten;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const index_1 = require("./index");
function migrateParentIds(_oldValues, newValues) {
    newValues.forEach((items, table) => {
        if (table === 'transactions') {
            const toApply = [];
            items.forEach(newValue => {
                if (newValue.isChild === 1 &&
                    newValue.parent_id == null &&
                    newValue.id.includes('/')) {
                    const parentId = newValue.id.split('/')[0];
                    toApply.push({
                        dataset: 'transactions',
                        row: newValue.id,
                        column: 'parent_id',
                        value: parentId,
                        timestamp: crdt_1.Timestamp.send(),
                    });
                }
            });
            if (toApply.length > 0) {
                (0, index_1.applyMessages)(toApply);
            }
        }
    });
}
let _unlisten = null;
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
//# sourceMappingURL=migrate.js.map