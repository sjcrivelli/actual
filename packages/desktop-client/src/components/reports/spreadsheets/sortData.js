"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortData = sortData;
var reverseSort = {
    asc: 'desc',
    desc: 'asc',
};
var balanceTypesToReverse = ['totalDebts', 'netDebts'];
var shouldReverse = function (balanceTypeOp) {
    return balanceTypesToReverse.includes(balanceTypeOp);
};
function sortData(_a) {
    var _b;
    var balanceTypeOp = _a.balanceTypeOp, sortByOp = _a.sortByOp;
    if (!balanceTypeOp || !sortByOp)
        return function () { return 0; };
    if (shouldReverse(balanceTypeOp)) {
        sortByOp = (_b = reverseSort[sortByOp]) !== null && _b !== void 0 ? _b : sortByOp;
    }
    // Return a comparator function
    return function (a, b) {
        var _a, _b;
        var comparison = 0;
        if (sortByOp === 'asc') {
            comparison = a[balanceTypeOp] - b[balanceTypeOp];
        }
        else if (sortByOp === 'desc') {
            comparison = b[balanceTypeOp] - a[balanceTypeOp];
        }
        else if (sortByOp === 'name') {
            comparison = ((_a = a.name) !== null && _a !== void 0 ? _a : '').localeCompare((_b = b.name) !== null && _b !== void 0 ? _b : '');
        }
        else if (sortByOp === 'budget') {
            comparison = 0;
        }
        return comparison;
    };
}
