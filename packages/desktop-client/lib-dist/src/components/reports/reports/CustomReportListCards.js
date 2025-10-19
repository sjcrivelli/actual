import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SvgExclamationSolid } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { send, sendCatch } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { GetCardData } from './GetCardData';
import { MissingReportCard } from './MissingReportCard';
import { DateRange } from '@desktop-client/components/reports/DateRange';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { ReportCardName } from '@desktop-client/components/reports/ReportCardName';
import { calculateHasWarning } from '@desktop-client/components/reports/util';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
export function CustomReportListCards({ isEditing, report, onRemove, }) {
    // It's possible for a dashboard to reference a non-existing
    // custom report
    if (!report) {
        return (_jsx(MissingReportCard, { isEditing: isEditing, onRemove: onRemove, children: _jsx(Trans, { children: "This custom report has been deleted." }) }));
    }
    return (_jsx(CustomReportListCardsInner, { isEditing: isEditing, report: report, onRemove: onRemove }));
}
function CustomReportListCardsInner({ isEditing, report, onRemove, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [nameMenuOpen, setNameMenuOpen] = useState(false);
    const [earliestTransaction, setEarliestTransaction] = useState('');
    const [latestTransaction, setLatestTransaction] = useState('');
    const payees = usePayees();
    const accounts = useAccounts();
    const categories = useCategories();
    const hasWarning = calculateHasWarning(report.conditions ?? [], {
        categories: categories.list,
        payees,
        accounts,
    });
    const [_firstDayOfWeekIdx] = useSyncedPref('firstDayOfWeekIdx');
    const firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    useEffect(() => {
        async function run() {
            const earliestTrans = await send('get-earliest-transaction');
            const latestTrans = await send('get-latest-transaction');
            setEarliestTransaction(earliestTrans ? earliestTrans.date : monthUtils.currentDay());
            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
        }
        run();
    }, []);
    const onSaveName = async (name) => {
        const updatedReport = {
            ...report,
            name,
        };
        const response = await sendCatch('report/update', updatedReport);
        if (response.error) {
            dispatch(addNotification({
                notification: {
                    type: 'error',
                    message: t('Failed saving report name: {{error}}', {
                        error: response.error.message,
                    }),
                },
            }));
            setNameMenuOpen(true);
            return;
        }
        setNameMenuOpen(false);
    };
    return (_jsxs(ReportCard, { isEditing: isEditing, disableClick: nameMenuOpen, to: `/reports/custom/${report.id}`, menuItems: [
            {
                name: 'rename',
                text: t('Rename'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ], onMenuSelect: item => {
            switch (item) {
                case 'remove':
                    onRemove();
                    break;
                case 'rename':
                    setNameMenuOpen(true);
                    break;
            }
        }, children: [_jsxs(View, { style: { flex: 1, padding: 10 }, children: [_jsx(View, { style: {
                            flexShrink: 0,
                            paddingBottom: 5,
                        }, children: _jsxs(View, { style: { flex: 1 }, children: [_jsx(ReportCardName, { name: report.name, isEditing: nameMenuOpen, onChange: onSaveName, onClose: () => setNameMenuOpen(false) }), report.isDateStatic ? (_jsx(DateRange, { start: report.startDate, end: report.endDate })) : (_jsx(Text, { style: { color: theme.pageTextSubdued }, children: t(report.dateRange) }))] }) }), _jsx(GetCardData, { report: report, payees: payees, accounts: accounts, categories: categories, earliestTransaction: earliestTransaction, latestTransaction: latestTransaction, firstDayOfWeekIdx: firstDayOfWeekIdx, showTooltip: !isEditing })] }), hasWarning && (_jsx(View, { style: { padding: 5, position: 'absolute', bottom: 0 }, children: _jsx(Tooltip, { content: t('The widget is configured to use a non-existing filter value (i.e. category/account/payee). Edit the filters used in this report widget to remove the warning.'), placement: "bottom start", style: { ...styles.tooltip, maxWidth: 300 }, children: _jsx(SvgExclamationSolid, { width: 20, height: 20, style: { color: theme.warningText } }) }) }))] }));
}
