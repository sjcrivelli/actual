
export function parametrizedField() {
    return function (field) {
        return function (id) {
            return `${field}-${id}`;
        };
    };
}

const defaultExport = { parametrizedField };
export default defaultExport;
