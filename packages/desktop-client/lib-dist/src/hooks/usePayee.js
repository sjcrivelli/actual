import { useMemo } from 'react';
import { usePayees } from './usePayees';
export function usePayee(id) {
    const payees = usePayees();
    return useMemo(() => payees.find(p => p.id === id), [id, payees]);
}
