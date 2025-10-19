import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { createBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Link } from '@desktop-client/components/common/Link';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function WelcomeScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    return (_jsxs(View, { style: {
            gap: 10,
            maxWidth: 500,
            fontSize: 15,
            maxHeight: '100vh',
            marginBlock: 20,
        }, children: [_jsx(Text, { style: styles.veryLargeText, children: t('Let’s get started!') }), _jsxs(View, { style: { overflowY: 'auto' }, children: [_jsx(Paragraph, { children: _jsxs(Trans, { children: ["Actual is a personal finance tool that focuses on beautiful design and a slick user experience.", ' ', _jsx("strong", { children: "Editing your data should be as fast as possible." }), " On top of that, we want to provide powerful tools to allow you to do whatever you want with your data."] }) }), _jsxs(Paragraph, { children: [_jsxs(Trans, { children: ["Currently, Actual implements budgeting based on a", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/budgeting/", linkColor: "purple", children: "monthly envelope system" }), "."] }), ' ', _jsxs(Trans, { children: ["Consider taking our", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/tour/", linkColor: "purple", children: "guided tour" }), ' ', "to help you get your bearings, and check out the rest of the documentation while you\u2019re there to learn more about advanced topics."] })] }), _jsx(Paragraph, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Get started by importing an existing budget file from Actual or another budgeting app, create a demo budget file, or start fresh with an empty budget. You can always create or import another budget later." }) })] }), _jsxs(View, { style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexShrink: 0,
                }, children: [_jsx(Button, { onPress: () => dispatch(pushModal({ modal: { name: 'import' } })), children: _jsx(Trans, { children: "Import my budget" }) }), _jsxs(View, { style: {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 10,
                        }, children: [_jsx(Button, { onPress: () => dispatch(createBudget({ testMode: true })), children: _jsx(Trans, { children: "View demo" }) }), _jsx(Button, { variant: "primary", autoFocus: true, onPress: () => dispatch(createBudget({})), children: _jsx(Trans, { children: "Start fresh" }) })] })] })] }));
}
