export const setSessionReport = (propName, propValue) => {
    const storedReport = sessionStorage.report && JSON.parse(sessionStorage.getItem('report') || '');
    const result = {};
    result[propName] = propValue;
    sessionStorage.setItem('report', JSON.stringify({
        ...storedReport,
        ...result,
    }));
};
