import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Virtualizer, GridList, ListLayout } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { RulesListItem } from './RulesListItem';
import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';
export function RulesList({ rules, isLoading, onRulePress, onRuleDelete, }) {
    const { t } = useTranslation();
    if (isLoading && rules.length === 0) {
        return (_jsx(View, { style: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 100,
            }, children: _jsx(AnimatedLoading, { style: { width: 25, height: 25 } }) }));
    }
    if (rules.length === 0) {
        return (_jsx(View, { style: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
            }, children: _jsx(Text, { style: {
                    fontSize: 16,
                    color: theme.pageTextSubdued,
                    textAlign: 'center',
                }, children: t('No rules found. Create your first rule to get started!') }) }));
    }
    return (_jsxs(View, { style: { flex: 1, overflow: 'auto' }, children: [_jsx(Virtualizer, { layout: ListLayout, layoutOptions: {
                    estimatedRowHeight: 140,
                    padding: 0,
                }, children: _jsx(GridList, { "aria-label": t('Rules'), "aria-busy": isLoading || undefined, items: rules, style: {
                        paddingBottom: MOBILE_NAV_HEIGHT,
                    }, children: rule => (_jsx(RulesListItem, { value: rule, onAction: () => onRulePress(rule), onDelete: () => onRuleDelete(rule) })) }) }), isLoading && (_jsx(View, { style: {
                    alignItems: 'center',
                    paddingTop: 20,
                }, children: _jsx(AnimatedLoading, { style: { width: 20, height: 20 } }) }))] }));
}
