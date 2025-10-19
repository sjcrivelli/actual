export const numberFormatterTooltip = (value) => {
    if (typeof value === 'number') {
        return Math.round(value);
    }
    return null; // or some default value for other cases
};
