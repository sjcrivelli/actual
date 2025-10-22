"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEmptyRows = filterEmptyRows;
function filterEmptyRows(_a) {
    var showEmpty = _a.showEmpty, data = _a.data, _b = _a.balanceTypeOp, balanceTypeOp = _b === void 0 ? 'totalDebts' : _b;
    var showHide;
    if (balanceTypeOp === 'totalTotals') {
        showHide =
            data['totalDebts'] !== 0 ||
                data['totalAssets'] !== 0 ||
                data['totalTotals'] !== 0;
    }
    else {
        showHide = data[balanceTypeOp] !== 0;
    }
    return !showEmpty ? showHide : true;
}
