import { useMemo } from 'react';
import { useReports } from './useReports';
export function useReport(id) {
    const { data, isLoading } = useReports();
    return useMemo(() => ({
        data: data.find(report => report.id === id),
        isLoading,
    }), [data, id, isLoading]);
}
