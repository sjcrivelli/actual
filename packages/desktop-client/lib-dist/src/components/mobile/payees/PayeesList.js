import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridList, Virtualizer, ListLayout } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { PayeesListItem } from './PayeesListItem';
import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';
export function PayeesList({ payees, ruleCounts, isRuleCountsLoading = false, isLoading = false, onPayeePress, onPayeeDelete, }) {
    const { t } = useTranslation();
    if (isLoading && payees.length === 0) {
        return (_jsx(View, { style: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 100,
            }, children: _jsx(AnimatedLoading, { style: { width: 25, height: 25 } }) }));
    }
    if (payees.length === 0) {
        return (_jsx(View, { style: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
            }, children: _jsx(Text, { style: {
                    fontSize: 16,
                    color: theme.pageTextSubdued,
                    textAlign: 'center',
                }, children: _jsx(Trans, { children: "No payees found." }) }) }));
    }
    return (_jsxs(View, { style: { flex: 1 }, children: [_jsx(Virtualizer, { layout: ListLayout, children: _jsx(GridList, { "aria-label": t('Payees'), "aria-busy": isLoading || undefined, items: payees, style: {
                        flex: 1,
                        paddingBottom: MOBILE_NAV_HEIGHT,
                        overflow: 'auto',
                    }, dependencies: [ruleCounts, isRuleCountsLoading], children: payee => (_jsx(PayeesListItem, { value: payee, ruleCount: ruleCounts.get(payee.id) ?? 0, isRuleCountLoading: isRuleCountsLoading, onAction: () => onPayeePress(payee), onDelete: () => onPayeeDelete(payee) })) }) }), isLoading && (_jsx(View, { style: {
                    alignItems: 'center',
                    paddingTop: 20,
                }, children: _jsx(AnimatedLoading, { style: { width: 20, height: 20 } }) }))] }));
}
