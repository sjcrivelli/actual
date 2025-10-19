export function filterEmptyRows({ showEmpty, data, balanceTypeOp = 'totalDebts', }) {
    let showHide;
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
