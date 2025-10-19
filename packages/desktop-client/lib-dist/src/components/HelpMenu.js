import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Button } from '@actual-app/components/button';
import { SvgHelp } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { SpaceBetween } from '@actual-app/components/space-between';
import { useToggle } from 'usehooks-ts';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
const getPageDocs = (page) => {
    switch (page) {
        case '/budget':
            return 'https://actualbudget.org/docs/getting-started/envelope-budgeting';
        case '/reports':
            return 'https://actualbudget.org/docs/reports/';
        case '/schedules':
            return 'https://actualbudget.org/docs/schedules';
        case '/payees':
            return 'https://actualbudget.org/docs/transactions/payees';
        case '/rules':
            return 'https://actualbudget.org/docs/budgeting/rules';
        case '/settings':
            return 'https://actualbudget.org/docs/settings';
        default:
            // All pages under /accounts, plus any missing pages
            return 'https://actualbudget.org/docs';
    }
};
function openDocsForCurrentPage() {
    window.Actual.openURLInBrowser(getPageDocs(window.location.pathname));
}
const HelpButton = forwardRef(({ onPress }, ref) => {
    const size = 15;
    return (_jsxs(Button, { variant: "bare", ref: ref, onPress: onPress, style: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
        }, children: [_jsx(SvgHelp, { width: size, height: size }), _jsx(Trans, { children: "Help" })] }));
});
HelpButton.displayName = 'HelpButton';
export const HelpMenu = () => {
    const showGoalTemplates = useFeatureFlag('goalTemplatesEnabled');
    const { t } = useTranslation();
    const [isMenuOpen, toggleMenuOpen, setMenuOpen] = useToggle();
    const menuButtonRef = useRef(null);
    const dispatch = useDispatch();
    const page = useLocation().pathname;
    const handleItemSelect = (item) => {
        switch (item) {
            case 'docs':
                openDocsForCurrentPage();
                break;
            case 'discord':
                window.Actual.openURLInBrowser('https://discord.gg/pRYNYr4W5A');
                break;
            case 'keyboard-shortcuts':
                dispatch(pushModal({ modal: { name: 'keyboard-shortcuts' } }));
                break;
            case 'goal-templates':
                dispatch(pushModal({ modal: { name: 'goal-templates' } }));
                break;
        }
    };
    useHotkeys('?', () => setMenuOpen(true), { useKey: true });
    return (_jsxs(SpaceBetween, { children: [_jsx(HelpButton, { ref: menuButtonRef, onPress: toggleMenuOpen }), _jsx(Popover, { placement: "bottom end", offset: 8, triggerRef: menuButtonRef, isOpen: isMenuOpen, onOpenChange: () => setMenuOpen(false), children: _jsx(Menu, { onMenuSelect: (item) => {
                        setMenuOpen(false);
                        handleItemSelect(item);
                    }, items: [
                        {
                            name: 'docs',
                            text: t('Documentation'),
                        },
                        {
                            name: 'discord',
                            text: t('Community support (Discord)'),
                        },
                        { name: 'keyboard-shortcuts', text: t('Keyboard shortcuts') },
                        ...(showGoalTemplates && page === '/budget'
                            ? [{ name: 'goal-templates', text: t('Goal templates') }]
                            : []),
                    ] }) })] }));
};
