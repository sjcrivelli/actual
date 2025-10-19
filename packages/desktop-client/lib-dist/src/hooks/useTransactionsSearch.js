import { useState, useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import * as queries from '@desktop-client/queries';
export function useTransactionsSearch({ updateQuery, resetQuery, dateFormat, delayMs = 150, }) {
    const [isSearching, setIsSearching] = useState(false);
    const updateQueryRef = useRef(updateQuery);
    updateQueryRef.current = updateQuery;
    const resetQueryRef = useRef(resetQuery);
    resetQueryRef.current = resetQuery;
    const updateSearchQuery = useMemo(() => debounce((searchText) => {
        if (searchText === '') {
            resetQueryRef.current?.();
            setIsSearching(false);
        }
        else if (searchText) {
            resetQueryRef.current?.();
            updateQueryRef.current(previousQuery => queries.transactionsSearch(previousQuery, searchText, dateFormat));
            setIsSearching(true);
        }
    }, delayMs), [dateFormat, delayMs]);
    useEffect(() => {
        return () => updateSearchQuery.cancel();
    }, [updateSearchQuery]);
    return {
        isSearching,
        search: updateSearchQuery,
    };
}
