import { useState, useRef, useEffect } from 'react';
import { q } from 'loot-core/shared/query';
import { getStatus, getStatusLabel, getHasTransactionsQuery, } from 'loot-core/shared/schedules';
import { useSyncedPref } from './useSyncedPref';
import { accountFilter } from '@desktop-client/queries';
import { liveQuery } from '@desktop-client/queries/liveQuery';
function loadStatuses(schedules, onData, onError, upcomingLength = '7') {
    return liveQuery(getHasTransactionsQuery(schedules), {
        onData: data => {
            const hasTrans = new Set(data.filter(Boolean).map(row => row.schedule));
            const scheduleStatuses = new Map(schedules.map(s => [
                s.id,
                getStatus(s.next_date, s.completed, hasTrans.has(s.id), upcomingLength),
            ]));
            onData?.(scheduleStatuses);
        },
        onError,
    });
}
export function useSchedules({ query, } = {}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [data, setData] = useState({
        schedules: [],
        statuses: new Map(),
        statusLabels: new Map(),
    });
    const [upcomingLength] = useSyncedPref('upcomingScheduledTransactionLength');
    const scheduleQueryRef = useRef(null);
    const statusQueryRef = useRef(null);
    useEffect(() => {
        let isUnmounted = false;
        setError(undefined);
        if (!query) {
            // This usually means query is not yet set on this render cycle.
            return;
        }
        function onError(error) {
            if (!isUnmounted) {
                setError(error);
                setIsLoading(false);
            }
        }
        if (query.state.table !== 'schedules') {
            onError(new Error('Query must be a schedules query.'));
            return;
        }
        setIsLoading(true);
        scheduleQueryRef.current = liveQuery(query, {
            onData: async (schedules) => {
                statusQueryRef.current = loadStatuses(schedules, (statuses) => {
                    if (!isUnmounted) {
                        setData({
                            schedules,
                            statuses,
                            statusLabels: new Map([...statuses.keys()].map(key => [
                                key,
                                getStatusLabel(statuses.get(key) || ''),
                            ])),
                        });
                        setIsLoading(false);
                    }
                }, onError, upcomingLength);
            },
            onError,
        });
        return () => {
            isUnmounted = true;
            scheduleQueryRef.current?.unsubscribe();
            statusQueryRef.current?.unsubscribe();
        };
    }, [query, upcomingLength]);
    return {
        isLoading,
        error,
        ...data,
    };
}
export function getSchedulesQuery(view) {
    const filterByAccount = accountFilter(view, '_account');
    const filterByPayee = accountFilter(view, '_payee.transfer_acct');
    let query = q('schedules')
        .select('*')
        .filter({
        $and: [{ '_account.closed': false }],
    });
    if (view) {
        if (view === 'uncategorized') {
            query = query.filter({ next_date: null });
        }
        else {
            query = query.filter({
                $or: [filterByAccount, filterByPayee],
            });
        }
    }
    return query.orderBy({ next_date: 'desc' });
}
