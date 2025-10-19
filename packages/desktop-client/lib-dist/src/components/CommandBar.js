import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SvgCog, SvgLibrary, SvgPiggyBank, SvgReports, SvgStoreFront, SvgTag, SvgTuning, SvgWallet, } from '@actual-app/components/icons/v1';
import { SvgCalendar3, SvgNotesPaperText, } from '@actual-app/components/icons/v2';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { Command } from 'cmdk';
import { CellValue, CellValueText } from './spreadsheet/CellValue';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useModalState } from '@desktop-client/hooks/useModalState';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useReports } from '@desktop-client/hooks/useReports';
import { accountBalance, allAccountBalance, offBudgetAccountBalance, onBudgetAccountBalance, } from '@desktop-client/spreadsheet/bindings';
function BalanceRow({ label, binding, }) {
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
        }, children: [_jsx(Text, { children: label }), _jsx(CellValue, { binding: binding, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: { ...styles.tnum, whiteSpace: 'nowrap', opacity: 0.9 } })) })] }));
}
export function CommandBar() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [budgetName] = useMetadataPref('budgetName');
    const { modalStack } = useModalState();
    const navigationItems = useMemo(() => [
        { id: 'budget', name: t('Budget'), path: '/budget', Icon: SvgWallet },
        {
            id: 'reports-nav',
            name: t('Reports'),
            path: '/reports',
            Icon: SvgReports,
        },
        {
            id: 'schedules',
            name: t('Schedules'),
            path: '/schedules',
            Icon: SvgCalendar3,
        },
        { id: 'payees', name: t('Payees'), path: '/payees', Icon: SvgStoreFront },
        { id: 'rules', name: t('Rules'), path: '/rules', Icon: SvgTuning },
        { id: 'tags', name: t('Tags'), path: '/tags', Icon: SvgTag },
        { id: 'settings', name: t('Settings'), path: '/settings', Icon: SvgCog },
        {
            id: 'accounts',
            name: t('All Accounts'),
            path: '/accounts',
            content: (_jsx(BalanceRow, { label: t('All Accounts'), binding: allAccountBalance() })),
            Icon: SvgLibrary,
        },
    ], [t]);
    useEffect(() => {
        // Reset search when closing
        if (!open)
            setSearch('');
    }, [open]);
    const allAccounts = useAccounts();
    const { data: customReports } = useReports();
    const accounts = allAccounts.filter(acc => !acc.closed);
    const openEventListener = useCallback((e) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            // Do not open CommandBar if a modal is already open
            if (modalStack.length > 0)
                return;
            setOpen(true);
        }
    }, [modalStack.length]);
    useEffect(() => {
        document.addEventListener('keydown', openEventListener);
        return () => document.removeEventListener('keydown', openEventListener);
    }, [openEventListener]);
    const handleNavigate = useCallback((path) => {
        setOpen(false);
        navigate(path);
    }, [navigate]);
    const sections = [
        {
            key: 'navigation',
            heading: t('Navigation'),
            items: navigationItems,
            onSelect: ({ id }) => {
                const item = navigationItems.find(item => item.id === id);
                if (!!item)
                    handleNavigate(item.path);
            },
        },
        {
            key: 'accounts',
            heading: t('Accounts'),
            items: [
                {
                    id: 'onbudget',
                    name: t('On Budget'),
                    content: (_jsx(BalanceRow, { label: t('On Budget'), binding: onBudgetAccountBalance() })),
                    Icon: SvgLibrary,
                },
                {
                    id: 'offbudget',
                    name: t('Off Budget'),
                    content: (_jsx(BalanceRow, { label: t('Off Budget'), binding: offBudgetAccountBalance() })),
                    Icon: SvgLibrary,
                },
                ...accounts.map(account => ({
                    ...account,
                    content: (_jsx(BalanceRow, { label: account.name, binding: accountBalance(account.id) })),
                    Icon: SvgPiggyBank,
                })),
            ],
            onSelect: ({ id }) => handleNavigate(`/accounts/${id}`),
        },
        {
            key: 'reports-custom',
            heading: t('Custom Reports'),
            items: customReports.map(report => ({
                ...report,
                Icon: SvgNotesPaperText,
            })),
            onSelect: ({ id }) => handleNavigate(`/reports/custom/${id}`),
        },
    ];
    const searchLower = search.toLowerCase();
    const filteredSections = sections.map(section => ({
        ...section,
        items: section.items.filter(item => item.name.toLowerCase().includes(searchLower)),
    }));
    const hasResults = filteredSections.some(section => !!section.items.length);
    return (_jsxs(Command.Dialog, { vimBindings: true, open: open, onOpenChange: setOpen, label: t('Command Bar'), "aria-label": t('Command Bar'), shouldFilter: false, className: css({
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            width: '90%',
            maxWidth: '600px',
            backgroundColor: 'var(--color-modalBackground)',
            border: '1px solid var(--color-modalBorder)',
            color: 'var(--color-pageText)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            zIndex: 3001,
        }), children: [_jsx(Command.Input, { autoFocus: true, placeholder: t('Search {{budgetName}}...', { budgetName }), value: search, onValueChange: setSearch, className: css({
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    border: 'none',
                    borderBottom: '1px solid var(--color-tableBorderSeparator)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-pageText)',
                    outline: 'none',
                    '&::placeholder': {
                        color: 'var(--color-pageTextSubdued)',
                    },
                }) }), _jsxs(Command.List, { className: css({
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: '8px 0',
                    // Hide the scrollbar
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    // Ensure content is still scrollable
                    msOverflowStyle: 'none',
                }), children: [filteredSections.map(section => !!section.items.length && (_jsx(Command.Group, { heading: section.heading, className: css({
                            padding: '0 8px',
                            '& [cmdk-group-heading]': {
                                padding: '8px 8px 4px',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: 'var(--color-pageTextSubdued)',
                                textTransform: 'uppercase',
                            },
                        }), children: section.items.map(({ id, name, Icon, content }) => (_jsxs(Command.Item, { onSelect: () => section.onSelect({ id }), value: name, className: css({
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                borderRadius: '4px',
                                margin: '0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                // Avoid showing mouse hover styles when using keyboard navigation
                                '[data-cmdk-list]:not([data-cmdk-list-nav-active]) &:hover': {
                                    backgroundColor: 'var(--color-menuItemBackgroundHover)',
                                    color: 'var(--color-menuItemTextHover)',
                                },
                                // eslint-disable-next-line actual/typography
                                "&[data-selected='true']": {
                                    backgroundColor: 'var(--color-menuItemBackgroundHover)',
                                    color: 'var(--color-menuItemTextHover)',
                                },
                            }), children: [_jsx(Icon, { width: 16, height: 16 }), content || name] }, id))) }, section.key))), !hasResults && (_jsx(Command.Empty, { className: css({
                            padding: '16px',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: 'var(--color-pageTextSubdued)',
                        }), children: _jsx(Trans, { children: "No results found" }) }))] })] }));
}
