import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { AccountsHeader } from './AccountsHeader';
import { AccountsList } from './AccountsList';
import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';
import { Page } from '@desktop-client/components/Page';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
const useSyncSourceReadable = () => {
    const { t } = useTranslation();
    const syncSourceReadable = {
        goCardless: 'GoCardless',
        simpleFin: 'SimpleFIN',
        pluggyai: 'Pluggy.ai',
        unlinked: t('Unlinked'),
    };
    return { syncSourceReadable };
};
export function BankSync() {
    const { t } = useTranslation();
    const [floatingSidebar] = useGlobalPref('floatingSidebar');
    const { syncSourceReadable } = useSyncSourceReadable();
    const accounts = useAccounts();
    const dispatch = useDispatch();
    const { isNarrowWidth } = useResponsive();
    const [hoveredAccount, setHoveredAccount] = useState(null);
    const groupedAccounts = useMemo(() => {
        const unsorted = accounts
            .filter(a => !a.closed)
            .reduce((acc, a) => {
            const syncSource = a.account_sync_source ?? 'unlinked';
            acc[syncSource] = acc[syncSource] || [];
            acc[syncSource].push(a);
            return acc;
        }, {});
        const sortedKeys = Object.keys(unsorted).sort((keyA, keyB) => {
            if (keyA === 'unlinked')
                return 1;
            if (keyB === 'unlinked')
                return -1;
            return keyA.localeCompare(keyB);
        });
        return sortedKeys.reduce((sorted, key) => {
            sorted[key] = unsorted[key];
            return sorted;
        }, {});
    }, [accounts]);
    const onAction = async (account, action) => {
        switch (action) {
            case 'edit':
                dispatch(pushModal({
                    modal: {
                        name: 'synced-account-edit',
                        options: {
                            account,
                        },
                    },
                }));
                break;
            case 'link':
                dispatch(pushModal({
                    modal: {
                        name: 'add-account',
                        options: { upgradingAccountId: account.id },
                    },
                }));
                break;
            default:
                break;
        }
    };
    const onHover = useCallback((id) => {
        setHoveredAccount(id);
    }, []);
    return (_jsx(Page, { header: t('Bank Sync'), style: {
            marginInline: floatingSidebar && !isNarrowWidth ? 'auto' : 0,
            paddingBottom: MOBILE_NAV_HEIGHT,
        }, children: _jsxs(View, { style: { marginTop: '1em' }, children: [accounts.length === 0 && (_jsx(Text, { style: { fontSize: '1.1rem' }, children: _jsx(Trans, { children: "To use the bank syncing features, you must first add an account." }) })), Object.entries(groupedAccounts).map(([syncProvider, accounts]) => {
                    return (_jsxs(View, { style: { minHeight: 'initial' }, children: [Object.keys(groupedAccounts).length > 1 && (_jsx(Text, { style: { fontWeight: 500, fontSize: 20, margin: '.5em 0' }, children: syncSourceReadable[syncProvider] })), _jsx(AccountsHeader, { unlinked: syncProvider === 'unlinked' }), _jsx(AccountsList, { accounts: accounts, hoveredAccount: hoveredAccount, onHover: onHover, onAction: onAction })] }, syncProvider));
                })] }) }));
}
