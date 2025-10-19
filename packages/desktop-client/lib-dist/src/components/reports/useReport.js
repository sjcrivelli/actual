import { useState, useEffect } from 'react';
import { useSpreadsheet } from '@desktop-client/hooks/useSpreadsheet';
export function useReport(sheetName, getData) {
    const spreadsheet = useSpreadsheet();
    const [results, setResults] = useState(null);
    useEffect(() => {
        getData(spreadsheet, results => setResults(results));
    }, [getData]);
    return results;
}
