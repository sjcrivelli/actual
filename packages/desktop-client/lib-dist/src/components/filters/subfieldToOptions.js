export function subfieldToOptions(field, subfield) {
    let setOptions;
    switch (field) {
        case 'amount':
            switch (subfield) {
                case 'amount-inflow':
                    setOptions = { inflow: true };
                    break;
                case 'amount-outflow':
                    setOptions = { outflow: true };
                    break;
                default:
                    break;
            }
            break;
        case 'date':
            switch (subfield) {
                case 'month':
                    setOptions = { month: true };
                    break;
                case 'year':
                    setOptions = { year: true };
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return setOptions;
}
