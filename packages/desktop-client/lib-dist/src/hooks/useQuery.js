import { useState, useMemo, useEffect } from 'react';
import { liveQuery } from '@desktop-client/queries/liveQuery';
export function useQuery(makeQuery, dependencies) {
    // Memo the resulting query. We don't care if the function
    // that creates the query changes, only the resulting query.
    // Safe to ignore the eslint warning here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const query = useMemo(makeQuery, dependencies);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(undefined);
    useEffect(() => {
        setError(query === null ? new Error('Query is null') : undefined);
        setIsLoading(!!query);
        if (!query) {
            return;
        }
        let isUnmounted = false;
        let live = liveQuery(query, {
            onData: data => {
                if (!isUnmounted) {
                    setData(data);
                    setIsLoading(false);
                }
            },
            onError: setError,
        });
        return () => {
            isUnmounted = true;
            live?.unsubscribe();
            live = null;
        };
    }, [query]);
    return {
        data,
        isLoading,
        ...(error && { error }),
    };
}
