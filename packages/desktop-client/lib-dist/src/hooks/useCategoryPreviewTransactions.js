import { useCallback, useMemo } from 'react';
import * as monthUtils from 'loot-core/shared/months';
import { useCategory } from './useCategory';
import { useCategoryScheduleGoalTemplates } from './useCategoryScheduleGoalTemplates';
import { usePreviewTransactions } from './usePreviewTransactions';
import { useSheetValue } from './useSheetValue';
import { categoryBalance } from '@desktop-client/spreadsheet/bindings';
export function useCategoryPreviewTransactions({ categoryId, month, }) {
    const category = useCategory(categoryId);
    const { schedules } = useCategoryScheduleGoalTemplates({
        category,
    });
    const schedulesToPreview = useMemo(() => new Set(schedules
        .filter(schedule => monthUtils.getMonth(schedule.next_date) === month)
        .map(schedule => schedule.id)), [month, schedules]);
    const categoryBalanceValue = useSheetValue(categoryBalance(categoryId, month));
    const categorySchedulesFilter = useCallback((schedule) => schedulesToPreview.has(schedule.id), [schedulesToPreview]);
    const { previewTransactions: allPreviewTransactions, runningBalances: allRunningBalances, isLoading, error, } = usePreviewTransactions({
        filter: categorySchedulesFilter,
        options: {
            startingBalance: categoryBalanceValue ?? 0,
        },
    });
    return useMemo(() => {
        if (!category || !schedulesToPreview.size) {
            return {
                previewTransactions: [],
                runningBalances: new Map(),
                isLoading,
                error,
            };
        }
        const previewTransactions = allPreviewTransactions.filter(transaction => transaction.schedule && schedulesToPreview.has(transaction.schedule));
        const transactionIds = new Set(previewTransactions.map(t => t.id));
        const runningBalances = new Map([...allRunningBalances].filter(([id]) => transactionIds.has(id)));
        return {
            previewTransactions,
            runningBalances,
            isLoading,
            error,
        };
    }, [
        allPreviewTransactions,
        allRunningBalances,
        category,
        error,
        isLoading,
        schedulesToPreview,
    ]);
}
