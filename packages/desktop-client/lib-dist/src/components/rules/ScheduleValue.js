import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { View } from '@actual-app/components/view';
import { q } from 'loot-core/shared/query';
import { describeSchedule } from 'loot-core/shared/schedules';
import { Value } from './Value';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { useSchedules } from '@desktop-client/hooks/useSchedules';
import { getPayeesById } from '@desktop-client/payees/payeesSlice';
export function ScheduleValue({ value }) {
    const { t } = useTranslation();
    const payees = usePayees();
    const byId = getPayeesById(payees);
    const schedulesQuery = useMemo(() => q('schedules').select('*'), []);
    const { schedules = [], isLoading } = useSchedules({ query: schedulesQuery });
    if (isLoading) {
        return (_jsx(View, { "aria-label": t('Loading...'), style: { display: 'inline-flex' }, children: _jsx(AnimatedLoading, { width: 10, height: 10 }) }));
    }
    return (_jsx(Value, { value: value, field: "rule", data: schedules, 
        // TODO: this manual type coercion does not make much sense -
        // should we instead do `schedule._payee.id`?
        describe: schedule => describeSchedule(schedule, byId[schedule._payee]) }));
}
