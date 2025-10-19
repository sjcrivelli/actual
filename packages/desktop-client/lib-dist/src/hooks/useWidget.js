import { useMemo } from 'react';
import { q } from 'loot-core/shared/query';
import { useQuery } from './useQuery';
export function useWidget(id, type) {
    const { data = [], isLoading } = useQuery(() => q('dashboard').filter({ id, type }).select('*'), [id, type]);
    return useMemo(() => ({
        isLoading,
        data: data?.[0],
    }), [data, isLoading]);
}
