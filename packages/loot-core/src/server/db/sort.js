"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORT_INCREMENT = void 0;
exports.shoveSortOrders = shoveSortOrders;
exports.SORT_INCREMENT = 16384;
function midpoint(items, to) {
    var below = items[to - 1];
    var above = items[to];
    if (!below) {
        return above.sort_order / 2;
    }
    else if (!above) {
        return below.sort_order + exports.SORT_INCREMENT;
    }
    else {
        return (below.sort_order + above.sort_order) / 2;
    }
}
function shoveSortOrders(items, targetId) {
    if (targetId === void 0) { targetId = null; }
    var to = items.findIndex(function (item) { return item.id === targetId; });
    var target = items[to];
    var before = items[to - 1];
    var updates = [];
    // If no target is specified, append at the end
    if (!targetId || to === -1) {
        var order = void 0;
        if (items.length > 0) {
            // Add a new increment to whatever is the latest sort order
            order = items[items.length - 1].sort_order + exports.SORT_INCREMENT;
        }
        else {
            // If no items exist, the default is to use the first increment
            order = exports.SORT_INCREMENT;
        }
        return { updates: updates, sort_order: order };
    }
    else {
        if (target.sort_order - (before ? before.sort_order : 0) <= 2) {
            var next = to;
            var order = Math.floor(items[next].sort_order) + exports.SORT_INCREMENT;
            while (next < items.length) {
                // No need to update it if it's already greater than the current
                // order. This can happen because there may already be large
                // gaps
                if (order <= items[next].sort_order) {
                    break;
                }
                updates.push({ id: items[next].id, sort_order: order });
                next++;
                order += exports.SORT_INCREMENT;
            }
        }
        return { updates: updates, sort_order: midpoint(items, to) };
    }
}
