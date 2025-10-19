import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { SvgCheveronDown, SvgCheveronRight, SvgCog, SvgCreditCard, SvgReports, SvgStoreFront, SvgTag, SvgTuning, SvgWallet, } from '@actual-app/components/icons/v1';
import { SvgCalendar3 } from '@actual-app/components/icons/v2';
import { View } from '@actual-app/components/view';
import { Item } from './Item';
import { SecondaryItem } from './SecondaryItem';
import { useSyncServerStatus } from '@desktop-client/hooks/useSyncServerStatus';
export function PrimaryButtons() {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);
    const onToggle = useCallback(() => setOpen(open => !open), []);
    const location = useLocation();
    const syncServerStatus = useSyncServerStatus();
    const isUsingServer = syncServerStatus !== 'no-server';
    const isActive = [
        '/payees',
        '/rules',
        '/bank-sync',
        '/settings',
        '/tools',
    ].some(route => location.pathname.startsWith(route));
    useEffect(() => {
        if (isActive) {
            setOpen(true);
        }
    }, [isActive, location.pathname]);
    return (_jsxs(View, { style: { flexShrink: 0 }, children: [_jsx(Item, { title: t('Budget'), Icon: SvgWallet, to: "/budget" }), _jsx(Item, { title: t('Reports'), Icon: SvgReports, to: "/reports" }), _jsx(Item, { title: t('Schedules'), Icon: SvgCalendar3, to: "/schedules" }), _jsx(Item, { title: t('More'), Icon: isOpen ? SvgCheveronDown : SvgCheveronRight, onClick: onToggle, style: { marginBottom: isOpen ? 8 : 0 }, forceActive: !isOpen && isActive }), isOpen && (_jsxs(_Fragment, { children: [_jsx(SecondaryItem, { title: t('Payees'), Icon: SvgStoreFront, to: "/payees", indent: 15 }), _jsx(SecondaryItem, { title: t('Rules'), Icon: SvgTuning, to: "/rules", indent: 15 }), isUsingServer && (_jsx(SecondaryItem, { title: t('Bank Sync'), Icon: SvgCreditCard, to: "/bank-sync", indent: 15 })), _jsx(SecondaryItem, { title: t('Tags'), Icon: SvgTag, to: "/tags", indent: 15 }), _jsx(SecondaryItem, { title: t('Settings'), Icon: SvgCog, to: "/settings", indent: 15 })] }))] }));
}
