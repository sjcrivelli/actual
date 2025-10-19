import { useMemo } from 'react';
import { q } from 'loot-core/shared/query';
import { useQuery } from './useQuery';
export function useNotes(id) {
    const { data } = useQuery(() => q('notes').filter({ id }).select('*'), [id]);
    return useMemo(() => (data && data.length > 0 ? data[0].note : null), [data]);
}
