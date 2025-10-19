import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { send } from 'loot-core/platform/client/fetch';
import { Setting } from './UI';
import { Link } from '@desktop-client/components/common/Link';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
export function BudgetTypeSettings() {
    const [budgetType = 'envelope', setBudgetType] = useSyncedPref('budgetType');
    const [isLoading, setIsLoading] = useState(false);
    async function onSwitchType() {
        setIsLoading(true);
        try {
            const newBudgetType = budgetType === 'envelope' ? 'tracking' : 'envelope';
            setBudgetType(newBudgetType);
            // Reset the budget cache to ensure the server-side budget system is recalculated
            await send('reset-budget-cache');
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsxs(Setting, { primaryAction: _jsx(ButtonWithLoading, { onPress: onSwitchType, isLoading: isLoading, children: budgetType === 'tracking' ? (_jsx(Trans, { children: "Switch to envelope budgeting" })) : (_jsx(Trans, { children: "Switch to tracking budgeting" })) }), children: [_jsxs(Text, { children: [_jsxs(Trans, { children: [_jsx("strong", { children: "Envelope budgeting" }), " (recommended) digitally mimics physical envelope budgeting system by allocating funds into virtual envelopes for different expenses. It helps track spending and ensure you don\u2018t overspend in any category."] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/envelope-budgeting", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }), _jsxs(Text, { children: [_jsxs(Trans, { children: ["With ", _jsx("strong", { children: "tracking budgeting" }), ", category balances reset each month, and funds are managed using a \u201CSaved\u201D metric instead of \u201CTo Be Budgeted.\u201D Income is forecasted to plan future spending, rather than relying on current available funds."] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/tracking-budget", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] })] }));
}
