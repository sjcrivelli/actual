import { useCallback, useEffect, useState } from 'react';
import { send } from 'loot-core/platform/client/fetch';
export function usePayeeRuleCounts() {
    const [ruleCounts, setRuleCounts] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const refetch = useCallback(async () => {
        setIsLoading(true);
        try {
            const counts = await send('payees-get-rule-counts');
            const countsMap = new Map(Object.entries(counts));
            setRuleCounts(countsMap);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        refetch();
    }, [refetch]);
    return { ruleCounts, isLoading, refetch };
}
