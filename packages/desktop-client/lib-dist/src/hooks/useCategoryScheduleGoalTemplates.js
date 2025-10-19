import { useMemo } from 'react';
import { useCachedSchedules } from './useCachedSchedules';
import { useFeatureFlag } from './useFeatureFlag';
export function useCategoryScheduleGoalTemplates({ category, }) {
    const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    const { schedules: allSchedules, statuses: allStatuses, statusLabels: allStatusLabels, } = useCachedSchedules();
    return useMemo(() => {
        if (!isGoalTemplatesEnabled || !category || !category.goal_def) {
            return {
                schedules: [],
                statuses: new Map(),
                statusLabels: new Map(),
            };
        }
        let goalDefinitions = [];
        try {
            goalDefinitions = JSON.parse(category.goal_def);
        }
        catch (e) {
            console.error('Failed to parse category goal_def:', e);
            return {
                schedules: [],
                statuses: new Map(),
                statusLabels: new Map(),
            };
        }
        const scheduleGoalDefinitions = goalDefinitions.filter(g => g.type === 'schedule');
        if (!scheduleGoalDefinitions.length) {
            return {
                schedules: [],
                statuses: new Map(),
                statusLabels: new Map(),
            };
        }
        const schedules = allSchedules.filter(s => scheduleGoalDefinitions.some(g => g.name === s.name));
        const scheduleIds = new Set(schedules.map(s => s.id));
        const statuses = new Map([...allStatuses].filter(([id]) => scheduleIds.has(id)));
        const statusLabels = new Map([...allStatusLabels].filter(([id]) => scheduleIds.has(id)));
        return {
            schedules,
            statuses,
            statusLabels,
        };
    }, [
        allSchedules,
        allStatusLabels,
        allStatuses,
        category,
        isGoalTemplatesEnabled,
    ]);
}
