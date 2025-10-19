import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { closeBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { useDispatch } from '@desktop-client/redux';
export function OutOfSyncMigrationsModal() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const closeBudgetAndModal = (close) => {
        dispatch(closeBudget());
        close();
    };
    return (_jsx(Modal, { name: "out-of-sync-migrations", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: t('Please update Actual!') }) }), _jsxs(View, { style: {
                        padding: 15,
                        gap: 15,
                        paddingTop: 0,
                        paddingBottom: 25,
                        maxWidth: 550,
                        lineHeight: '1.5em',
                    }, children: [_jsx(Text, { children: _jsx(Paragraph, { style: { fontSize: 16 }, children: _jsx(Trans, { children: "It looks like you're using an outdated version of the Actual client. Your budget data has been updated by another client, but this client is still on the old version. For the best experience, please update Actual to the latest version." }) }) }), _jsx(Paragraph, { style: {
                                fontSize: 16,
                            }, children: _jsxs(Trans, { children: ["If you can't update Actual at this time you can find the latest release at", ' ', _jsx(Link, { variant: "external", to: "https://app.actualbudget.org", children: "app.actualbudget.org" }), ". You can use it until your client is updated."] }) }), _jsx(View, { style: {
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }, children: _jsx(Button, { variant: "primary", style: {
                                    padding: '10px 30px',
                                }, onPress: () => closeBudgetAndModal(close), children: _jsx(Trans, { children: "Close Budget" }) }) })] })] })) }));
}
