import { useMemo } from 'react';
import { q } from 'loot-core/shared/query';
import { useQuery } from './useQuery';
export function useDashboard() {
    const { data: queryData, isLoading } = useQuery(() => q('dashboard').select('*'), []);
    return useMemo(() => ({
        isLoading,
        data: queryData || [],
    }), [isLoading, queryData]);
}
