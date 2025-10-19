const reverseSort = {
    asc: 'desc',
    desc: 'asc',
};
const balanceTypesToReverse = ['totalDebts', 'netDebts'];
const shouldReverse = (balanceTypeOp) => balanceTypesToReverse.includes(balanceTypeOp);
export function sortData({ balanceTypeOp, sortByOp, }) {
    if (!balanceTypeOp || !sortByOp)
        return () => 0;
    if (shouldReverse(balanceTypeOp)) {
        sortByOp = reverseSort[sortByOp] ?? sortByOp;
    }
    // Return a comparator function
    return (a, b) => {
        let comparison = 0;
        if (sortByOp === 'asc') {
            comparison = a[balanceTypeOp] - b[balanceTypeOp];
        }
        else if (sortByOp === 'desc') {
            comparison = b[balanceTypeOp] - a[balanceTypeOp];
        }
        else if (sortByOp === 'name') {
            comparison = (a.name ?? '').localeCompare(b.name ?? '');
        }
        else if (sortByOp === 'budget') {
            comparison = 0;
        }
        return comparison;
    };
}
