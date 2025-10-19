import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Stack } from '@actual-app/components/stack';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import uniqueId from 'lodash/uniqueId';
import { send } from 'loot-core/platform/client/fetch';
import { q } from 'loot-core/shared/query';
import { Warning } from '@desktop-client/components/alerts';
import { BudgetAutomation } from '@desktop-client/components/budget/goals/BudgetAutomation';
import { DEFAULT_PRIORITY } from '@desktop-client/components/budget/goals/reducer';
import { useBudgetAutomationCategories } from '@desktop-client/components/budget/goals/useBudgetAutomationCategories';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useBudgetAutomations } from '@desktop-client/hooks/useBudgetAutomations';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { useNotes } from '@desktop-client/hooks/useNotes';
import { useSchedules } from '@desktop-client/hooks/useSchedules';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
function BudgetAutomationList({ automations, setAutomations, schedules, categories, style, }) {
    const [automationIds, setAutomationIds] = useState(() => {
        // automations don't have ids, so we need to generate them
        return automations.map(() => uniqueId('automation-'));
    });
    const onAdd = () => {
        const newId = uniqueId('automation-');
        setAutomationIds(prevIds => [...prevIds, newId]);
        setAutomations(prev => [
            ...prev,
            {
                type: 'simple',
                monthly: 5,
                directive: 'template',
                priority: DEFAULT_PRIORITY,
            },
        ]);
    };
    const onDelete = (index) => () => {
        setAutomations(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
        setAutomationIds(prev => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
        ]);
    };
    return (_jsxs(Stack, { spacing: 4, style: {
            overflowY: 'scroll',
            ...style,
        }, children: [automations.map((automation, index) => (_jsx(BudgetAutomation, { onDelete: onDelete(index), template: automation, categories: categories, schedules: schedules, readOnlyStyle: {
                    color: theme.pillText,
                    backgroundColor: theme.pillBackground,
                    borderRadius: 4,
                    padding: 16,
                    paddingLeft: 30,
                    paddingRight: 16,
                } }, automationIds[index]))), _jsx(Button, { onPress: onAdd, children: _jsx(Trans, { children: "Add new automation" }) })] }));
}
function BudgetAutomationMigrationWarning({ categoryId, style, }) {
    const notes = useNotes(categoryId);
    const templates = useMemo(() => {
        if (!notes)
            return null;
        const lines = notes.split('\n');
        return lines
            .flatMap(line => {
            if (line.trim().startsWith('#template'))
                return line;
            if (line.trim().startsWith('#goal'))
                return line;
            if (line.trim().startsWith('#cleanup'))
                return line;
            return [];
        })
            .join('\n');
    }, [notes]);
    if (!templates)
        return null;
    return (_jsx(Warning, { style: style, children: _jsxs(Stack, { style: { minHeight: 'unset' }, children: [_jsx(View, { children: _jsx(Trans, { children: "This category uses notes-based automations (formerly \u201Cbudget templates\u201D). We have automatically imported your existing automations below. Please review them for accuracy and hit save to complete the migration." }) }), _jsx(View, { children: _jsxs(Trans, { children: ["Original templates:", _jsx(View, { style: {
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace',
                                    marginTop: 4,
                                    padding: 12,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }, children: templates })] }) })] }) }));
}
export function BudgetAutomationsModal({ categoryId }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [automations, setAutomations] = useState({});
    const { loading } = useBudgetAutomations({
        categoryId,
        onLoaded: setAutomations,
    });
    const schedulesQuery = useMemo(() => q('schedules').select('*'), []);
    const { schedules } = useSchedules({
        query: schedulesQuery,
    });
    const categories = useBudgetAutomationCategories();
    const currentCategory = useCategory(categoryId);
    const needsMigration = currentCategory?.template_settings?.source !== 'ui';
    const onSave = async (close) => {
        if (!automations[categoryId]) {
            close();
            return;
        }
        await send('budget/set-category-automations', {
            categoriesWithTemplates: [
                {
                    id: categoryId,
                    templates: automations[categoryId],
                },
            ],
            source: 'ui',
        });
        close();
    };
    return (_jsx(Modal, { name: "category-automations-edit", containerProps: {
            style: { width: 850, height: 650, paddingBottom: 20 },
        }, children: ({ state: { close } }) => (_jsxs(Stack, { direction: "column", style: { height: '100%' }, children: [_jsx(ModalHeader, { title: t('Budget automations: {{category}}', {
                        category: currentCategory?.name,
                    }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), loading ? (_jsx(View, { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }, children: _jsx(AnimatedLoading, { style: { width: 20, height: 20 } }) })) : (_jsxs(Stack, { children: [needsMigration && (_jsx(BudgetAutomationMigrationWarning, { categoryId: categoryId })), _jsx(BudgetAutomationList, { automations: automations[categoryId] || [], setAutomations: (cb) => {
                                setAutomations(prev => ({
                                    ...prev,
                                    [categoryId]: cb(prev[categoryId] || []),
                                }));
                            }, schedules: schedules, categories: categories })] })), _jsx(View, { style: { flexGrow: 1 } }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 20 }, children: [!needsMigration && (_jsx(Link, { variant: "text", onClick: () => {
                                const templates = automations[categoryId] || [];
                                dispatch(pushModal({
                                    modal: {
                                        name: 'category-automations-unmigrate',
                                        options: { categoryId, templates },
                                    },
                                }));
                            }, children: _jsx(Trans, { children: "Un-migrate" }) })), _jsx(Button, { onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", onPress: () => onSave(close), children: _jsx(Trans, { children: "Save" }) })] })] })) }));
}
